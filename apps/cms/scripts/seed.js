// filepath: apps/cms/scripts/seed.js
// Seeds the CMS from packages/content/dist/seed.json, creates the editorial roles,
// a scoped API token for the BFF, and the revalidation webhook. Safe to re-run:
// it replaces seeded content, updates roles in place and rotates the token.
//
//   pnpm --filter @p99/content export   # writes seed.json
//   npm --prefix apps/cms run seed
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const SEED_PATH = path.resolve(__dirname, '../../../packages/content/dist/seed.json');
const BFF_ENV = path.resolve(__dirname, '../../bff/.env');
const TOKEN_NAME = 'p99-bff';
const WEBHOOK_NAME = 'p99-bff-revalidate';

const items = (arr) => arr.map((text) => ({ text }));
const seo = (s) => ({ metaTitle: s.title, metaDescription: s.description, noIndex: false });
const titled = (arr, a = 'name', b = 'body') => arr.map((x) => ({ name: x[a], body: x[b] }));

async function upsertSingle(app, uid, data, publish) {
  const existing = await app.documents(uid).findFirst();
  const opts = publish ? { status: 'published' } : {};
  if (existing) await app.documents(uid).update({ documentId: existing.documentId, data, ...opts });
  else await app.documents(uid).create({ data, ...opts });
}

async function replaceCollection(app, uid, rows) {
  const existing = await app.documents(uid).findMany({ status: 'draft', limit: 1000 });
  for (const doc of existing) await app.documents(uid).delete({ documentId: doc.documentId });
  for (const data of rows) await app.documents(uid).create({ data, status: 'published' });
}

/** Page builder blocks: seed shape -> Strapi dynamic zone entries. */
function toBlock(b) {
  switch (b.type) {
    case 'hero': return {
      __component: 'blocks.hero', heading: b.heading, subheading: b.subheading,
      ...(b.primaryCta ? { primaryCta: b.primaryCta } : {}),
      ...(b.secondaryCta ? { secondaryCta: b.secondaryCta } : {}),
    };
    case 'richText': return { __component: 'blocks.rich-text', body: b.body };
    case 'featureGrid': return { __component: 'blocks.feature-grid', heading: b.heading, intro: b.intro, items: titled(b.items) };
    case 'stats': return { __component: 'blocks.stats', heading: b.heading, items: b.items };
    case 'quote': return { __component: 'blocks.quote', quote: b.quote, name: b.name, role: b.role };
    case 'faq': return { __component: 'blocks.faq', heading: b.heading, items: titled(b.items, 'question', 'answer') };
    case 'ctaBand': return { __component: 'blocks.cta-band', heading: b.heading, body: b.body, cta: b.cta };
    default: throw new Error(`Seed cannot create block type ${b.type}`);
  }
}

// ---------------------------------------------------------------------------
// Roles. docs/roles-and-access.md is the human-readable version of this table.
// ---------------------------------------------------------------------------
const CT = (n) => `api::${n}.${n}`;
const SITE_TYPES = ['global', 'home-page', 'contact-page', 'services-page', 'industries-page', 'insights-page', 'service', 'industry', 'insight', 'page'].map(CT);
const PAGE_TYPES = ['home-page', 'contact-page', 'services-page', 'industries-page', 'insights-page', 'service', 'industry'].map(CT);
const WRITING_TYPES = ['insight', 'page'].map(CT);
const LEAD = CT('lead');
const EX = (a) => `plugin::content-manager.explorer.${a}`;
const UPLOAD_ALL = ['plugin::upload.read', 'plugin::upload.assets.create', 'plugin::upload.assets.update', 'plugin::upload.assets.download', 'plugin::upload.assets.copy-link'];
const UPLOAD_READ = ['plugin::upload.read', 'plugin::upload.assets.download', 'plugin::upload.assets.copy-link'];

function rolePermissions(app) {
  const ctSvc = app.service('admin::content-type');
  const fields = (uid) => ctSvc.getNestedFields(app.contentTypes[uid], { components: app.components });
  const hasDraft = (uid) => app.contentTypes[uid].options?.draftAndPublish === true;

  const fieldAction = (action, uid, opts = {}) => ({
    action: EX(action),
    subject: uid,
    properties: { fields: opts.fields ?? fields(uid) },
    conditions: opts.conditions ?? [],
  });
  const plain = (action, uid, conditions = []) => ({ action: EX(action), subject: uid, properties: {}, conditions });
  const publish = (uid) => (hasDraft(uid) ? [plain('publish', uid)] : []);
  const media = (list) => list.map((action) => ({ action, subject: null, properties: {}, conditions: [] }));

  const full = (uid) => [fieldAction('create', uid), fieldAction('read', uid), fieldAction('update', uid), plain('delete', uid), ...publish(uid)];
  const read = (uid) => [fieldAction('read', uid)];

  return {
    'Marketing Manager': {
      description: 'Owns the website. Creates, edits, publishes and deletes all site content. Reads leads.',
      permissions: [...SITE_TYPES.flatMap(full), ...read(LEAD), ...media(UPLOAD_ALL)],
    },
    'Content Editor': {
      description: 'Edits and publishes insights, pages, services and industries. Cannot change site-wide settings or see leads.',
      permissions: [
        ...WRITING_TYPES.flatMap(full),
        ...PAGE_TYPES.flatMap((uid) => [fieldAction('read', uid), fieldAction('update', uid), ...publish(uid)]),
        ...read(CT('global')),
        ...media(UPLOAD_ALL),
      ],
    },
    'Content Writer': {
      description: 'Drafts insights and pages. Sees and edits only their own drafts. An editor reviews and publishes.',
      permissions: [
        ...WRITING_TYPES.flatMap((uid) => [
          fieldAction('create', uid),
          fieldAction('read', uid, { conditions: ['admin::is-creator'] }),
          fieldAction('update', uid, { conditions: ['admin::is-creator'] }),
        ]),
        ...media(['plugin::upload.read', 'plugin::upload.assets.create', 'plugin::upload.assets.copy-link']),
      ],
    },
    'SEO Specialist': {
      description: 'Reads all content. Edits only SEO fields: title, description, share image, noindex and canonical. An editor publishes.',
      permissions: [
        ...SITE_TYPES.flatMap((uid) => {
          const seoFields = fields(uid).filter((f) => f.startsWith('seo.'));
          return [fieldAction('read', uid), ...(seoFields.length ? [fieldAction('update', uid, { fields: seoFields })] : [])];
        }),
        ...media(UPLOAD_ALL),
      ],
    },
    Analyst: {
      description: 'Read-only access to all content and leads, for reporting. Cannot change anything.',
      permissions: [...SITE_TYPES.flatMap(read), ...read(LEAD), ...media(UPLOAD_READ)],
    },
  };
}

async function upsertRoles(app) {
  const roleSvc = app.service('admin::role');
  const defs = rolePermissions(app);
  for (const [name, def] of Object.entries(defs)) {
    let role = await roleSvc.findOne({ name });
    if (!role) role = await roleSvc.create({ name, description: def.description });
    await roleSvc.assignPermissions(role.id, def.permissions);
  }
  return Object.keys(defs);
}

// ---------------------------------------------------------------------------
function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
  );
}

function writeEnv(file, patch) {
  const example = path.resolve(path.dirname(file), '.env.example');
  let out = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : fs.readFileSync(example, 'utf8');
  for (const [k, v] of Object.entries(patch)) {
    const re = new RegExp(`^${k}=.*$`, 'm');
    out = re.test(out) ? out.replace(re, `${k}=${v}`) : `${out.trimEnd()}\n${k}=${v}\n`;
  }
  fs.writeFileSync(file, out);
}

async function main() {
  if (!fs.existsSync(SEED_PATH)) throw new Error(`Missing ${SEED_PATH}. Run: pnpm --filter @p99/content export`);
  const s = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  await upsertSingle(app, CT('global'), {
    siteName: s.site.name,
    siteUrl: s.site.url,
    tagline: s.site.tagline,
    description: s.site.description,
    contactEmail: s.site.contactEmail,
    offices: items(s.site.offices),
    primaryCta: s.site.primaryCta,
    social: s.site.social,
  }, false);

  const h = s.home;
  await upsertSingle(app, CT('home-page'), {
    seo: seo(h.seo),
    heroHeadline: h.hero.headline,
    heroSubhead: h.hero.subhead,
    heroPrimaryCta: h.hero.primaryCta,
    heroSecondaryCta: h.hero.secondaryCta,
    heroSystems: items(h.hero.systems),
    heroProof: h.hero.proof,
    shiftTitle: h.shift.title,
    shiftIntro: h.shift.intro,
    eras: h.shift.eras,
    stackTitle: h.stack.title,
    stackIntro: h.stack.intro,
    playbookTitle: h.playbook.title,
    playbookIntro: h.playbook.intro,
    playbookSteps: h.playbook.steps,
    industriesTitle: h.industries.title,
    industriesIntro: h.industries.intro,
    industriesNote: h.industries.note,
    starterTitle: h.starter.title,
    starterIntro: h.starter.intro,
    starterItems: h.starter.items.map((i) => ({ key: i.id, label: i.label, serviceSlug: i.serviceSlug })),
    starterCta: h.starter.cta,
    testimonialsTitle: h.testimonials.title,
    testimonials: h.testimonials.items,
    trustTitle: h.trust.title,
    trustIntro: h.trust.intro,
    certifications: titled(h.trust.certifications, 'name', 'detail'),
    products: h.trust.products,
    principlesTitle: h.principles.title,
    principles: h.principles.items,
    insightsTitle: h.insightsTitle,
    finalTitle: h.finalCta.title,
    finalBody: h.finalCta.body,
    finalCta: h.finalCta.cta,
  }, true);

  await upsertSingle(app, CT('contact-page'), {
    seo: seo(s.contact.seo), title: s.contact.title, intro: s.contact.intro, topics: items(s.contact.topics),
  }, true);

  for (const [n, key] of [['services', 'servicesIndex'], ['industries', 'industriesIndex'], ['insights', 'insightsIndex']]) {
    const x = s[key];
    await upsertSingle(app, CT(`${n}-page`), { seo: seo(x.seo), title: x.title, intro: x.intro }, false);
  }

  await replaceCollection(app, CT('service'), s.services.map((x) => ({
    code: x.code, name: x.name, slug: x.slug, short: x.short, summary: x.summary, problem: x.problem,
    outcomes: items(x.outcomes), capabilities: titled(x.capabilities, 'name', 'detail'), seo: seo(x.seo),
  })));

  await replaceCollection(app, CT('industry'), s.industries.map((x, i) => ({
    name: x.name, slug: x.slug, tier: x.tier, order: i, short: x.short, summary: x.summary,
    pressures: items(x.pressures), journeys: titled(x.journeys, 'name', 'detail'), seo: seo(x.seo),
  })));

  await replaceCollection(app, CT('insight'), s.insights.map((x) => ({
    title: x.title, slug: x.slug, excerpt: x.excerpt, body: x.body, author: x.author,
    readMinutes: x.readMinutes, tags: x.tags, publishedDate: x.publishedAt, seo: seo(x.seo),
  })));

  await replaceCollection(app, CT('page'), s.pages.map((p) => ({
    title: p.title, slug: p.slug, seo: seo(p.seo), blocks: p.blocks.map(toBlock),
  })));

  const roles = await upsertRoles(app);

  // Scoped API token for the BFF: read published content, create leads, nothing else.
  const readActions = [];
  for (const uid of SITE_TYPES) {
    readActions.push(`${uid}.find`);
    if (app.contentTypes[uid].kind === 'collectionType') readActions.push(`${uid}.findOne`);
  }
  const tokenSvc = app.service('admin::api-token');
  const prior = await tokenSvc.getByName(TOKEN_NAME);
  if (prior) await tokenSvc.revoke(prior.id);
  const token = await tokenSvc.create({
    name: TOKEN_NAME,
    description: 'Used by the p99soft BFF. Read content, create leads.',
    type: 'custom',
    lifespan: null,
    permissions: [...readActions, `${LEAD}.create`],
  });

  // Webhook: Strapi tells the BFF when content changes; the BFF purges and revalidates the web app.
  const bffEnv = readEnv(BFF_ENV);
  const secret = bffEnv.STRAPI_WEBHOOK_SECRET && bffEnv.STRAPI_WEBHOOK_SECRET !== 'change-me'
    ? bffEnv.STRAPI_WEBHOOK_SECRET
    : crypto.randomBytes(24).toString('hex');
  const bffUrl = process.env.BFF_PUBLIC_URL || `http://localhost:${bffEnv.PORT || 4000}`;
  const store = app.get('webhookStore');
  for (const wh of await store.findWebhooks()) if (wh.name === WEBHOOK_NAME) await store.deleteWebhook(wh.id);
  await store.createWebhook({
    name: WEBHOOK_NAME,
    url: `${bffUrl}/v1/webhooks/strapi`,
    headers: { 'x-p99-webhook-secret': secret },
    events: ['entry.create', 'entry.update', 'entry.delete', 'entry.publish', 'entry.unpublish'],
    isEnabled: true,
  });

  writeEnv(BFF_ENV, { STRAPI_TOKEN: token.accessKey, STRAPI_WEBHOOK_SECRET: secret });

  console.log(`Seeded content: ${s.services.length} services, ${s.industries.length} industries, ${s.insights.length} insights, ${s.pages.length} pages.`);
  console.log(`Roles ready: ${roles.join(', ')} (plus the built-in Super Admin).`);
  console.log(`API token "${TOKEN_NAME}" and webhook written to apps/bff/.env`);

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  if (err.details?.errors) console.error(JSON.stringify(err.details.errors, null, 2));
  process.exit(1);
});

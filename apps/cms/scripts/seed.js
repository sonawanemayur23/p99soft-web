// filepath: apps/cms/scripts/seed.js
// Seeds the CMS from packages/content/dist/seed.json, creates a scoped API token
// for the BFF and registers the revalidation webhook. Safe to re-run: it replaces
// seeded entries and rotates the token.
//
//   pnpm --filter @p99/content export   # writes seed.json
//   npm --prefix apps/cms run seed
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const SEED_PATH = path.resolve(__dirname, '../../../packages/content/dist/seed.json');
const BFF_ENV = path.resolve(__dirname, '../../bff/.env');
const TOKEN_NAME = 'p99-bff';
const WEBHOOK_NAME = 'p99-bff-revalidate';

const items = (arr) => arr.map((text) => ({ text }));
const seo = (s) => ({ metaTitle: s.title, metaDescription: s.description, noIndex: false });

async function upsertSingle(app, uid, data, publish) {
  const existing = await app.documents(uid).findFirst();
  const opts = publish ? { status: 'published' } : {};
  if (existing) {
    await app.documents(uid).update({ documentId: existing.documentId, data, ...opts });
  } else {
    await app.documents(uid).create({ data, ...opts });
  }
}

async function replaceCollection(app, uid, rows) {
  const existing = await app.documents(uid).findMany({ status: 'draft', limit: 1000 });
  for (const doc of existing) await app.documents(uid).delete({ documentId: doc.documentId });
  for (const data of rows) await app.documents(uid).create({ data, status: 'published' });
}

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
  );
}

function writeEnv(file, patch) {
  const example = path.resolve(path.dirname(file), '.env.example');
  const base = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : fs.readFileSync(example, 'utf8');
  let out = base;
  for (const [k, v] of Object.entries(patch)) {
    const re = new RegExp(`^${k}=.*$`, 'm');
    out = re.test(out) ? out.replace(re, `${k}=${v}`) : `${out.trimEnd()}\n${k}=${v}\n`;
  }
  fs.writeFileSync(file, out);
}

async function main() {
  if (!fs.existsSync(SEED_PATH)) {
    throw new Error(`Missing ${SEED_PATH}. Run: pnpm --filter @p99/content export`);
  }
  const s = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  // Single types
  await upsertSingle(app, 'api::global.global', {
    siteName: s.site.name,
    siteUrl: s.site.url,
    tagline: s.site.tagline,
    description: s.site.description,
    contactEmail: s.site.contactEmail,
    regions: s.site.regions,
    offices: items(s.site.offices),
    primaryCta: s.site.primaryCta,
    social: s.site.social,
  }, false);

  const h = s.home;
  await upsertSingle(app, 'api::home-page.home-page', {
    seo: seo(h.seo),
    heroHeadline: h.hero.headline,
    heroSubhead: h.hero.subhead,
    heroPrimaryCta: h.hero.primaryCta,
    heroSecondaryCta: h.hero.secondaryCta,
    heroSystems: items(h.hero.systems),
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
    fitTitle: h.fit.title,
    fitIntro: h.fit.intro,
    fitCriteria: h.fit.criteria.map((c) => ({ key: c.id, label: c.label, detail: c.detail })),
    fitStrong: h.fit.results.strong,
    fitPartial: h.fit.results.partial,
    fitLow: h.fit.results.low,
    fitCta: h.fit.cta,
    principlesTitle: h.principles.title,
    principles: h.principles.items,
    insightsTitle: h.insightsTitle,
    finalTitle: h.finalCta.title,
    finalBody: h.finalCta.body,
    finalCta: h.finalCta.cta,
  }, true);

  await upsertSingle(app, 'api::contact-page.contact-page', {
    seo: seo(s.contact.seo),
    title: s.contact.title,
    intro: s.contact.intro,
    topics: items(s.contact.topics),
  }, true);

  for (const [n, key] of [['services', 'servicesIndex'], ['industries', 'industriesIndex'], ['insights', 'insightsIndex']]) {
    const x = s[key];
    await upsertSingle(app, `api::${n}-page.${n}-page`, { seo: seo(x.seo), title: x.title, intro: x.intro }, false);
  }

  // Collections
  await replaceCollection(app, 'api::service.service', s.services.map((x) => ({
    code: x.code, name: x.name, slug: x.slug, short: x.short, summary: x.summary, problem: x.problem,
    outcomes: items(x.outcomes), capabilities: x.capabilities.map((c) => ({ name: c.name, body: c.detail })), seo: seo(x.seo),
  })));

  await replaceCollection(app, 'api::industry.industry', s.industries.map((x, i) => ({
    name: x.name, slug: x.slug, tier: x.tier, order: i, short: x.short, summary: x.summary,
    pressures: items(x.pressures), journeys: x.journeys.map((j) => ({ name: j.name, body: j.detail })), seo: seo(x.seo),
  })));

  await replaceCollection(app, 'api::insight.insight', s.insights.map((x) => ({
    title: x.title, slug: x.slug, excerpt: x.excerpt, body: x.body, author: x.author,
    readMinutes: x.readMinutes, tags: x.tags, publishedDate: x.publishedAt, seo: seo(x.seo),
  })));

  // Scoped API token for the BFF: read everything public, create leads, nothing else.
  const read = ['global', 'home-page', 'contact-page', 'services-page', 'industries-page', 'insights-page'].map((n) => `api::${n}.${n}.find`);
  for (const n of ['service', 'industry', 'insight']) read.push(`api::${n}.${n}.find`, `api::${n}.${n}.findOne`);
  const tokenSvc = app.service('admin::api-token');
  const prior = await tokenSvc.getByName(TOKEN_NAME);
  if (prior) await tokenSvc.revoke(prior.id);
  const token = await tokenSvc.create({
    name: TOKEN_NAME,
    description: 'Used by the p99soft BFF. Read content, create leads.',
    type: 'custom',
    lifespan: null,
    permissions: [...read, 'api::lead.lead.create'],
  });

  // Webhook: Strapi tells the BFF when content changes, the BFF purges and revalidates the web app.
  const bffEnv = readEnv(BFF_ENV);
  const secret = bffEnv.STRAPI_WEBHOOK_SECRET && bffEnv.STRAPI_WEBHOOK_SECRET !== 'change-me'
    ? bffEnv.STRAPI_WEBHOOK_SECRET
    : require('node:crypto').randomBytes(24).toString('hex');
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

  console.log('Seeded: global, home, contact, index pages,', s.services.length, 'services,',
    s.industries.length, 'industries,', s.insights.length, 'insights.');
  console.log(`API token "${TOKEN_NAME}" and webhook written to apps/bff/.env`);

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

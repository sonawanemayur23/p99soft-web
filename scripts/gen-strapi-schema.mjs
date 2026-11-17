// Generates Strapi 5 components and content types for the p99soft CMS.
// Run once: node scripts/gen-strapi-schema.mjs apps/cms
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
if (!root) throw new Error("usage: node gen-strapi-schema.mjs <cms-dir>");

const w = (p, obj) => {
  mkdirSync(join(p, ".."), { recursive: true });
  writeFileSync(p, typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) + "\n");
};

// ---------- components ----------
const components = {
  "shared/seo": {
    displayName: "SEO",
    icon: "search",
    attributes: {
      metaTitle: { type: "string", required: true, maxLength: 70 },
      metaDescription: { type: "text", required: true, maxLength: 170 },
      ogImage: { type: "media", multiple: false, allowedTypes: ["images"] },
      ogImageAlt: { type: "string" },
      noIndex: { type: "boolean", default: false },
      canonicalOverride: { type: "string" },
    },
  },
  "shared/cta": {
    displayName: "CTA",
    icon: "cursor",
    attributes: { label: { type: "string", required: true }, href: { type: "string", required: true } },
  },
  "shared/text-item": {
    displayName: "Text item",
    icon: "bulletList",
    attributes: { text: { type: "string", required: true } },
  },
  "shared/titled-text": {
    displayName: "Titled text",
    icon: "layer",
    attributes: { name: { type: "string", required: true }, body: { type: "text", required: true } },
  },
  "shared/region": {
    displayName: "Region",
    icon: "earth",
    attributes: { name: { type: "string", required: true }, role: { type: "string", required: true } },
  },
  "home/era": {
    displayName: "Era",
    icon: "clock",
    attributes: {
      name: { type: "string", required: true },
      when: { type: "string", required: true },
      body: { type: "text", required: true },
    },
  },
  "home/criterion": {
    displayName: "Fit criterion",
    icon: "check",
    attributes: {
      key: { type: "string", required: true },
      label: { type: "string", required: true },
      detail: { type: "string", required: true },
    },
  },
};

for (const [uid, def] of Object.entries(components)) {
  const [cat, name] = uid.split("/");
  w(join(root, "src/components", cat, `${name}.json`), {
    collectionName: `components_${cat}_${name.replace(/-/g, "_")}`,
    info: { displayName: def.displayName, icon: def.icon },
    options: {},
    attributes: def.attributes,
  });
}

const seo = { type: "component", component: "shared.seo", repeatable: false, required: true };
const cta = { type: "component", component: "shared.cta", repeatable: false, required: true };
const rep = (component) => ({ type: "component", component, repeatable: true });

// ---------- content types ----------
const types = {
  global: {
    kind: "singleType",
    displayName: "Global",
    pluralName: "globals",
    draftAndPublish: false,
    attributes: {
      siteName: { type: "string", required: true },
      siteUrl: { type: "string", required: true },
      tagline: { type: "string", required: true },
      description: { type: "text", required: true },
      contactEmail: { type: "email", required: true },
      regions: rep("shared.region"),
      offices: rep("shared.text-item"),
      primaryCta: cta,
      social: rep("shared.cta"),
      defaultOgImage: { type: "media", multiple: false, allowedTypes: ["images"] },
    },
  },
  "home-page": {
    kind: "singleType",
    displayName: "Home page",
    pluralName: "home-pages",
    draftAndPublish: true,
    attributes: {
      seo,
      heroHeadline: { type: "string", required: true },
      heroSubhead: { type: "text", required: true },
      heroPrimaryCta: cta,
      heroSecondaryCta: cta,
      heroSystems: rep("shared.text-item"),
      shiftTitle: { type: "string", required: true },
      shiftIntro: { type: "text", required: true },
      eras: rep("home.era"),
      stackTitle: { type: "string", required: true },
      stackIntro: { type: "text", required: true },
      playbookTitle: { type: "string", required: true },
      playbookIntro: { type: "text", required: true },
      playbookSteps: rep("shared.titled-text"),
      industriesTitle: { type: "string", required: true },
      industriesIntro: { type: "text", required: true },
      industriesNote: { type: "string" },
      fitTitle: { type: "string", required: true },
      fitIntro: { type: "text", required: true },
      fitCriteria: rep("home.criterion"),
      fitStrong: { type: "text", required: true },
      fitPartial: { type: "text", required: true },
      fitLow: { type: "text", required: true },
      fitCta: cta,
      principlesTitle: { type: "string", required: true },
      principles: rep("shared.titled-text"),
      insightsTitle: { type: "string", required: true },
      finalTitle: { type: "string", required: true },
      finalBody: { type: "text", required: true },
      finalCta: cta,
    },
  },
  "contact-page": {
    kind: "singleType",
    displayName: "Contact page",
    pluralName: "contact-pages",
    draftAndPublish: true,
    attributes: {
      seo,
      title: { type: "string", required: true },
      intro: { type: "text", required: true },
      topics: rep("shared.text-item"),
    },
  },
  ...Object.fromEntries(
    ["services", "industries", "insights"].map((n) => [
      `${n}-page`,
      {
        kind: "singleType",
        displayName: `${n[0].toUpperCase()}${n.slice(1)} page`,
        pluralName: `${n}-pages`,
        draftAndPublish: false,
        attributes: { seo, title: { type: "string", required: true }, intro: { type: "text", required: true } },
      },
    ]),
  ),
  service: {
    kind: "collectionType",
    displayName: "Service",
    pluralName: "services",
    draftAndPublish: true,
    attributes: {
      code: { type: "enumeration", enum: ["L0", "L1", "L2", "L3", "L4", "L5", "L6"], required: true, unique: true },
      name: { type: "string", required: true },
      slug: { type: "uid", targetField: "name", required: true },
      short: { type: "string", required: true },
      summary: { type: "text", required: true },
      problem: { type: "text", required: true },
      outcomes: rep("shared.text-item"),
      capabilities: rep("shared.titled-text"),
      seo,
    },
  },
  industry: {
    kind: "collectionType",
    displayName: "Industry",
    pluralName: "industries",
    draftAndPublish: true,
    attributes: {
      name: { type: "string", required: true },
      slug: { type: "uid", targetField: "name", required: true },
      tier: { type: "enumeration", enum: ["anchor", "adjacent", "selective"], required: true },
      order: { type: "integer", default: 0 },
      short: { type: "string", required: true },
      summary: { type: "text", required: true },
      pressures: rep("shared.text-item"),
      journeys: rep("shared.titled-text"),
      seo,
    },
  },
  insight: {
    kind: "collectionType",
    displayName: "Insight",
    pluralName: "insights",
    draftAndPublish: true,
    attributes: {
      title: { type: "string", required: true },
      slug: { type: "uid", targetField: "title", required: true },
      excerpt: { type: "text", required: true, maxLength: 300 },
      body: { type: "richtext", required: true },
      author: { type: "string", required: true, default: "P99soft" },
      readMinutes: { type: "integer", required: true, min: 1 },
      tags: { type: "json" },
      publishedDate: { type: "date", required: true },
      seo,
    },
  },
  lead: {
    kind: "collectionType",
    displayName: "Lead",
    pluralName: "leads",
    draftAndPublish: false,
    attributes: {
      name: { type: "string", required: true },
      email: { type: "email", required: true },
      company: { type: "string", required: true },
      role: { type: "string" },
      topic: { type: "string", required: true },
      message: { type: "text", required: true },
      fitScore: { type: "integer" },
      source: { type: "string" },
    },
  },
};

for (const [name, def] of Object.entries(types)) {
  const base = join(root, "src/api", name);
  w(join(base, "content-types", name, "schema.json"), {
    kind: def.kind,
    collectionName: def.pluralName.replace(/-/g, "_"),
    info: { singularName: name, pluralName: def.pluralName, displayName: def.displayName },
    options: { draftAndPublish: def.draftAndPublish },
    pluginOptions: {},
    attributes: def.attributes,
  });
  const uid = `api::${name}.${name}`;
  w(join(base, "routes", `${name}.ts`), `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreRouter('${uid}');\n`);
  w(join(base, "controllers", `${name}.ts`), `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreController('${uid}');\n`);
  w(join(base, "services", `${name}.ts`), `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreService('${uid}');\n`);
}
console.log("generated", Object.keys(components).length, "components and", Object.keys(types).length, "content types");

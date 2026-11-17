// filepath: apps/bff/src/normalize.ts
// Strapi documents -> "source shapes". Source shapes are identical to the bundled
// seed content, so the CMS path and the fallback path share one composer.
import type { Block, ContactPage, HomePage, Industry, Insight, Page, Service, SiteSettings } from "@p99/contracts";
import { mediaUrl } from "./strapi";

type Media = { url?: string } | null;
type CmsSeo = { metaTitle: string; metaDescription: string; ogImage?: Media; ogImageAlt?: string; noIndex?: boolean; canonicalOverride?: string };
type TextItem = { text: string };
type Titled = { name: string; body: string };
type CmsCta = { label: string; href: string };

export type SeoSource = {
  title: string;
  description: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
  canonicalOverride?: string;
};

type WithSeo<T extends { seo: unknown }> = Omit<T, "seo"> & { seo: SeoSource };

export type SiteSource = Omit<SiteSettings, "nav" | "footer">;
export type HomeSource = Omit<HomePage, "seo" | "stack" | "industries" | "insights" | "starter"> & {
  seo: SeoSource;
  starter: Omit<HomePage["starter"], "services">;
  stack: { title: string; intro: string };
  industries: { title: string; intro: string; note: string };
  insightsTitle: string;
};
export type ContactSource = WithSeo<ContactPage>;
export type IndexSource = { title: string; intro: string; seo: SeoSource };
export type ServiceSource = WithSeo<Service>;
export type IndustrySource = WithSeo<Industry>;
export type InsightSource = WithSeo<Insight>;
export type PageSource = Omit<WithSeo<Page>, "updatedAt"> & { updatedAt?: string };

export const seoFrom = (s: CmsSeo): SeoSource => ({
  title: s.metaTitle,
  description: s.metaDescription,
  ogImage: mediaUrl(s.ogImage),
  ogImageAlt: s.ogImageAlt || undefined,
  noIndex: s.noIndex ?? false,
  canonicalOverride: s.canonicalOverride || undefined,
});

const texts = (a: TextItem[] | undefined) => (a ?? []).map((t) => t.text);
const cta = (c: CmsCta) => ({ label: c.label, href: c.href });
const titled = (a: Titled[] | undefined) => (a ?? []).map((t) => ({ name: t.name, body: t.body }));

// ---------- populate maps (what to ask Strapi for) ----------
const seoPop = { populate: { ogImage: true } };
export const populate = {
  global: { offices: true, primaryCta: true, social: true, defaultOgImage: true },
  home: {
    seo: seoPop, heroPrimaryCta: true, heroSecondaryCta: true, heroSystems: true, heroProof: true, eras: true,
    playbookSteps: true, starterItems: true, starterCta: true, testimonials: true, certifications: true,
    products: true, principles: true, finalCta: true,
  },
  contact: { seo: seoPop, topics: true },
  index: { seo: seoPop },
  service: { seo: seoPop, outcomes: true, capabilities: true },
  industry: { seo: seoPop, pressures: true, journeys: true },
  insight: { seo: seoPop },
  page: {
    seo: seoPop,
    blocks: {
      on: {
        "blocks.hero": { populate: { primaryCta: true, secondaryCta: true } },
        "blocks.rich-text": true,
        "blocks.feature-grid": { populate: { items: true } },
        "blocks.stats": { populate: { items: true } },
        "blocks.quote": true,
        "blocks.faq": { populate: { items: true } },
        "blocks.image": { populate: { image: true } },
        "blocks.cta-band": { populate: { cta: true } },
      },
    },
  },
} as const;

// ---------- Strapi raw types (only the fields we read) ----------
/* eslint-disable @typescript-eslint/no-explicit-any -- Strapi documents are untyped at this boundary; the composer validates output with zod. */
export type Doc = Record<string, any>;

export function siteFromCms(d: Doc): SiteSource {
  return {
    name: d.siteName,
    url: d.siteUrl,
    tagline: d.tagline,
    description: d.description,
    contactEmail: d.contactEmail,
    offices: texts(d.offices),
    primaryCta: cta(d.primaryCta),
    social: (d.social ?? []).map(cta),
    defaultOgImage: mediaUrl(d.defaultOgImage),
  };
}

export function homeFromCms(d: Doc): HomeSource {
  return {
    seo: seoFrom(d.seo),
    hero: {
      headline: d.heroHeadline,
      subhead: d.heroSubhead,
      primaryCta: cta(d.heroPrimaryCta),
      secondaryCta: cta(d.heroSecondaryCta),
      systems: texts(d.heroSystems),
      proof: (d.heroProof ?? []).map((p: Doc) => ({ value: p.value, label: p.label })),
    },
    shift: {
      title: d.shiftTitle,
      intro: d.shiftIntro,
      eras: (d.eras ?? []).map((e: Doc) => ({ name: e.name, when: e.when, body: e.body })),
    },
    stack: { title: d.stackTitle, intro: d.stackIntro },
    playbook: { title: d.playbookTitle, intro: d.playbookIntro, steps: titled(d.playbookSteps) },
    industries: { title: d.industriesTitle, intro: d.industriesIntro, note: d.industriesNote ?? "" },
    starter: {
      title: d.starterTitle,
      intro: d.starterIntro,
      items: (d.starterItems ?? []).map((i: Doc) => ({ id: i.key, label: i.label, serviceSlug: i.serviceSlug })),
      cta: cta(d.starterCta),
    },
    testimonials: {
      title: d.testimonialsTitle,
      items: (d.testimonials ?? []).map((t: Doc) => ({ quote: t.quote, name: t.name, role: t.role })),
    },
    trust: {
      title: d.trustTitle,
      intro: d.trustIntro,
      certifications: (d.certifications ?? []).map((c: Doc) => ({ name: c.name, detail: c.body })),
      products: (d.products ?? []).map((p: Doc) => ({ name: p.name, body: p.body, href: p.href })),
    },
    principles: { title: d.principlesTitle, items: titled(d.principles) },
    insightsTitle: d.insightsTitle,
    finalCta: { title: d.finalTitle, body: d.finalBody, cta: cta(d.finalCta) },
  };
}

export function contactFromCms(d: Doc): ContactSource {
  return { seo: seoFrom(d.seo), title: d.title, intro: d.intro, topics: texts(d.topics) };
}

export function indexFromCms(d: Doc): IndexSource {
  return { seo: seoFrom(d.seo), title: d.title, intro: d.intro };
}

export function serviceFromCms(d: Doc): ServiceSource {
  return {
    code: d.code,
    slug: d.slug,
    name: d.name,
    short: d.short,
    summary: d.summary,
    problem: d.problem,
    outcomes: texts(d.outcomes),
    capabilities: (d.capabilities ?? []).map((c: Doc) => ({ name: c.name, detail: c.body })),
    seo: seoFrom(d.seo),
  };
}

export function industryFromCms(d: Doc): IndustrySource {
  return {
    slug: d.slug,
    name: d.name,
    tier: d.tier,
    short: d.short,
    summary: d.summary,
    pressures: texts(d.pressures),
    journeys: (d.journeys ?? []).map((j: Doc) => ({ name: j.name, detail: j.body })),
    seo: seoFrom(d.seo),
  };
}

export function insightFromCms(d: Doc): InsightSource {
  return {
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    body: d.body,
    author: d.author,
    readMinutes: d.readMinutes,
    tags: Array.isArray(d.tags) ? d.tags : [],
    publishedAt: d.publishedDate,
    updatedAt: (d.updatedAt ?? d.publishedDate).slice(0, 10),
    seo: seoFrom(d.seo),
  };
}

const optCta = (c: CmsCta | null | undefined) => (c?.label && c?.href ? cta(c) : undefined);

/** Dynamic zone entry -> contract block. Unknown components are dropped, never rendered raw. */
export function blockFromCms(b: Doc): Block | null {
  switch (b.__component) {
    case "blocks.hero":
      return { type: "hero", heading: b.heading, subheading: b.subheading || undefined, primaryCta: optCta(b.primaryCta), secondaryCta: optCta(b.secondaryCta) };
    case "blocks.rich-text":
      return { type: "richText", body: b.body };
    case "blocks.feature-grid":
      return { type: "featureGrid", heading: b.heading, intro: b.intro || undefined, items: titled(b.items) };
    case "blocks.stats":
      return { type: "stats", heading: b.heading || undefined, items: (b.items ?? []).map((i: Doc) => ({ value: i.value, label: i.label })) };
    case "blocks.quote":
      return { type: "quote", quote: b.quote, name: b.name, role: b.role || undefined };
    case "blocks.faq":
      return { type: "faq", heading: b.heading, items: (b.items ?? []).map((i: Doc) => ({ question: i.name, answer: i.body })) };
    case "blocks.image": {
      const url = mediaUrl(b.image);
      return url ? { type: "image", url, alt: b.alt, caption: b.caption || undefined, width: b.image?.width, height: b.image?.height } : null;
    }
    case "blocks.cta-band":
      return { type: "ctaBand", heading: b.heading, body: b.body || undefined, cta: cta(b.cta) };
    default:
      return null;
  }
}

export function pageFromCms(d: Doc): PageSource {
  return {
    slug: d.slug,
    title: d.title,
    updatedAt: (d.updatedAt ?? "").slice(0, 10) || undefined,
    seo: seoFrom(d.seo),
    blocks: (d.blocks ?? []).map(blockFromCms).filter((b: Block | null): b is Block => b !== null),
  };
}

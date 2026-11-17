// filepath: apps/bff/src/normalize.ts
// Strapi documents -> "source shapes". Source shapes are identical to the bundled
// seed content, so the CMS path and the fallback path share one composer.
import type { ContactPage, HomePage, Industry, Insight, Service, SiteSettings } from "@p99/contracts";
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
export type HomeSource = Omit<HomePage, "seo" | "stack" | "industries" | "insights"> & {
  seo: SeoSource;
  stack: { title: string; intro: string };
  industries: { title: string; intro: string; note: string };
  insightsTitle: string;
};
export type ContactSource = WithSeo<ContactPage>;
export type IndexSource = { title: string; intro: string; seo: SeoSource };
export type ServiceSource = WithSeo<Service>;
export type IndustrySource = WithSeo<Industry>;
export type InsightSource = WithSeo<Insight>;

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
  global: { regions: true, offices: true, primaryCta: true, social: true, defaultOgImage: true },
  home: {
    seo: seoPop, heroPrimaryCta: true, heroSecondaryCta: true, heroSystems: true, eras: true,
    playbookSteps: true, fitCriteria: true, fitCta: true, principles: true, finalCta: true,
  },
  contact: { seo: seoPop, topics: true },
  index: { seo: seoPop },
  service: { seo: seoPop, outcomes: true, capabilities: true },
  industry: { seo: seoPop, pressures: true, journeys: true },
  insight: { seo: seoPop },
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
    regions: (d.regions ?? []).map((r: Doc) => ({ name: r.name, role: r.role })),
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
    },
    shift: {
      title: d.shiftTitle,
      intro: d.shiftIntro,
      eras: (d.eras ?? []).map((e: Doc) => ({ name: e.name, when: e.when, body: e.body })),
    },
    stack: { title: d.stackTitle, intro: d.stackIntro },
    playbook: { title: d.playbookTitle, intro: d.playbookIntro, steps: titled(d.playbookSteps) },
    industries: { title: d.industriesTitle, intro: d.industriesIntro, note: d.industriesNote ?? "" },
    fit: {
      title: d.fitTitle,
      intro: d.fitIntro,
      criteria: (d.fitCriteria ?? []).map((c: Doc) => ({ id: c.key, label: c.label, detail: c.detail })),
      results: { strong: d.fitStrong, partial: d.fitPartial, low: d.fitLow },
      cta: cta(d.fitCta),
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

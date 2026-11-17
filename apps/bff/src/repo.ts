// filepath: apps/bff/src/repo.ts
// Content repository. Each loader tries Strapi (through the cache) and falls back
// to the bundled seed when Strapi is down or returns content that fails validation.
import * as seed from "@p99/content";
import { TaggedCache } from "./cache";
import { env } from "./env";
import {
  contactFromCms, homeFromCms, indexFromCms, industryFromCms, insightFromCms, pageFromCms, populate,
  serviceFromCms, siteFromCms,
  type ContactSource, type Doc, type HomeSource, type IndexSource, type IndustrySource,
  type InsightSource, type PageSource, type ServiceSource, type SiteSource,
} from "./normalize";
import { CmsNotFoundError, strapi } from "./strapi";

export const cache = new TaggedCache(env.CACHE_TTL * 1000);

export type Sourced<T> = { value: T; source: "cms" | "fallback" };

const log = (msg: string) => console.warn(`[bff] ${new Date().toISOString()} ${msg}`);

/** Deep-clone seed data so readonly literals become plain mutable objects. */
const fromSeed = <T>(v: unknown): T => structuredClone(v) as T;

async function load<T>(key: string, tags: string[], cms: () => Promise<T>, fallback: () => T | undefined): Promise<Sourced<T>> {
  try {
    return { value: await cache.wrap(key, tags, cms), source: "cms" };
  } catch (err) {
    if (err instanceof CmsNotFoundError) throw err;
    const fb = fallback();
    if (fb === undefined) throw new CmsNotFoundError(key);
    log(`fallback for ${key}: ${(err as Error).message}`);
    return { value: fb, source: "fallback" };
  }
}

export const repo = {
  site: () =>
    load<SiteSource>("site", ["site"], async () => siteFromCms(await strapi.single<Doc>("global", populate.global)), () => fromSeed(seed.site)),

  home: () =>
    load<HomeSource>("home", ["home"], async () => homeFromCms(await strapi.single<Doc>("home-page", populate.home)), () => fromSeed(seed.home)),

  contact: () =>
    load<ContactSource>("contact", ["contact"], async () => contactFromCms(await strapi.single<Doc>("contact-page", populate.contact)), () => fromSeed(seed.contact)),

  indexPage: (kind: "services" | "industries" | "insights") =>
    load<IndexSource>(`${kind}-page`, [`${kind}-page`], async () => indexFromCms(await strapi.single<Doc>(`${kind}-page`, populate.index)),
      () => fromSeed({ services: seed.servicesIndex, industries: seed.industriesIndex, insights: seed.insightsIndex }[kind])),

  services: () =>
    load<ServiceSource[]>("services", ["services"], async () => (await strapi.many<Doc>("services", populate.service)).map(serviceFromCms), () => fromSeed(seed.services)),

  industries: () =>
    load<IndustrySource[]>("industries", ["industries"], async () => (await strapi.many<Doc>("industries", populate.industry)).map(industryFromCms), () => fromSeed(seed.industries)),

  insights: () =>
    load<InsightSource[]>("insights", ["insights"], async () => (await strapi.many<Doc>("insights", populate.insight)).map(insightFromCms), () => fromSeed(seed.insights)),

  pages: () =>
    load<PageSource[]>("pages", ["pages"], async () => (await strapi.many<Doc>("pages", populate.page)).map(pageFromCms), () => fromSeed(seed.pages)),

  page: (slug: string) =>
    load<PageSource>(`page:${slug}`, ["pages", `page:${slug}`], async () => pageFromCms(await strapi.bySlug<Doc>("pages", slug, populate.page)),
      () => fromSeed(seed.pages.find((p) => p.slug === slug))),

  service: (slug: string) =>
    load<ServiceSource>(`service:${slug}`, ["services", `service:${slug}`], async () => serviceFromCms(await strapi.bySlug<Doc>("services", slug, populate.service)),
      () => fromSeed(seed.services.find((s) => s.slug === slug))),

  industry: (slug: string) =>
    load<IndustrySource>(`industry:${slug}`, ["industries", `industry:${slug}`], async () => industryFromCms(await strapi.bySlug<Doc>("industries", slug, populate.industry)),
      () => fromSeed(seed.industries.find((s) => s.slug === slug))),

  insight: (slug: string) =>
    load<InsightSource>(`insight:${slug}`, ["insights", `insight:${slug}`], async () => insightFromCms(await strapi.bySlug<Doc>("insights", slug, populate.insight)),
      () => fromSeed(seed.insights.find((s) => s.slug === slug))),
};

/** Strapi model uid -> cache tags (BFF) and Next.js revalidation tags (web). Same names on both sides. */
export function tagsForModel(model: string, slug?: string): string[] {
  const map: Record<string, string[]> = {
    global: ["site"],
    "home-page": ["home"],
    "contact-page": ["contact"],
    "services-page": ["services-page"],
    "industries-page": ["industries-page"],
    "insights-page": ["insights-page"],
    service: ["services", "site", "home", "sitemap", ...(slug ? [`service:${slug}`] : [])],
    industry: ["industries", "site", "home", "sitemap", ...(slug ? [`industry:${slug}`] : [])],
    insight: ["insights", "home", "sitemap", ...(slug ? [`insight:${slug}`] : [])],
    page: ["pages", "site", "sitemap", ...(slug ? [`page:${slug}`] : [])],
  };
  return map[model] ?? [];
}

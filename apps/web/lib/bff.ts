// filepath: apps/web/lib/bff.ts
// The web app's only data source. It talks to the BFF, never to Strapi.
import "server-only";
import { notFound } from "next/navigation";
import type {
  BffEnvelope, ContactPage, HomePage, IndustriesIndex, Industry, Insight, InsightsIndex,
  Page, Service, ServicesIndex, SiteSettings, SitemapEntry,
} from "@p99/contracts";

const BFF_URL = process.env.BFF_URL ?? "http://localhost:4000";
const REVALIDATE_SECONDS = 300;

async function get<T>(path: string, tags: string[]): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BFF_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS, tags } });
  } catch (err) {
    throw new Error(`BFF unreachable at ${BFF_URL}. Start it with "pnpm --filter @p99/bff dev". (${(err as Error).message})`);
  }
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`BFF ${res.status} for ${path}`);
  return ((await res.json()) as BffEnvelope<T>).data;
}

export const bff = {
  site: () => get<SiteSettings>("/v1/site", ["site", "services", "industries", "pages"]),
  pages: () => get<{ slug: string; title: string }[]>("/v1/content-pages", ["pages"]),
  page: (slug: string) => get<Page>(`/v1/content-pages/${encodeURIComponent(slug)}`, ["pages", `page:${slug}`]),
  home: () => get<HomePage>("/v1/pages/home", ["home", "site", "services", "industries", "insights"]),
  contact: () => get<ContactPage>("/v1/pages/contact", ["contact"]),
  services: () => get<ServicesIndex>("/v1/services", ["services", "services-page"]),
  service: (slug: string) => get<Service>(`/v1/services/${encodeURIComponent(slug)}`, ["services", `service:${slug}`]),
  industries: () => get<IndustriesIndex>("/v1/industries", ["industries", "industries-page"]),
  industry: (slug: string) => get<Industry>(`/v1/industries/${encodeURIComponent(slug)}`, ["industries", `industry:${slug}`]),
  insights: () => get<InsightsIndex>("/v1/insights", ["insights", "insights-page"]),
  insight: (slug: string) => get<Insight>(`/v1/insights/${encodeURIComponent(slug)}`, ["insights", `insight:${slug}`]),
  sitemap: () => get<SitemapEntry[]>("/v1/sitemap", ["sitemap", "services", "industries", "insights", "pages"]),
};

export const bffBaseUrl = BFF_URL;

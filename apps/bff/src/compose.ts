// filepath: apps/bff/src/compose.ts
// Source shapes -> validated view models. This is where the BFF earns its name:
// it joins content across types (home + services + industries + insights),
// builds navigation from collections, and attaches SEO and JSON-LD.
import {
  ContactPage, HomePage, Industry, IndustriesIndex, Insight, InsightsIndex,
  Service, ServicesIndex, SiteSettings, type InsightSummary, type IndustrySummary,
  type ServiceSummary, type SitemapEntry,
} from "@p99/contracts";
import type {
  ContactSource, HomeSource, IndexSource, IndustrySource, InsightSource, ServiceSource, SiteSource,
} from "./normalize";
import {
  articleLd, breadcrumbLd, buildSeo, ogImagePath, organizationLd, serviceLd, websiteLd,
} from "./seo";

const LAYER_ORDER = ["L0", "L1", "L2", "L3", "L4", "L5", "L6"];
const TIER_ORDER = ["anchor", "adjacent", "selective"];

export const toServiceSummary = (s: ServiceSource): ServiceSummary => ({ code: s.code, slug: s.slug, name: s.name, short: s.short });
export const toIndustrySummary = (i: IndustrySource): IndustrySummary => ({ slug: i.slug, name: i.name, tier: i.tier, short: i.short });
export const toInsightSummary = (x: InsightSource): InsightSummary => ({
  slug: x.slug, title: x.title, excerpt: x.excerpt, publishedAt: x.publishedAt,
  readMinutes: x.readMinutes, author: x.author, tags: x.tags,
});

export const sortServices = (a: ServiceSource[]) => [...a].sort((x, y) => LAYER_ORDER.indexOf(x.code) - LAYER_ORDER.indexOf(y.code));
export const sortIndustries = (a: IndustrySource[]) => [...a].sort((x, y) => TIER_ORDER.indexOf(x.tier) - TIER_ORDER.indexOf(y.tier));
export const sortInsights = (a: InsightSource[]) => [...a].sort((x, y) => y.publishedAt.localeCompare(x.publishedAt));

export function composeSite(site: SiteSource, services: ServiceSource[], industries: IndustrySource[]): SiteSettings {
  const svc = sortServices(services);
  const ind = sortIndustries(industries);
  return SiteSettings.parse({
    ...site,
    nav: [
      { label: "Services", href: "/services", children: svc.map((s) => ({ label: s.name, href: `/services/${s.slug}`, note: s.code })) },
      { label: "Industries", href: "/industries", children: ind.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })) },
      { label: "Insights", href: "/insights" },
    ],
    footer: [
      { title: "Services", links: svc.map((s) => ({ label: s.name, href: `/services/${s.slug}` })) },
      { title: "Industries", links: ind.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })) },
      { title: "Company", links: [{ label: "Insights", href: "/insights" }, { label: "Contact", href: "/contact" }, ...site.social] },
    ],
  });
}

export function composeHome(h: HomeSource, site: SiteSource, services: ServiceSource[], industries: IndustrySource[], insights: InsightSource[]): HomePage {
  return HomePage.parse({
    seo: buildSeo({
      ...h.seo,
      path: "/",
      ogImage: h.seo.ogImage ?? site.defaultOgImage ?? ogImagePath(h.hero.headline),
      jsonLd: [organizationLd(site), websiteLd(site.name)],
    }),
    hero: h.hero,
    shift: h.shift,
    stack: { ...h.stack, layers: sortServices(services).map(toServiceSummary) },
    playbook: h.playbook,
    industries: { ...h.industries, items: sortIndustries(industries).map(toIndustrySummary) },
    fit: h.fit,
    principles: h.principles,
    insights: { title: h.insightsTitle, items: sortInsights(insights).slice(0, 3).map(toInsightSummary) },
    finalCta: h.finalCta,
  });
}

export function composeService(s: ServiceSource): Service {
  const path = `/services/${s.slug}`;
  return Service.parse({
    ...toServiceSummary(s),
    summary: s.summary,
    problem: s.problem,
    outcomes: s.outcomes,
    capabilities: s.capabilities,
    seo: buildSeo({
      ...s.seo,
      path,
      kicker: `Service layer ${s.code}`,
      jsonLd: [
        serviceLd({ name: s.name, summary: s.summary, path, code: s.code }),
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.name, path }]),
      ],
    }),
  });
}

export function composeIndustry(i: IndustrySource): Industry {
  const path = `/industries/${i.slug}`;
  return Industry.parse({
    ...toIndustrySummary(i),
    summary: i.summary,
    pressures: i.pressures,
    journeys: i.journeys,
    seo: buildSeo({
      ...i.seo,
      path,
      kicker: "Industries",
      jsonLd: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: i.name, path }])],
    }),
  });
}

export function composeInsight(x: InsightSource): Insight {
  const path = `/insights/${x.slug}`;
  const seo = buildSeo({ ...x.seo, path, type: "article", kicker: "Insights", publishedTime: x.publishedAt, modifiedTime: x.updatedAt });
  seo.jsonLd = [
    articleLd({ ...x, path, image: seo.ogImage ?? ogImagePath(x.title) }),
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: x.title, path }]),
  ];
  return Insight.parse({ ...toInsightSummary(x), body: x.body, updatedAt: x.updatedAt, seo });
}

export function composeServicesIndex(p: IndexSource, services: ServiceSource[]): ServicesIndex {
  return ServicesIndex.parse({
    title: p.title, intro: p.intro, items: sortServices(services).map(toServiceSummary),
    seo: buildSeo({ ...p.seo, path: "/services", jsonLd: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])] }),
  });
}

export function composeIndustriesIndex(p: IndexSource, industries: IndustrySource[]): IndustriesIndex {
  return IndustriesIndex.parse({
    title: p.title, intro: p.intro, items: sortIndustries(industries).map(toIndustrySummary),
    seo: buildSeo({ ...p.seo, path: "/industries", jsonLd: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])] }),
  });
}

export function composeInsightsIndex(p: IndexSource, insights: InsightSource[]): InsightsIndex {
  return InsightsIndex.parse({
    title: p.title, intro: p.intro, items: sortInsights(insights).map(toInsightSummary),
    seo: buildSeo({ ...p.seo, path: "/insights", jsonLd: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }])] }),
  });
}

export function composeContact(c: ContactSource): ContactPage {
  return ContactPage.parse({
    title: c.title, intro: c.intro, topics: c.topics,
    seo: buildSeo({ ...c.seo, path: "/contact", jsonLd: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])] }),
  });
}

export function composeSitemap(services: ServiceSource[], industries: IndustrySource[], insights: InsightSource[], today: string): SitemapEntry[] {
  const fixed: SitemapEntry[] = [
    { path: "/", lastModified: today, priority: 1, changeFrequency: "weekly" },
    { path: "/services", lastModified: today, priority: 0.9, changeFrequency: "monthly" },
    { path: "/industries", lastModified: today, priority: 0.8, changeFrequency: "monthly" },
    { path: "/insights", lastModified: today, priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", lastModified: today, priority: 0.6, changeFrequency: "yearly" },
  ];
  return [
    ...fixed,
    ...services.filter((s) => !s.seo.noIndex).map((s) => ({ path: `/services/${s.slug}`, lastModified: today, priority: 0.9, changeFrequency: "monthly" as const })),
    ...industries.filter((i) => !i.seo.noIndex).map((i) => ({ path: `/industries/${i.slug}`, lastModified: today, priority: 0.8, changeFrequency: "monthly" as const })),
    ...insights.filter((x) => !x.seo.noIndex).map((x) => ({ path: `/insights/${x.slug}`, lastModified: x.updatedAt, priority: 0.6, changeFrequency: "yearly" as const })),
  ];
}

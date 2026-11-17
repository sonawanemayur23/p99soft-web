// filepath: packages/contracts/src/index.ts
// View-model contracts between the BFF and every frontend channel.
// The BFF validates its output against these schemas, so the web app never
// sees raw Strapi shapes. Change a contract here and both sides fail to compile.
import { z } from "zod";

export const Cta = z.object({
  label: z.string(),
  href: z.string(),
});
export type Cta = z.infer<typeof Cta>;

export const Seo = z.object({
  title: z.string().max(70),
  description: z.string().max(170),
  canonicalPath: z.string().startsWith("/"),
  /** Absolute URL, or a root-relative path the web app resolves against its own origin. */
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
  ogType: z.enum(["website", "article"]).default("website"),
  noIndex: z.boolean().default(false),
  publishedTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  jsonLd: z.array(z.record(z.unknown())).default([]),
});
export type Seo = z.infer<typeof Seo>;

export const NavItem = z.object({
  label: z.string(),
  href: z.string(),
  children: z
    .array(z.object({ label: z.string(), href: z.string(), note: z.string().optional() }))
    .optional(),
});
export type NavItem = z.infer<typeof NavItem>;

export const SiteSettings = z.object({
  name: z.string(),
  url: z.string().url(),
  tagline: z.string(),
  description: z.string(),
  contactEmail: z.string().email(),
  regions: z.array(z.object({ name: z.string(), role: z.string() })),
  offices: z.array(z.string()),
  nav: z.array(NavItem),
  primaryCta: Cta,
  footer: z.array(z.object({ title: z.string(), links: z.array(Cta) })),
  social: z.array(Cta),
  defaultOgImage: z.string().optional(),
});
export type SiteSettings = z.infer<typeof SiteSettings>;

export const LayerCode = z.enum(["L0", "L1", "L2", "L3", "L4", "L5", "L6"]);
export type LayerCode = z.infer<typeof LayerCode>;

export const ServiceSummary = z.object({
  code: LayerCode,
  slug: z.string(),
  name: z.string(),
  short: z.string(),
});
export type ServiceSummary = z.infer<typeof ServiceSummary>;

export const Service = ServiceSummary.extend({
  summary: z.string(),
  problem: z.string(),
  outcomes: z.array(z.string()),
  capabilities: z.array(z.object({ name: z.string(), detail: z.string() })),
  seo: Seo,
});
export type Service = z.infer<typeof Service>;

export const IndustryTier = z.enum(["anchor", "adjacent", "selective"]);
export const IndustrySummary = z.object({
  slug: z.string(),
  name: z.string(),
  tier: IndustryTier,
  short: z.string(),
});
export type IndustrySummary = z.infer<typeof IndustrySummary>;

export const Industry = IndustrySummary.extend({
  summary: z.string(),
  pressures: z.array(z.string()),
  journeys: z.array(z.object({ name: z.string(), detail: z.string() })),
  seo: Seo,
});
export type Industry = z.infer<typeof Industry>;

export const InsightSummary = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  publishedAt: z.string(),
  readMinutes: z.number().int().positive(),
  author: z.string(),
  tags: z.array(z.string()),
});
export type InsightSummary = z.infer<typeof InsightSummary>;

export const Insight = InsightSummary.extend({
  body: z.string(), // markdown
  updatedAt: z.string(),
  seo: Seo,
});
export type Insight = z.infer<typeof Insight>;

export const HomePage = z.object({
  seo: Seo,
  hero: z.object({
    headline: z.string(),
    subhead: z.string(),
    primaryCta: Cta,
    secondaryCta: Cta,
    systems: z.array(z.string()).min(4).max(10),
  }),
  shift: z.object({
    title: z.string(),
    intro: z.string(),
    eras: z.array(z.object({ name: z.string(), when: z.string(), body: z.string() })).length(3),
  }),
  stack: z.object({
    title: z.string(),
    intro: z.string(),
    layers: z.array(ServiceSummary).length(7),
  }),
  playbook: z.object({
    title: z.string(),
    intro: z.string(),
    steps: z.array(z.object({ name: z.string(), body: z.string() })),
  }),
  industries: z.object({
    title: z.string(),
    intro: z.string(),
    items: z.array(IndustrySummary),
    note: z.string(),
  }),
  fit: z.object({
    title: z.string(),
    intro: z.string(),
    criteria: z.array(z.object({ id: z.string(), label: z.string(), detail: z.string() })),
    results: z.object({ strong: z.string(), partial: z.string(), low: z.string() }),
    cta: Cta,
  }),
  principles: z.object({
    title: z.string(),
    items: z.array(z.object({ name: z.string(), body: z.string() })),
  }),
  insights: z.object({ title: z.string(), items: z.array(InsightSummary) }),
  finalCta: z.object({ title: z.string(), body: z.string(), cta: Cta }),
});
export type HomePage = z.infer<typeof HomePage>;

export const IndexPage = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ seo: Seo, title: z.string(), intro: z.string(), items: z.array(item) });
export const ServicesIndex = IndexPage(ServiceSummary);
export type ServicesIndex = z.infer<typeof ServicesIndex>;
export const IndustriesIndex = IndexPage(IndustrySummary);
export type IndustriesIndex = z.infer<typeof IndustriesIndex>;
export const InsightsIndex = IndexPage(InsightSummary);
export type InsightsIndex = z.infer<typeof InsightsIndex>;

export const ContactPage = z.object({
  seo: Seo,
  title: z.string(),
  intro: z.string(),
  topics: z.array(z.string()),
});
export type ContactPage = z.infer<typeof ContactPage>;

export const LeadInput = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().min(2).max(160),
  role: z.string().max(120).optional(),
  topic: z.string().max(120),
  message: z.string().min(10).max(4000),
  fitScore: z.number().int().min(0).max(10).optional(),
  // Honeypot. Real people never see or fill this field.
  website: z.string().max(200).optional(),
});
export type LeadInput = z.infer<typeof LeadInput>;

export const SitemapEntry = z.object({
  path: z.string(),
  lastModified: z.string(),
  priority: z.number().min(0).max(1),
  changeFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
});
export type SitemapEntry = z.infer<typeof SitemapEntry>;

/** Envelope every BFF response uses. `source` tells you whether data came from Strapi or the bundled fallback. */
export type BffEnvelope<T> = { data: T; source: "cms" | "fallback"; generatedAt: string };

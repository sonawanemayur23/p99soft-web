// filepath: apps/bff/src/seo.ts
// Every page's SEO is assembled here, in one place, from CMS fields plus rules.
// This is the direct fix for the Framer audit: unique titles, page-specific og:url,
// og:type "article" for posts, a 1200x630 share image and JSON-LD on every page.
import type { Seo } from "@p99/contracts";
import { env } from "./env";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
  canonicalOverride?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  kicker?: string;
  jsonLd?: Record<string, unknown>[];
};

const abs = (path: string) => new URL(path, env.SITE_URL).toString();

/** Generated share image, served by the web app at /og. 1200x630, brand styled. */
export function ogImagePath(title: string, kicker?: string): string {
  const q = new URLSearchParams({ title });
  if (kicker) q.set("kicker", kicker);
  return `/og?${q.toString()}`;
}

export function buildSeo(i: SeoInput): Seo {
  const canonicalPath = i.canonicalOverride?.startsWith("/") ? i.canonicalOverride : i.path;
  return {
    title: i.title.slice(0, 70),
    description: i.description.slice(0, 170),
    canonicalPath,
    ogImage: i.ogImage ?? ogImagePath(i.title.replace(/\s*\|\s*P99soft$/i, ""), i.kicker),
    ogImageAlt: i.ogImageAlt ?? i.title,
    ogType: i.type ?? "website",
    noIndex: i.noIndex ?? false,
    publishedTime: i.publishedTime,
    modifiedTime: i.modifiedTime,
    jsonLd: i.jsonLd ?? [],
  };
}

// ---------- JSON-LD builders (schema.org) ----------

const ORG_ID = () => abs("/#organization");

export function organizationLd(site: { name: string; description: string; social: { href: string }[]; offices: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID(),
    name: site.name,
    url: abs("/"),
    logo: abs("/brand/p99soft-logo.png"),
    description: site.description,
    sameAs: site.social.map((s) => s.href),
    areaServed: ["US", "CA", "AE", "SA", "GB", "IN"],
    address: site.offices.map((o) => ({ "@type": "PostalAddress", addressLocality: o })),
  };
}

export function websiteLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name,
    url: abs("/"),
    publisher: { "@id": ORG_ID() },
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function serviceLd(s: { name: string; summary: string; path: string; code: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": abs(`${s.path}#service`),
    name: s.name,
    serviceType: s.name,
    description: s.summary,
    url: abs(s.path),
    provider: { "@id": ORG_ID() },
    areaServed: ["North America", "GCC", "Europe", "India"],
    identifier: s.code,
  };
}

export function articleLd(a: {
  title: string;
  excerpt: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  image: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title.slice(0, 110),
    description: a.excerpt,
    image: abs(a.image),
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    author: { "@type": "Organization", name: a.author, url: abs("/") },
    publisher: { "@id": ORG_ID() },
    mainEntityOfPage: abs(a.path),
    keywords: a.tags.join(", "),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
}

// filepath: apps/web/lib/seo.ts
// Turns the BFF's Seo view model into Next.js Metadata. Every page goes through this,
// so og:url always equals the canonical URL and share images are always 1200x630.
import type { Metadata } from "next";
import type { Seo } from "@p99/contracts";

export const SITE_URL = process.env.SITE_URL ?? "https://p99soft.com";

export function toMetadata(seo: Seo, siteName = "P99soft"): Metadata {
  const images = seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogImageAlt ?? seo.title }] : undefined;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.canonicalPath },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: seo.ogType,
      url: seo.canonicalPath,
      title: seo.title,
      description: seo.description,
      siteName,
      locale: "en_US",
      images,
      ...(seo.ogType === "article"
        ? { publishedTime: seo.publishedTime, modifiedTime: seo.modifiedTime, authors: [siteName] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: images?.map((i) => i.url),
    },
  };
}

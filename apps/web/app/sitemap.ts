// filepath: apps/web/app/sitemap.ts
import type { MetadataRoute } from "next";
import { bff } from "@/lib/bff";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await bff.sitemap();
  return entries.map((e) => ({
    url: new URL(e.path, SITE_URL).toString(),
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}

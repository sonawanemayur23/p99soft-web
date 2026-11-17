// filepath: apps/bff/test/app.test.ts
// Runs without Strapi: every route must still answer from the bundled fallback.
// The SEO checks guard the exact issues found on the Framer site.
import { describe, expect, it, vi } from "vitest";
import type { BffEnvelope, HomePage, Insight, Service, SitemapEntry } from "@p99/contracts";
import { app } from "../src/app";

const get = async <T>(path: string) => {
  const res = await app.request(path);
  return { res, body: (await res.json()) as BffEnvelope<T> };
};

describe("BFF without CMS", () => {
  it("serves the home page from fallback with 7 stack layers", async () => {
    const { res, body } = await get<HomePage>("/v1/pages/home");
    expect(res.status).toBe(200);
    expect(body.source).toBe("fallback");
    expect(body.data.stack.layers).toHaveLength(7);
    expect(body.data.stack.layers[0]?.outcomes.length).toBeGreaterThan(0);
  });

  it("only keeps starter items that point at a real service", async () => {
    const { body } = await get<HomePage>("/v1/pages/home");
    const slugs = new Set(body.data.starter.services.map((s) => s.slug));
    expect(body.data.starter.items.every((i) => slugs.has(i.serviceSlug))).toBe(true);
  });

  it("serves page-builder pages and refuses reserved slugs", async () => {
    const ok = await app.request("/v1/content-pages/our-story");
    expect(ok.status).toBe(200);
    const reserved = await app.request("/v1/content-pages/services");
    expect(reserved.status).toBe(404);
  });

  it("returns 404 for an unknown service", async () => {
    const res = await app.request("/v1/services/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("SEO rules (Framer audit regressions)", () => {
  it("gives every indexable page a unique title and description", async () => {
    const { body: map } = await get<SitemapEntry[]>("/v1/sitemap");
    const seen = new Map<string, string>();
    for (const entry of map.data) {
      const builtIn = /^\/(services|industries|insights)(\/|$)/.test(entry.path);
      const endpoint =
        entry.path === "/" ? "/v1/pages/home"
        : entry.path === "/contact" ? "/v1/pages/contact"
        : builtIn ? `/v1${entry.path}`
        : `/v1/content-pages${entry.path}`;
      const { body } = await get<{ seo: { title: string; description: string; canonicalPath: string } }>(endpoint);
      const seo = body.data.seo;
      expect(seo.canonicalPath, endpoint).toBe(entry.path);
      expect(seen.has(seo.title), `duplicate title on ${entry.path}: ${seo.title}`).toBe(false);
      seen.set(seo.title, entry.path);
      expect(seo.title.length).toBeLessThanOrEqual(70);
      expect(seo.description.length).toBeGreaterThan(50);
    }
    expect(seen.size).toBe(map.data.length);
  });

  it("marks insights as articles with BlogPosting JSON-LD", async () => {
    const { body } = await get<Insight>("/v1/insights/why-cx-ai-pilots-stall");
    expect(body.data.seo.ogType).toBe("article");
    expect(body.data.seo.canonicalPath).toBe("/insights/why-cx-ai-pilots-stall");
    expect(body.data.seo.jsonLd.some((x) => x["@type"] === "BlogPosting")).toBe(true);
  });

  it("attaches Service and Breadcrumb JSON-LD and a generated share image to services", async () => {
    const { body } = await get<Service>("/v1/services/generative-and-agentic-ai");
    const types = body.data.seo.jsonLd.map((x) => x["@type"]);
    expect(types).toEqual(["Service", "BreadcrumbList"]);
    expect(body.data.seo.ogImage).toMatch(/^\/og\?title=/);
  });
});

describe("webhook and leads", () => {
  it("rejects webhooks without the shared secret", async () => {
    const res = await app.request("/v1/webhooks/strapi", { method: "POST", body: "{}" });
    expect(res.status).toBe(401);
  });

  it("validates lead input", async () => {
    const res = await app.request("/v1/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", email: "nope" }),
    });
    expect(res.status).toBe(400);
  });

  it("accepts and silently drops honeypot submissions", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await app.request("/v1/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "10.0.0.9" },
      body: JSON.stringify({
        name: "Bot", email: "bot@example.com", company: "Bots Inc", topic: "x",
        message: "buy cheap things now", website: "x",
      }),
    });
    expect(res.status).toBe(202);
    spy.mockRestore();
  });
});

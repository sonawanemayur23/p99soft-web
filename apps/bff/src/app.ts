// filepath: apps/bff/src/app.ts
import { appendFile, mkdir } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { LeadInput, type BffEnvelope } from "@p99/contracts";
import {
  composeContact, composeHome, composeIndustriesIndex, composeIndustry, composeInsight,
  composeInsightsIndex, composeService, composeServicesIndex, composeSitemap, composeSite,
} from "./compose";
import { env } from "./env";
import { cache, repo, tagsForModel, type Sourced } from "./repo";
import { CmsNotFoundError, strapi } from "./strapi";

export const app = new Hono();

app.use("*", secureHeaders());
app.use("/v1/*", cors({ origin: env.CORS_ORIGINS.split(",").map((s) => s.trim()), allowMethods: ["GET", "POST"] }));

function send<T>(c: Context, data: T, parts: Sourced<unknown>[]) {
  const source = parts.every((p) => p.source === "cms") ? "cms" : "fallback";
  const body: BffEnvelope<T> = { data, source, generatedAt: new Date().toISOString() };
  c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  c.header("x-content-source", source);
  return c.json(body);
}

app.onError((err, c) => {
  if (err instanceof CmsNotFoundError) return c.json({ error: "not_found" }, 404);
  console.error("[bff] error", err);
  return c.json({ error: "internal_error" }, 500);
});

app.get("/health", (c) => c.json({ ok: true, cacheEntries: cache.size, cmsConfigured: Boolean(env.STRAPI_TOKEN) }));

app.get("/v1/site", async (c) => {
  const [site, services, industries] = await Promise.all([repo.site(), repo.services(), repo.industries()]);
  return send(c, composeSite(site.value, services.value, industries.value), [site, services, industries]);
});

app.get("/v1/pages/home", async (c) => {
  const [home, site, services, industries, insights] = await Promise.all([
    repo.home(), repo.site(), repo.services(), repo.industries(), repo.insights(),
  ]);
  return send(c, composeHome(home.value, site.value, services.value, industries.value, insights.value), [home, site, services, industries, insights]);
});

app.get("/v1/pages/contact", async (c) => {
  const p = await repo.contact();
  return send(c, composeContact(p.value), [p]);
});

app.get("/v1/services", async (c) => {
  const [p, list] = await Promise.all([repo.indexPage("services"), repo.services()]);
  return send(c, composeServicesIndex(p.value, list.value), [p, list]);
});
app.get("/v1/services/:slug", async (c) => {
  const s = await repo.service(c.req.param("slug"));
  return send(c, composeService(s.value), [s]);
});

app.get("/v1/industries", async (c) => {
  const [p, list] = await Promise.all([repo.indexPage("industries"), repo.industries()]);
  return send(c, composeIndustriesIndex(p.value, list.value), [p, list]);
});
app.get("/v1/industries/:slug", async (c) => {
  const s = await repo.industry(c.req.param("slug"));
  return send(c, composeIndustry(s.value), [s]);
});

app.get("/v1/insights", async (c) => {
  const [p, list] = await Promise.all([repo.indexPage("insights"), repo.insights()]);
  return send(c, composeInsightsIndex(p.value, list.value), [p, list]);
});
app.get("/v1/insights/:slug", async (c) => {
  const s = await repo.insight(c.req.param("slug"));
  return send(c, composeInsight(s.value), [s]);
});

app.get("/v1/sitemap", async (c) => {
  const [s, i, x] = await Promise.all([repo.services(), repo.industries(), repo.insights()]);
  const today = new Date().toISOString().slice(0, 10);
  return send(c, composeSitemap(s.value, i.value, x.value, today), [s, i, x]);
});

// ---------- leads ----------
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 5, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

app.post("/v1/leads", async (c) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return c.json({ error: "too_many_requests", message: "Too many messages from this network. Try again in 10 minutes." }, 429);

  const parsed = LeadInput.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ error: "invalid", fields: parsed.error.flatten().fieldErrors }, 400);
  }
  const { website, ...lead } = parsed.data;
  if (website) return c.json({ ok: true }, 202); // honeypot: pretend success

  try {
    await strapi.create("leads", { ...lead, source: "website" });
    return c.json({ ok: true, stored: "cms" }, 201);
  } catch (err) {
    // Never lose a lead: keep it on disk until the CMS is back.
    await mkdir("data", { recursive: true });
    await appendFile("data/leads-fallback.jsonl", JSON.stringify({ ...lead, at: new Date().toISOString() }) + "\n");
    console.error("[bff] lead stored to fallback file:", (err as Error).message);
    return c.json({ ok: true, stored: "fallback" }, 202);
  }
});

// ---------- Strapi webhook -> purge BFF cache -> revalidate web ----------
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

app.post("/v1/webhooks/strapi", async (c) => {
  const secret = c.req.header("x-p99-webhook-secret") ?? "";
  if (!safeEqual(secret, env.STRAPI_WEBHOOK_SECRET)) return c.json({ error: "unauthorized" }, 401);

  const body = (await c.req.json().catch(() => ({}))) as { event?: string; model?: string; entry?: { slug?: string } };
  const tags = tagsForModel(body.model ?? "", body.entry?.slug);
  if (tags.length === 0) return c.json({ ok: true, ignored: body.model ?? null });

  const purged = cache.invalidate(tags);
  let web: number | string = "skipped";
  try {
    const r = await fetch(`${env.WEB_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": env.WEB_REVALIDATE_SECRET },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(5000),
    });
    web = r.status;
  } catch (err) {
    web = `error: ${(err as Error).message}`;
  }
  console.info(`[bff] webhook ${body.event} ${body.model} -> purged ${purged}, tags ${tags.join(",")}, web ${web}`);
  return c.json({ ok: true, tags, purged, web });
});

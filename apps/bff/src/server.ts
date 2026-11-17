// filepath: apps/bff/src/server.ts
import { serve } from "@hono/node-server";
import { app } from "./app";
import { env } from "./env";

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`[bff] listening on http://localhost:${info.port} (cms ${env.STRAPI_TOKEN ? "configured" : "not configured, serving fallback content"})`);
});

// filepath: apps/bff/src/env.ts
import { z } from "zod";

const Env = z.object({
  PORT: z.coerce.number().default(4000),
  STRAPI_URL: z.string().url().default("http://localhost:1337"),
  STRAPI_PUBLIC_URL: z.string().url().default("http://localhost:1337"),
  STRAPI_TOKEN: z.string().default(""),
  STRAPI_WEBHOOK_SECRET: z.string().default("change-me"),
  WEB_URL: z.string().url().default("http://localhost:3000"),
  WEB_REVALIDATE_SECRET: z.string().default("change-me"),
  SITE_URL: z.string().url().default("https://p99soft.com"),
  CACHE_TTL: z.coerce.number().default(300),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof Env>;
export const env: Env = Env.parse(process.env);

// filepath: apps/bff/src/strapi.ts
// The only module in the whole system that knows Strapi exists.
import qs from "qs";
import { env } from "./env";

export class CmsUnavailableError extends Error {}
export class CmsNotFoundError extends Error {}

const TIMEOUT_MS = 3000;

async function request<T>(method: "GET" | "POST", path: string, body?: unknown, query?: object): Promise<T> {
  if (!env.STRAPI_TOKEN) throw new CmsUnavailableError("STRAPI_TOKEN not set");
  const url = `${env.STRAPI_URL}/api/${path}${query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : ""}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${env.STRAPI_TOKEN}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new CmsUnavailableError(`Strapi unreachable: ${(err as Error).message}`);
  }
  if (res.status === 404) throw new CmsNotFoundError(path);
  if (!res.ok) throw new CmsUnavailableError(`Strapi ${res.status} on ${path}`);
  return (await res.json()) as T;
}

type One<T> = { data: T | null };
type Many<T> = { data: T[] };

export const strapi = {
  async single<T>(type: string, populate: object): Promise<T> {
    const r = await request<One<T>>("GET", type, undefined, { populate });
    if (!r.data) throw new CmsNotFoundError(type);
    return r.data;
  },
  async many<T>(type: string, populate: object, extra: object = {}): Promise<T[]> {
    const r = await request<Many<T>>("GET", type, undefined, { populate, pagination: { pageSize: 100 }, ...extra });
    return r.data;
  },
  async bySlug<T>(type: string, slug: string, populate: object): Promise<T> {
    const r = await request<Many<T>>("GET", type, undefined, { populate, filters: { slug: { $eq: slug } } });
    const first = r.data[0];
    if (!first) throw new CmsNotFoundError(`${type}/${slug}`);
    return first;
  },
  async create<T>(type: string, data: object): Promise<T> {
    return request<T>("POST", type, { data });
  },
};

/** Media in Strapi comes back as a relative /uploads path when stored locally. */
export function mediaUrl(media: { url?: string } | null | undefined): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${env.STRAPI_PUBLIC_URL}${media.url}`;
}

// filepath: apps/web/app/api/revalidate/route.ts
// Called by the BFF after a Strapi webhook. Purges exactly the pages that use the changed content.
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret") ?? "";
  if (!process.env.REVALIDATE_SECRET || !safeEqual(secret, process.env.REVALIDATE_SECRET)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const { tags } = (await req.json().catch(() => ({ tags: [] }))) as { tags?: string[] };
  const valid = (tags ?? []).filter((t) => typeof t === "string" && /^[a-z0-9:-]{1,80}$/.test(t));
  for (const tag of valid) revalidateTag(tag, "max");
  return Response.json({ revalidated: valid, at: new Date().toISOString() });
}

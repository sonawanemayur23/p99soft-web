// filepath: apps/web/app/api/leads/route.ts
// Same-origin proxy so the browser never talks to the BFF directly (no CORS, BFF stays private).
import { bffBaseUrl } from "@/lib/bff";

export async function POST(req: Request) {
  const body = await req.text();
  const res = await fetch(`${bffBaseUrl}/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "unknown",
    },
    body,
  }).catch(() => null);
  if (!res) return Response.json({ message: "The message did not send because our server is unavailable. Email us directly." }, { status: 502 });
  return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
}

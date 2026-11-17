// filepath: apps/web/app/og/route.tsx
// Brand share image for every page, 1200x630. Fixes the Framer 512px share images.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

const ARROW = "M 18.125 25.890625 C 18.949219 25.210938 18.949219 23.945312 18.125 23.265625 L 9.773438 16.398438 C 8.664062 15.488281 7 16.273438 7 17.710938 L 7 31.449219 C 7 32.882812 8.664062 33.667969 9.773438 32.757812 Z";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "P99soft").slice(0, 120);
  const kicker = (searchParams.get("kicker") ?? "AI-enabled customer experience engineering").slice(0, 60);
  const [bold, medium, logo] = await Promise.all([
    readFile(join(process.cwd(), "lib/og-manrope-800.woff")),
    readFile(join(process.cwd(), "lib/og-manrope-500.woff")),
    readFile(join(process.cwd(), "public/brand/p99soft-logo.svg"), "utf8"),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
  const size = title.length > 70 ? 56 : title.length > 40 ? 68 : 80;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", position: "relative", fontFamily: "Manrope" }}>
        <svg viewBox="6.8 15.3 12.4 18.6" width="520" height="780" style={{ position: "absolute", right: -150, top: -75 }}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0" stopColor="#6FCB8F" />
              <stop offset="1" stopColor="#51C5E0" />
            </linearGradient>
          </defs>
          <path d={ARROW} fill="url(#g)" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: 860 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
          <img src={logoSrc} width={200} height={52} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: "#365A63" }}>{kicker}</div>
            <div style={{ fontSize: size, fontWeight: 800, color: "#0C1D21", letterSpacing: "-0.04em", lineHeight: 1.02, marginTop: 20 }}>{title}</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "#557178" }}>p99soft.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Manrope", data: bold, weight: 800, style: "normal" },
        { name: "Manrope", data: medium, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
    },
  );
}

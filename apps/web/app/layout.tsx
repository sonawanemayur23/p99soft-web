// filepath: apps/web/app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { bff } from "@/lib/bff";
import { SITE_URL } from "@/lib/seo";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import "./globals.css";

// Self-hosted variable fonts: no third-party font request, no layout shift.
const manrope = localFont({ src: "./fonts/manrope-var.woff2", variable: "--font-manrope", weight: "200 800", display: "swap" });
const inter = localFont({ src: "./fonts/inter-var.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await bff.site();
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: site.name,
    title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
    description: site.description,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await bff.site();
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <SmoothScroll />
        <Header nav={site.nav} cta={site.primaryCta} />
        <main id="main">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}

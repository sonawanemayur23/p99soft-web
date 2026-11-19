// filepath: apps/web/next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@p99/contracts"],
  typedRoutes: false,
  images: {
    // Next 16 blocks optimising images from localhost or private IPs. Local Strapi serves
    // media from localhost:1337, so allow it only when ALLOW_LOCAL_IMAGES=true (local dev).
    // In production, media should come from S3 or a CDN and this stays off.
    dangerouslyAllowLocalIP: process.env.ALLOW_LOCAL_IMAGES === "true",
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "1337", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "1337", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**.p99soft.com" },
    ],
  },
  // Old Framer URLs. Service and bank/logistics industry slugs were kept, so they need no redirect.
  // Migrated blog posts must keep their old slug for /blog/:slug to land on the right insight.
  async redirects() {
    return [
      { source: "/about", destination: "/our-story", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      { source: "/news-section", destination: "/insights", permanent: true },
      { source: "/news-section/:slug", destination: "/insights", permanent: true },
      { source: "/industries/enterprise-saas", destination: "/industries", permanent: true },
      { source: "/industries/e-governance", destination: "/industries", permanent: true },
      { source: "/healthcare-and-life-sciences", destination: "/industries", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;

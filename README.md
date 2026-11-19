# p99soft.com rebuild (POC)

The new p99soft.com: Next.js front end, a Backend for Frontend (BFF), and Strapi as the CMS. It fixes every SEO issue found on the Framer site and lets the marketing team publish pages without engineers.

**For editors:** read [docs/publishing-guide.md](docs/publishing-guide.md) and [docs/roles-and-access.md](docs/roles-and-access.md).

```
 Browser ──▶ apps/web (Next.js 16) ──▶ apps/bff (Hono) ──▶ apps/cms (Strapi 5)
              static pages + ISR         view models, SEO,        content, leads,
              /og share images           JSON-LD, cache,          editors
              /api/leads proxy           fallback content
                   ▲                          │
                   └──── revalidate tags ◀────┘◀──── webhook on publish
```

## Why a BFF

- **The web app never sees Strapi.** It reads view models shaped for each page. We can swap or upgrade the CMS without touching the front end.
- **SEO lives in one place.** Titles, canonical URLs, share images and JSON-LD are built by `apps/bff/src/seo.ts` for every page. Editors cannot break them.
- **The site never goes blank.** If Strapi is down, the BFF serves the last cached content, then the bundled seed content.
- **One API for every channel.** A future mobile app, partner portal or AI agent can use the same endpoints.

## Run it locally

Needs Node 22+ and pnpm (`corepack enable`).

```bash
pnpm install
npm --prefix apps/cms install

# 1. Seed the CMS. This also creates the editorial roles, the BFF API token and
#    the publish webhook, and writes the token and webhook secret into apps/bff/.env.
cp apps/cms/.env.example apps/cms/.env        # then set real secrets
pnpm --filter @p99/content export
pnpm seed:cms

# 2. Match the revalidation secret between BFF and web
cp apps/web/.env.example apps/web/.env.local  # set REVALIDATE_SECRET = WEB_REVALIDATE_SECRET in apps/bff/.env

# 3. Start everything (three terminals)
pnpm dev:cms                     # http://localhost:1337/admin  (create your admin user on first visit)
pnpm --filter @p99/bff dev       # http://localhost:4000/health
pnpm --filter @p99/web dev       # http://localhost:3000
```

The BFF and web app run without Strapi. The BFF falls back to `packages/content`, so front-end work never waits on the CMS.

`next build` prerenders every page, so the BFF must be running during the build.

## Repository

| Path | What it is |
|---|---|
| `apps/web` | Next.js 16 App Router, Tailwind 4, Motion, Lenis. Self-hosted Manrope and Inter. |
| `apps/bff` | Hono on Node. The only code that talks to Strapi. Tests in `test/`. |
| `apps/cms` | Strapi 5 (SQLite locally). Content model in `src/api` and `src/components`. Installed with npm, outside the pnpm workspace, because its admin uses React 18. |
| `packages/contracts` | Zod schemas for every BFF response. Shared by BFF and web. |
| `packages/content` | Starter copy. Seeds Strapi and powers the BFF fallback. |
| `scripts/gen-strapi-schema.mjs` | Generates the Strapi content types from one file. |
| `scripts/seo-audit.py` | Audits the rendered HTML of every page in the sitemap. |

## SEO: the Framer issues and how this fixes them

| Framer issue (17 Nov audit) | Fix in this build | Where |
|---|---|---|
| Blog and news posts all titled "P99soft" | Every CMS type has a required SEO component. The BFF rejects content without it. | `apps/cms/src/components/shared/seo.json`, `packages/contracts` |
| Same company blurb as description on most pages | Unique description per page, enforced by a test | `apps/bff/test/app.test.ts` |
| `og:url` pointed to the homepage on every page | `og:url` is always the page's own canonical URL | `apps/web/lib/seo.ts` |
| Posts marked `og:type=website` | Insights are `article`, with published and modified dates | `apps/bff/src/compose.ts` |
| `twitter:image` missing | Set on every page | `apps/web/lib/seo.ts` |
| No JSON-LD anywhere | Organization, WebSite, Service, BlogPosting and BreadcrumbList | `apps/bff/src/seo.ts` |
| Share image cut down to 512px | Brand share image generated at 1200x630 for every page | `apps/web/app/og/route.tsx` |
| 92-character keyword-stuffed home title | Titles capped at 70 characters by the contract | `packages/contracts` |

Current result: **19 of 19 pages pass** `python3 scripts/seo-audit.py http://localhost:3000`.

Also included: `sitemap.xml` and `robots.txt` built from CMS content, server-rendered HTML (no JS needed to read content), one `h1` per page, and visible breadcrumbs that match the JSON-LD.

## Content model (Strapi)

- **Single types:** Global, Home page, Contact page, and Services, Industries and Insights index pages
- **Collections:** Service, Industry, Insight (markdown body), Page (page builder), Lead (contact form submissions)
- **Page builder blocks:** Hero, Rich text, Feature grid, Stats, Quote, FAQ, Image, Call to action
- **Shared components:** SEO, CTA, stat, text item, titled text

## Roles

The seed creates five roles on top of Super Admin: Marketing Manager, Content Editor, Content Writer, SEO Specialist and Analyst. Field-level rules apply: an SEO Specialist can change only SEO fields, and a Content Writer cannot publish. All of this was tested with real accounts. Details in [docs/roles-and-access.md](docs/roles-and-access.md).

## Content rules

All copy lives in `packages/content/src/seed.ts`, and in the CMS after seeding. It is written for clients, not for us:

- No ICP, target segments, market shares, internal service codes or strategy language.
- Every number, certification, testimonial and office comes from the current p99soft.com.
- Service slugs reuse the current p99soft.com URLs where a page exists, so search rankings carry over.

Navigation and the footer are built by the BFF from the Service and Industry collections. Add a service in Strapi and it appears in the menu, footer, sitemap and stack.

## Publish flow

1. An editor publishes in Strapi.
2. Strapi calls `POST /v1/webhooks/strapi` on the BFF (shared secret).
3. The BFF clears its cache for that content and calls `POST /api/revalidate` on the web app.
4. Next.js regenerates only the pages tagged with that content.

Tested end to end: a published headline change was live on the static home page within 5 seconds.

## Contact form

The form posts to `/api/leads` on the web app, which forwards to the BFF. The BFF validates, rate-limits (5 per 10 minutes per IP), drops honeypot bots, and saves the lead in Strapi. If Strapi is down, it writes the lead to `apps/bff/data/leads-fallback.jsonl` so nothing is lost.

## To confirm before launch

- [contact email] `hello@p99soft.com` is a placeholder in `packages/content/src/seed.ts`
- [testimonials] Three quotes are reused from the current site. Confirm they are still approved.
- [case studies] None yet. Add them as Pages or Insights once clients approve.
- [legal pages] Terms and privacy policy need to be recreated as Pages, using the approved legal text.

## Troubleshooting

| Problem | Fix |
|---|---|
| Home page errors after you change the content model | Delete `apps/web/.next` and restart the web app. The dev server caches old BFF responses. |
| Seed fails with TypeScript errors about `api::...` types | Run `npx strapi ts:generate-types` in `apps/cms`, then seed again. |
| BFF health shows `cmsConfigured: false` | Run the seed again. It writes `STRAPI_TOKEN` into `apps/bff/.env`. |
| BFF responses carry `x-content-source: fallback` after a re-seed | The seed rotates the API token. Restart Strapi and the BFF so both pick up the new one. |
| Images from the CMS show as broken icons locally | Add `ALLOW_LOCAL_IMAGES=true` to `apps/web/.env.local`, delete `apps/web/.next`, restart the web app. Next.js 16 blocks images from localhost unless this is on. |
| Publishing in Strapi does not update the site | Check that `REVALIDATE_SECRET` in `apps/web/.env.local` matches `WEB_REVALIDATE_SECRET` in `apps/bff/.env`. |

## Production next steps

1. **Migrate existing blog posts** into Insights, keeping their old slugs. The redirect `/blog/:slug` to `/insights/:slug` is already in `apps/web/next.config.ts`.
2. **Check every old URL** from the Framer sitemap against the new redirects before switching DNS.
3. **Postgres for Strapi** and S3 (or similar) for media.
4. **Redis for the BFF cache** once we run more than one BFF instance.
5. **Draft preview** in Next.js for editors.
6. **Analytics and consent** (GA4 or Plausible), plus Search Console with the new sitemap.
7. **Hosting:** web on Vercel or a container, BFF and Strapi as containers behind a private network.

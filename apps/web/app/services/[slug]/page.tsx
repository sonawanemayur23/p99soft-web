// filepath: apps/web/app/services/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { ArrowList } from "@/components/page/ArrowList";
import { FinalCta } from "@/components/home/FinalCta";
import { BrandArrow } from "@/components/site/Logo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await bff.services()).items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return toMetadata((await bff.service((await params).slug)).seo);
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [s, all, site] = await Promise.all([bff.service(slug), bff.services(), bff.site()]);
  const idx = all.items.findIndex((x) => x.slug === s.slug);
  const prev = all.items[idx - 1];
  const next = all.items[idx + 1];

  return (
    <>
      <JsonLd data={s.seo.jsonLd} />
      <PageHero
        trail={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: s.name, href: `/services/${s.slug}` }]}
        title={s.name}
        intro={s.summary}
        aside={<BrandArrow className="w-40" />}
      />

      <Section title="The problem">
        <p className="t-h3 font-semibold text-ink">{s.problem}</p>
      </Section>

      <Section title="What changes">
        <ArrowList items={s.outcomes} large />
      </Section>

      <Section title="What we do">
        <dl className="grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2">
          {s.capabilities.map((c) => (
            <div key={c.name} className="bg-white p-7">
              <dt className="text-lg font-bold tracking-tight">{c.name}</dt>
              <dd className="mt-2 text-slate">{c.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Works well with">
        <ol className="space-y-1.5">
          {all.items.map((l) => (
            <li key={l.code}>
              <Link
                href={`/services/${l.slug}`}
                aria-current={l.slug === s.slug ? "page" : undefined}
                className={clsx(
                  "flex items-baseline gap-5 rounded-2xl px-5 py-3.5 transition-colors",
                  l.slug === s.slug ? "brand-gradient font-bold text-ink" : "bg-mist text-slate hover:bg-line/60 hover:text-ink",
                )}
              >
                <span>{l.name}</span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-sm font-semibold">
          {prev ? <Link href={`/services/${prev.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-sky">Previous: {prev.name}</Link> : <span />}
          {next && <Link href={`/services/${next.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-sky">Next: {next.name}</Link>}
        </div>
      </Section>

      <FinalCta
        title="Start with one journey."
        body="Tell us which customer journey you want to fix first. We will show you where this layer fits and what to do next."
        cta={site.primaryCta}
      />
    </>
  );
}

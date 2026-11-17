// filepath: apps/web/app/industries/[slug]/page.tsx
import type { Metadata } from "next";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { ArrowList } from "@/components/page/ArrowList";
import { BrandArrow } from "@/components/site/Logo";
import { TextLink } from "@/components/site/Button";
import { FinalCta } from "@/components/home/FinalCta";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await bff.industries()).items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return toMetadata((await bff.industry((await params).slug)).seo);
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const [ind, site] = await Promise.all([bff.industry(slug), bff.site()]);
  return (
    <>
      <JsonLd data={ind.seo.jsonLd} />
      <PageHero
        trail={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: ind.name, href: `/industries/${ind.slug}` }]}
        title={ind.name}
        intro={ind.summary}
        aside={<BrandArrow className="w-40" />}
      />
      <Section title="What we hear from leaders">
        <ArrowList items={ind.pressures} large />
      </Section>
      <Section title="Journeys we connect">
        <dl className="grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2">
          {ind.journeys.map((j) => (
            <div key={j.name} className="bg-white p-7">
              <dt className="text-lg font-bold tracking-tight">{j.name}</dt>
              <dd className="mt-2 text-slate">{j.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section title="How we deliver it">
        <p className="t-lead text-slate">
          Every engagement draws on the same seven-layer stack, from advisory to managed operations. We start at the layer where the journey breaks.
        </p>
        <TextLink href="/services" className="mt-6">See the service stack</TextLink>
      </Section>
      <FinalCta title="Start with one journey." body="Tell us which customer journey hurts most. We will map it and show you where to start." cta={site.primaryCta} />
    </>
  );
}

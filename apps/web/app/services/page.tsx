// filepath: apps/web/app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { BrandArrow } from "@/components/site/Logo";

export async function generateMetadata(): Promise<Metadata> {
  return toMetadata((await bff.services()).seo);
}

export default async function ServicesIndexPage() {
  const page = await bff.services();
  return (
    <>
      <JsonLd data={page.seo.jsonLd} />
      <PageHero trail={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} title={page.title} intro={page.intro} />
      <section className="pb-28 lg:pb-40">
        <div className="container-x">
          <ol className="border-t border-line">
            {page.items.map((s) => (
              <li key={s.code}>
                <Link href={`/services/${s.slug}`} className="group grid items-baseline gap-3 border-b border-line py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
                  <h2 className="t-h3 lg:col-span-5">{s.name}</h2>
                  <p className="text-slate lg:col-span-6">{s.short}</p>
                  <BrandArrow className="hidden h-5 justify-self-end transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 lg:col-span-1 lg:block" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

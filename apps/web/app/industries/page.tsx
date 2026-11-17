// filepath: apps/web/app/industries/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { BrandArrow } from "@/components/site/Logo";

const TIER = { anchor: "Our anchor industry", adjacent: "Adjacent", selective: "Selective" } as const;

export async function generateMetadata(): Promise<Metadata> {
  return toMetadata((await bff.industries()).seo);
}

export default async function IndustriesIndexPage() {
  const page = await bff.industries();
  return (
    <>
      <JsonLd data={page.seo.jsonLd} />
      <PageHero trail={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }]} title={page.title} intro={page.intro} />
      <section className="pb-28 lg:pb-40">
        <div className="container-x">
          <ul className="border-t border-line">
            {page.items.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="group grid items-baseline gap-3 border-b border-line py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
                  <span className="t-data text-sm font-semibold text-muted lg:col-span-2">{TIER[i.tier]}</span>
                  <h2 className="t-h3 lg:col-span-4">{i.name}</h2>
                  <p className="text-slate lg:col-span-5">{i.short}</p>
                  <BrandArrow className="hidden h-5 justify-self-end transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 lg:col-span-1 lg:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

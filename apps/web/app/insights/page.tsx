// filepath: apps/web/app/insights/page.tsx
import type { Metadata } from "next";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { InsightsList } from "@/components/home/InsightsList";

export async function generateMetadata(): Promise<Metadata> {
  return toMetadata((await bff.insights()).seo);
}

export default async function InsightsIndexPage() {
  const page = await bff.insights();
  return (
    <>
      <JsonLd data={page.seo.jsonLd} />
      <PageHero trail={[{ name: "Home", href: "/" }, { name: "Insights", href: "/insights" }]} title={page.title} intro={page.intro} />
      <section className="pb-28 lg:pb-40">
        <div className="container-x">
          <InsightsList items={page.items} headingLevel={2} />
        </div>
      </section>
    </>
  );
}

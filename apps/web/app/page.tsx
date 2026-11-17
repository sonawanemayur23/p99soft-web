// filepath: apps/web/app/page.tsx
import type { Metadata } from "next";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { TextLink } from "@/components/site/Button";
import { Hero } from "@/components/home/Hero";
import { Shift } from "@/components/home/Shift";
import { Stack } from "@/components/home/Stack";
import { Playbook } from "@/components/home/Playbook";
import { Industries } from "@/components/home/Industries";
import { FitCheck } from "@/components/home/FitCheck";
import { Principles } from "@/components/home/Principles";
import { InsightsList } from "@/components/home/InsightsList";
import { FinalCta } from "@/components/home/FinalCta";

export async function generateMetadata(): Promise<Metadata> {
  return toMetadata((await bff.home()).seo);
}

export default async function HomePage() {
  const home = await bff.home();
  return (
    <>
      <JsonLd data={home.seo.jsonLd} />
      <Hero hero={home.hero} />
      <Shift shift={home.shift} />
      <Stack stack={home.stack} />
      <Playbook playbook={home.playbook} />
      <Industries industries={home.industries} />
      <FitCheck fit={home.fit} />
      <Principles principles={home.principles} />
      <section className="pb-28 lg:pb-40" aria-labelledby="insights-title">
        <div className="container-x">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 id="insights-title" className="t-h2">{home.insights.title}</h2>
            <TextLink href="/insights">All insights</TextLink>
          </div>
          <InsightsList items={home.insights.items} />
        </div>
      </section>
      <FinalCta {...home.finalCta} />
    </>
  );
}

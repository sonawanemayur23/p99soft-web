// filepath: apps/web/app/[slug]/page.tsx
// Pages built in the CMS page builder (About, landing pages, legal pages).
// Built-in routes such as /services win over this one; the BFF also refuses reserved slugs.
import type { Metadata } from "next";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { Blocks } from "@/components/blocks/Blocks";

type Props = { params: Promise<{ slug: string }> };

// Pages published after the build render on first request, then stay cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await bff.pages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return toMetadata((await bff.page((await params).slug)).seo);
}

export default async function CmsPage({ params }: Props) {
  const page = await bff.page((await params).slug);
  const startsWithHero = page.blocks[0]?.type === "hero";
  return (
    <>
      <JsonLd data={page.seo.jsonLd} />
      {!startsWithHero && (
        <section className="pt-36 pb-8 lg:pt-44">
          <div className="container-x">
            <h1 className="t-h1 max-w-[18ch]">{page.title}</h1>
          </div>
        </section>
      )}
      <Blocks blocks={page.blocks} />
    </>
  );
}

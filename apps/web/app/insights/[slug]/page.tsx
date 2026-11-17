// filepath: apps/web/app/insights/[slug]/page.tsx
import type { Metadata } from "next";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Markdown } from "@/components/page/Markdown";
import { InsightsList } from "@/components/home/InsightsList";
import { Button } from "@/components/site/Button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await bff.insights()).items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return toMetadata((await bff.insight((await params).slug)).seo);
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const [post, index, site] = await Promise.all([bff.insight(slug), bff.insights(), bff.site()]);
  const more = index.items.filter((x) => x.slug !== post.slug).slice(0, 2);
  return (
    <>
      <JsonLd data={post.seo.jsonLd} />
      <article>
        <PageHero
          trail={[{ name: "Home", href: "/" }, { name: "Insights", href: "/insights" }, { name: post.title, href: `/insights/${post.slug}` }]}
          kicker={post.tags.join(", ")}
          title={post.title}
          intro={post.excerpt}
        />
        <div className="container-x grid gap-12 pb-24 lg:grid-cols-12">
          <aside className="t-data space-y-1 text-sm text-muted lg:col-span-3">
            <p>{post.author}</p>
            <p><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></p>
            <p>{post.readMinutes} min read</p>
          </aside>
          <div className="max-w-[68ch] lg:col-span-7">
            <Markdown>{post.body}</Markdown>
            <div className="mt-16 rounded-3xl bg-mist p-8">
              <p className="t-h3">Want to talk this through for your business?</p>
              <Button href={site.primaryCta.href} className="mt-6">{site.primaryCta.label}</Button>
            </div>
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="pb-28" aria-labelledby="more-title">
          <div className="container-x">
            <h2 id="more-title" className="t-h3 mb-6">More insights</h2>
            <InsightsList items={more} />
          </div>
        </section>
      )}
    </>
  );
}

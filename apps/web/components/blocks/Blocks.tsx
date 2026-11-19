// filepath: apps/web/components/blocks/Blocks.tsx
// Renders page-builder blocks from the CMS. One component per block type.
// Add a new block: Strapi component -> contract Block union -> BFF blockFromCms -> a case here.
import Image from "next/image";
import type { Block } from "@p99/contracts";
import { Button, TextLink } from "@/components/site/Button";
import { BrandArrow } from "@/components/site/Logo";
import { Markdown } from "@/components/page/Markdown";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} first={i === 0} />
      ))}
    </>
  );
}

function BlockView({ block: b, first }: { block: Block; first: boolean }) {
  switch (b.type) {
    case "hero": {
      const H = first ? "h1" : "h2";
      return (
        <section className={first ? "pt-36 pb-16 lg:pt-44 lg:pb-24" : "py-20"}>
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <H className="t-h1 max-w-[18ch]">{b.heading}</H>
              {b.subheading && <p className="t-lead mt-8 max-w-[52ch] text-slate">{b.subheading}</p>}
              {(b.primaryCta || b.secondaryCta) && (
                <div className="mt-10 flex flex-wrap items-center gap-8">
                  {b.primaryCta && <Button href={b.primaryCta.href}>{b.primaryCta.label}</Button>}
                  {b.secondaryCta && <TextLink href={b.secondaryCta.href}>{b.secondaryCta.label}</TextLink>}
                </div>
              )}
            </div>
            <div className="hidden lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <BrandArrow className="w-36" />
            </div>
          </div>
        </section>
      );
    }
    case "richText":
      return (
        <section className="py-12 lg:py-16">
          <div className="container-x">
            <div className="max-w-[68ch]">
              <Markdown>{b.body}</Markdown>
            </div>
          </div>
        </section>
      );
    case "featureGrid":
      return (
        <section className="py-16 lg:py-24">
          <div className="container-x">
            <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:pt-16">
              <div className="lg:col-span-4">
                <h2 className="t-h3">{b.heading}</h2>
                {b.intro && <p className="mt-4 text-slate">{b.intro}</p>}
              </div>
              <dl className="grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                {b.items.map((it) => (
                  <div key={it.name} className="bg-white p-7">
                    <dt className="text-lg font-bold tracking-tight">{it.name}</dt>
                    <dd className="mt-2 text-slate">{it.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      );
    case "stats":
      return (
        <section className="py-12 lg:py-16">
          <div className="container-x">
            {b.heading && <h2 className="t-h3 mb-8">{b.heading}</h2>}
            <dl className="grid gap-8 border-y border-line py-10 sm:grid-cols-3">
              {b.items.map((it) => (
                <div key={it.label}>
                  <dt className="sr-only">{it.label}</dt>
                  <dd>
                    <span className="block text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-extrabold tracking-[-0.04em]">{it.value}</span>
                    <span className="mt-2 block text-slate">{it.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );
    case "quote":
      return (
        <section className="py-16 lg:py-24">
          <figure className="container-x max-w-5xl">
            <blockquote className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.25] font-semibold tracking-[-0.02em]">“{b.quote}”</blockquote>
            <figcaption className="mt-6">
              <span className="font-bold">{b.name}</span>
              {b.role && <span className="text-slate">, {b.role}</span>}
            </figcaption>
          </figure>
        </section>
      );
    case "faq":
      return (
        <section className="py-16 lg:py-24">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <h2 className="t-h3 lg:col-span-4">{b.heading}</h2>
            <div className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
              {b.items.map((it) => (
                <details key={it.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                    {it.question}
                    <BrandArrow className="h-3 shrink-0 transition-transform duration-300 group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-slate">{it.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    case "image":
      return (
        <section className="py-12">
          <figure className="container-x">
            <Image src={b.url} alt={b.alt} width={b.width ?? 1600} height={b.height ?? 900} className="h-auto w-full rounded-[2rem]" sizes="(min-width: 1312px) 1216px, 100vw" />
            {b.caption && <figcaption className="mt-3 text-sm text-muted">{b.caption}</figcaption>}
          </figure>
        </section>
      );
    case "ctaBand":
      return (
        <section className="py-16 lg:py-24">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-[2rem] bg-ink p-10 text-white lg:p-16">
              <BrandArrow className="pointer-events-none absolute top-1/2 -right-10 h-[120%] w-auto -translate-y-1/2 opacity-25" />
              <h2 className="t-h2 relative max-w-[18ch]">{b.heading}</h2>
              {b.body && <p className="t-lead relative mt-4 max-w-[46ch] text-white/70">{b.body}</p>}
              <Button href={b.cta.href} variant="light" className="relative mt-8">{b.cta.label}</Button>
            </div>
          </div>
        </section>
      );
  }
}

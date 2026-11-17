// filepath: apps/web/components/home/Industries.tsx
import Link from "next/link";
import clsx from "clsx";
import type { HomePage } from "@p99/contracts";
import { BrandArrow } from "@/components/site/Logo";

const TIER_LABEL = { anchor: "Our anchor industry", adjacent: "Adjacent", selective: "Selective" } as const;

/** Tile size follows how deep we go: the anchor industry gets the most room. */
export function Industries({ industries }: { industries: HomePage["industries"] }) {
  const [anchor, ...rest] = industries.items;
  return (
    <section className="py-28 lg:py-40" aria-labelledby="industries-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="industries-title" className="t-h2 lg:col-span-6">{industries.title}</h2>
          <p className="t-lead text-slate lg:col-span-4 lg:col-start-9 lg:self-end">{industries.intro}</p>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          {anchor && (
            <Tile item={anchor} className="min-h-[24rem] bg-[linear-gradient(150deg,#eaf8ef_0%,#e3f5fa_100%)] lg:col-span-7 lg:row-span-2 lg:min-h-[34rem]" big />
          )}
          {rest.map((item) => (
            <Tile
              key={item.slug}
              item={item}
              className={item.tier === "selective" ? "bg-white ring-1 ring-line ring-inset lg:col-span-12 lg:min-h-0 lg:flex-row lg:items-end lg:gap-10" : "min-h-[16rem] bg-mist lg:col-span-5"}
            />
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">{industries.note}</p>
      </div>
    </section>
  );
}

function Tile({ item, className, big }: { item: HomePage["industries"]["items"][number]; className?: string; big?: boolean }) {
  return (
    <Link
      href={`/industries/${item.slug}`}
      className={clsx("group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 lg:p-10", className)}
    >
      <p className="t-data text-sm font-semibold text-slate">{TIER_LABEL[item.tier]}</p>
      {big && (
        <BrandArrow className="absolute top-10 right-[-4%] w-[34%] opacity-90 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-4" />
      )}
      <div className="relative">
        <h3 className={clsx("font-extrabold tracking-[-0.035em]", big ? "max-w-[11ch] text-[clamp(2.25rem,4.4vw,4rem)] leading-[1]" : "text-[1.75rem] leading-tight")}>
          {item.name}
        </h3>
        <p className={clsx("mt-4 text-slate", big ? "t-lead max-w-[28ch]" : "max-w-[34ch]")}>{item.short}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
          See journeys
          <BrandArrow className="h-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

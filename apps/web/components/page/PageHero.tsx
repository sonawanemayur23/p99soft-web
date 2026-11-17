// filepath: apps/web/components/page/PageHero.tsx
import Link from "next/link";

type Crumb = { name: string; href: string };

/** Inner-page hero. The visible breadcrumb mirrors the BreadcrumbList JSON-LD the BFF emits. */
export function PageHero({
  trail, kicker, title, intro, aside,
}: { trail: Crumb[]; kicker?: string; title: string; intro?: string; aside?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <nav aria-label="Breadcrumb">
            <ol className="t-data flex flex-wrap items-center gap-2 text-sm text-muted">
              {trail.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-line">/</span>}
                  {i < trail.length - 1 ? (
                    <Link href={c.href} className="hover:text-ink">{c.name}</Link>
                  ) : (
                    <span aria-current="page" className="text-slate">{c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {kicker && <p className="t-data mt-10 text-sm font-semibold text-sky">{kicker}</p>}
          <h1 className={`${title.length > 48 ? "t-h2 max-w-[24ch]" : "t-h1 max-w-[18ch]"} ${kicker ? "mt-4" : "mt-10"}`}>{title}</h1>
          {intro && <p className="t-lead mt-8 max-w-[52ch] text-slate">{intro}</p>}
        </div>
        {aside && <div className="hidden lg:col-span-4 lg:flex lg:items-end lg:justify-end">{aside}</div>}
      </div>
    </section>
  );
}

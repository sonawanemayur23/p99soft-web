// filepath: apps/web/components/home/InsightsList.tsx
import Link from "next/link";
import type { InsightSummary } from "@p99/contracts";
import { formatDate } from "@/lib/format";

export function InsightsList({ items, headingLevel = 3 }: { items: InsightSummary[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="border-t border-line">
      {items.map((x) => (
        <li key={x.slug}>
          <Link href={`/insights/${x.slug}`} className="group grid gap-3 border-b border-line py-8 lg:grid-cols-12 lg:gap-8">
            <p className="t-data text-sm text-muted lg:col-span-2">
              <time dateTime={x.publishedAt}>{formatDate(x.publishedAt)}</time>
            </p>
            <div className="lg:col-span-7">
              <H className="t-h3 transition-colors group-hover:text-slate">{x.title}</H>
              <p className="mt-3 max-w-[60ch] text-slate">{x.excerpt}</p>
            </div>
            <p className="t-data text-sm text-muted lg:col-span-3 lg:text-right">{x.readMinutes} min read</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

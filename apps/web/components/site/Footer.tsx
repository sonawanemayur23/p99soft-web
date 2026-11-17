// filepath: apps/web/components/site/Footer.tsx
import Link from "next/link";
import type { SiteSettings } from "@p99/contracts";
import { Logo } from "./Logo";

export function Footer({ site }: { site: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="reversed" className="h-8 w-auto" />
          <p className="mt-6 max-w-sm text-white/70">{site.description}</p>
          <a href={`mailto:${site.contactEmail}`} className="mt-6 inline-block font-semibold underline decoration-white/30 underline-offset-4 hover:decoration-sky">
            {site.contactEmail}
          </a>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          {site.footer.map((col) => (
            <div key={col.title}>
              <h2 className="t-data text-sm font-semibold text-white/50">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} className="text-white/85 hover:text-white" target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-white/85 hover:text-white">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line-dark">
        <div className="container-x grid gap-6 py-8 text-sm text-white/55 md:grid-cols-12">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-8">
            {site.regions.map((r) => (
              <li key={r.name} title={r.role}>
                <span className="text-white/85">{r.name}</span>
              </li>
            ))}
          </ul>
          <p className="md:col-span-4 md:text-right">
            © {year} {site.name}. {site.offices.join(", ")}.
          </p>
        </div>
      </div>
    </footer>
  );
}

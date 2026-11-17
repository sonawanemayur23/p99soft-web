// filepath: apps/web/components/home/Trust.tsx
import type { HomePage } from "@p99/contracts";
import { BrandArrow } from "@/components/site/Logo";

export function Trust({ trust }: { trust: HomePage["trust"] }) {
  return (
    <section className="bg-mist py-28 lg:py-36" aria-labelledby="trust-title">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="trust-title" className="t-h2 max-w-[16ch]">{trust.title}</h2>
          <p className="t-lead mt-6 text-slate">{trust.intro}</p>
        </div>
        <div className="space-y-12 lg:col-span-7 lg:col-start-6 lg:pt-2">
          <ul className="grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2">
            {trust.certifications.map((c) => (
              <li key={c.name} className="bg-white p-7">
                <p className="t-data text-xl font-semibold tracking-tight">{c.name}</p>
                <p className="mt-1 text-slate">{c.detail}</p>
              </li>
            ))}
          </ul>
          <div>
            <h3 className="t-data text-sm font-semibold text-slate">Products we build and run</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {trust.products.map((p) => (
                <li key={p.name}>
                  <a href={p.href} target="_blank" rel="noreferrer" className="group block h-full rounded-3xl bg-white p-7 ring-1 ring-line ring-inset hover:ring-slate">
                    <span className="flex items-center justify-between text-xl font-bold tracking-tight">
                      {p.name}
                      <BrandArrow className="h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="mt-2 block text-slate">{p.body}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

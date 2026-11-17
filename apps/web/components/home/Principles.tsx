// filepath: apps/web/components/home/Principles.tsx
import type { HomePage } from "@p99/contracts";

export function Principles({ principles }: { principles: HomePage["principles"] }) {
  return (
    <section className="py-28 lg:py-40" aria-labelledby="principles-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="principles-title" className="t-h2 lg:sticky lg:top-32">{principles.title}</h2>
        </div>
        <dl className="lg:col-span-7 lg:col-start-6">
          {principles.items.map((p) => (
            <div key={p.name} className="grid gap-2 border-t border-line py-7 sm:grid-cols-2 sm:gap-8">
              <dt className="text-xl font-bold tracking-tight">{p.name}</dt>
              <dd className="text-slate">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// filepath: apps/web/components/home/Testimonials.tsx
import type { HomePage } from "@p99/contracts";

export function Testimonials({ testimonials }: { testimonials: HomePage["testimonials"] }) {
  if (testimonials.items.length === 0) return null;
  const [lead, ...rest] = testimonials.items;
  return (
    <section className="py-28 lg:py-40" aria-labelledby="testimonials-title">
      <div className="container-x">
        <h2 id="testimonials-title" className="t-h2">{testimonials.title}</h2>
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {lead && (
            <figure className="lg:col-span-7">
              <blockquote className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.25] font-semibold tracking-[-0.02em]">
                <span aria-hidden className="brand-gradient-text">“</span>{lead.quote}<span aria-hidden className="brand-gradient-text">”</span>
              </blockquote>
              <figcaption className="mt-8">
                <span className="block font-bold">{lead.name}</span>
                <span className="text-slate">{lead.role}</span>
              </figcaption>
            </figure>
          )}
          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            {rest.map((t) => (
              <figure key={t.name} className="border-t border-line pt-6">
                <blockquote className="text-lg text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-bold">{t.name}</span>
                  <span className="text-slate">, {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

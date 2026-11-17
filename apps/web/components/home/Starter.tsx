// filepath: apps/web/components/home/Starter.tsx
"use client";
// "Not sure where to start?" Visitors tick familiar problems; we recommend the
// service that solves most of them. Helpful for the visitor, nothing internal exposed.
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import type { HomePage } from "@p99/contracts";
import { Button } from "@/components/site/Button";
import { BrandArrow } from "@/components/site/Logo";

export function Starter({ starter }: { starter: HomePage["starter"] }) {
  const [on, setOn] = useState<Record<string, boolean>>({});

  const picks = useMemo(() => {
    const count = new Map<string, number>();
    for (const item of starter.items) if (on[item.id]) count.set(item.serviceSlug, (count.get(item.serviceSlug) ?? 0) + 1);
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([slug]) => starter.services.find((s) => s.slug === slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [on, starter]);

  const topic = picks[0]?.name;
  const href = topic ? `${starter.cta.href}?topic=${encodeURIComponent(topic)}` : starter.cta.href;

  return (
    <section className="bg-sand py-28 lg:py-40" aria-labelledby="starter-title">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="starter-title" className="t-h2 max-w-[12ch]">{starter.title}</h2>
          <p className="t-lead mt-6 max-w-[32ch] text-slate">{starter.intro}</p>

          <div className="mt-12 min-h-[14rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {picks.length === 0 ? (
                <motion.p key="empty" className="text-slate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Your suggested first step will appear here.
                </motion.p>
              ) : (
                <motion.div key={picks.map((p) => p.slug).join()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <p className="t-data text-sm font-semibold text-slate">Start with</p>
                  <ul className="mt-3 space-y-3">
                    {picks.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/services/${p.slug}`} className="group block rounded-2xl bg-white p-5 ring-1 ring-ink/10 ring-inset hover:ring-ink/25">
                          <span className="flex items-center justify-between gap-4 text-lg font-bold tracking-tight">
                            {p.name}
                            <BrandArrow className="h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                          <span className="mt-1 block text-[0.95rem] text-slate">{p.short}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button href={href} className="mt-8">{starter.cta.label}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <fieldset className="lg:col-span-6 lg:col-start-7">
          <legend className="sr-only">{starter.title}</legend>
          <ul className="space-y-3">
            {starter.items.map((c) => {
              const checked = Boolean(on[c.id]);
              return (
                <li key={c.id}>
                  <label
                    className={clsx(
                      "flex cursor-pointer items-center gap-5 rounded-2xl p-5 ring-1 ring-inset transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                      checked ? "bg-white ring-ink/15" : "bg-white/40 ring-ink/10 hover:bg-white/70",
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => setOn((s) => ({ ...s, [c.id]: e.target.checked }))} />
                    <span className={clsx("grid size-6 shrink-0 place-items-center rounded-md ring-1 ring-inset transition-colors duration-300", checked ? "brand-gradient ring-transparent" : "ring-ink/25")} aria-hidden>
                      <svg viewBox="0 0 16 16" className={clsx("size-3.5 transition-opacity", checked ? "opacity-100" : "opacity-0")}>
                        <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="#0C1D21" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="font-semibold">{c.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>
    </section>
  );
}

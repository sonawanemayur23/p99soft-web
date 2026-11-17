// filepath: apps/web/components/home/Stack.tsx
"use client";
// Services explorer. Seven stacked bars on the left, detail on the right.
// Deliberately calm: nothing moves under the pointer, so hovering never makes
// another bar jump (the cause of the flicker in the old 3D version). Only colour
// and opacity change, and the detail panel has a fixed height so the page never shifts.
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import type { HomePage } from "@p99/contracts";
import { BrandArrow } from "@/components/site/Logo";

export function Stack({ stack }: { stack: HomePage["stack"] }) {
  const [active, setActive] = useState(0);
  const layers = stack.layers;
  const current = layers[active]!;

  return (
    <section id="services" className="relative overflow-x-clip bg-ink py-28 text-white lg:py-40" aria-labelledby="stack-title">
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-sky/10 blur-[120px]" aria-hidden />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="stack-title" className="t-h2 max-w-[16ch]">{stack.title}</h2>
          <p className="t-lead mt-6 max-w-[38ch] text-white/65">{stack.intro}</p>

          <ul className="mt-12 space-y-2" role="list">
            {layers.map((l, i) => {
              const on = i === active;
              return (
                <li key={l.slug}>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls="service-detail"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={clsx(
                      "flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-300",
                      on ? "brand-gradient text-ink" : "bg-white/[0.04] text-white/70 ring-1 ring-white/[0.06] ring-inset hover:bg-white/[0.07] hover:text-white",
                    )}
                  >
                    <span className="text-[1.05rem] font-semibold tracking-tight">{l.name}</span>
                    <BrandArrow gradient={false} className={clsx("h-3.5 shrink-0 transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
                  </button>
                  {on && (
                    <div className="px-5 pt-4 pb-2 lg:hidden">
                      <p className="text-white/75">{l.summary}</p>
                      <Link href={`/services/${l.slug}`} className="mt-3 inline-flex font-semibold underline decoration-sky decoration-2 underline-offset-[6px]">
                        {l.name} in detail
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
          <div
            id="service-detail"
            aria-live="polite"
            className="sticky top-28 overflow-hidden rounded-[2rem] bg-ink-2 p-12 ring-1 ring-white/10 ring-inset"
          >
            <BrandArrow className="pointer-events-none absolute -right-12 -bottom-16 w-44 opacity-10" />
            <div className="relative min-h-[27rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <h3 className="text-[2rem] leading-tight font-extrabold tracking-[-0.03em]">{current.name}</h3>
                  <p className="t-lead mt-5 max-w-[44ch] text-white/75">{current.summary}</p>
                  <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
                    {current.outcomes.map((o) => (
                      <li key={o} className="flex gap-4 text-white/85">
                        <BrandArrow className="mt-[0.4em] h-[0.85em] shrink-0" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${current.slug}`}
                    className="mt-10 inline-flex items-center gap-3 rounded-full bg-white py-3 pr-5 pl-6 font-semibold text-ink transition-colors hover:bg-mist"
                  >
                    {current.name} in detail
                    <BrandArrow className="h-3.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

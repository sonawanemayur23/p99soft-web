// filepath: apps/web/components/home/FitCheck.tsx
"use client";
// Self-qualification against our ICP. Honest by design: a low score says so.
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import type { HomePage } from "@p99/contracts";
import { Button } from "@/components/site/Button";

export function FitCheck({ fit }: { fit: HomePage["fit"] }) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const score = useMemo(() => Object.values(on).filter(Boolean).length, [on]);
  const total = fit.criteria.length;
  const level = score >= 4 ? "strong" : score >= 2 ? "partial" : "low";
  const href = `${fit.cta.href}${fit.cta.href.includes("?") ? "&" : "?"}fit=${score}`;

  return (
    <section className="bg-sand py-28 lg:py-40" aria-labelledby="fit-title">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="fit-title" className="t-h2 max-w-[12ch]">{fit.title}</h2>
          <p className="t-lead mt-6 max-w-[32ch] text-slate">{fit.intro}</p>

          <div className="mt-12" aria-live="polite">
            <div className="flex items-end gap-1.5" aria-hidden>
              {fit.criteria.map((c, i) => (
                <motion.span
                  key={c.id}
                  className={clsx("h-10 flex-1 rounded-md", i < score ? "brand-gradient" : "bg-ink/10")}
                  animate={{ scaleY: i < score ? 1 : 0.45 }}
                  style={{ originY: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                />
              ))}
            </div>
            <p className="t-data mt-4 text-sm font-semibold text-slate">
              {score} of {total} true for you
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={level}
                className="mt-3 max-w-[36ch] text-lg font-semibold"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {score === 0 ? "Tick the statements that describe your business." : fit.results[level]}
              </motion.p>
            </AnimatePresence>
            {level !== "low" ? (
              <Button href={href} className="mt-8">{fit.cta.label}</Button>
            ) : score > 0 ? (
              <Button href="/insights" variant="ghost" className="mt-8">Read our insights</Button>
            ) : null}
          </div>
        </div>

        <fieldset className="lg:col-span-6 lg:col-start-7">
          <legend className="sr-only">{fit.title}</legend>
          <ul className="space-y-3">
            {fit.criteria.map((c) => {
              const checked = Boolean(on[c.id]);
              return (
                <li key={c.id}>
                  <label
                    className={clsx(
                      "flex cursor-pointer items-start gap-5 rounded-2xl p-5 ring-1 transition-[background-color,box-shadow] duration-300 ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                      checked ? "bg-white ring-ink/15" : "bg-white/40 ring-ink/10 hover:bg-white/70",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(e) => setOn((s) => ({ ...s, [c.id]: e.target.checked }))}
                    />
                    <span
                      className={clsx(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md ring-1 transition-colors duration-300 ring-inset",
                        checked ? "brand-gradient ring-transparent" : "ring-ink/25",
                      )}
                      aria-hidden
                    >
                      <motion.svg viewBox="0 0 16 16" className="size-3.5" initial={false} animate={{ opacity: checked ? 1 : 0 }}>
                        <motion.path
                          d="M3 8.5l3.2 3L13 4.5"
                          fill="none"
                          stroke="#0C1D21"
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={false}
                          animate={{ pathLength: checked ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.svg>
                    </span>
                    <span>
                      <span className="block font-semibold">{c.label}</span>
                      <span className="mt-1 block text-[0.95rem] text-slate">{c.detail}</span>
                    </span>
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

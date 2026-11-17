// filepath: apps/web/components/home/Playbook.tsx
"use client";
// Six delivery moves, in order. On large screens the section pins and scroll
// drives the steps sideways, so the sequence reads as one continuous motion.
import { useRef } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { HomePage } from "@p99/contracts";
import { BrandArrow } from "@/components/site/Logo";

export function Playbook({ playbook }: { playbook: HomePage["playbook"] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const steps = playbook.steps;
  // The track is steps/VISIBLE times the container width; slide until the last step meets the right edge.
  const VISIBLE = 2.4;
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0%", `-${(1 - VISIBLE / steps.length) * 100}%`]);
  const arrowX = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  return (
    <section ref={ref} className={clsx("relative bg-mist", !reduce && "lg:h-[340vh]")} aria-labelledby="playbook-title">
      <div className={clsx("overflow-hidden", !reduce && "lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center")}>
        <div className="container-x pt-28 lg:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="playbook-title" className="t-h2">{playbook.title}</h2>
            <p className="t-lead max-w-[30ch] text-slate">{playbook.intro}</p>
          </div>
        </div>

        {/* progress rail */}
        <div className={clsx("container-x mt-12 hidden", !reduce && "lg:block")} aria-hidden>
          <div className="relative h-px bg-line">
            <motion.div className="brand-gradient absolute inset-y-0 left-0" style={{ width: arrowX }} />
            <motion.div className="absolute -top-[9px]" style={{ left: arrowX }}>
              <BrandArrow className="h-[18px] -translate-x-1/2" />
            </motion.div>
          </div>
        </div>

        <div className="container-x mt-10 pb-28 lg:mt-14 lg:pb-0">
          <motion.ol
            className={clsx(
              "grid gap-px overflow-hidden rounded-[2rem] bg-line sm:grid-cols-2",
              reduce ? "lg:grid-cols-3" : "lg:flex lg:w-[var(--track)] lg:gap-0 lg:overflow-visible lg:rounded-none lg:bg-transparent",
            )}
            style={{ ...(reduce ? {} : { x }), ["--track" as string]: `${(steps.length / VISIBLE) * 100}%` }}
          >
            {steps.map((s, i) => (
              <li key={s.name} className="bg-mist p-8 lg:w-full lg:border-l lg:border-line lg:px-10 lg:py-4 first:lg:border-l-0">
                <span className="t-data text-sm font-semibold text-slate">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[clamp(2.5rem,5vw,4.75rem)] leading-none font-extrabold tracking-[-0.045em]">{s.name}</h3>
                <p className="t-lead mt-6 max-w-[26ch] text-slate">{s.body}</p>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

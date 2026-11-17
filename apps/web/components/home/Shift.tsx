// filepath: apps/web/components/home/Shift.tsx
"use client";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import clsx from "clsx";
import type { HomePage } from "@p99/contracts";

/** Three eras of CX. Scroll moves the reader from Then to Next; the rail shows where they are. */
export function Shift({ shift }: { shift: HomePage["shift"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 70%"] });
  const [active, setActive] = useState(0);
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.floor(v * 3))));

  return (
    <section ref={ref} className="relative py-28 lg:py-40" aria-labelledby="shift-title">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="shift-title" className="t-h2 max-w-[14ch]">{shift.title}</h2>
            <p className="t-lead mt-6 max-w-[34ch] text-slate">{shift.intro}</p>
          </div>
        </div>
        <ol className="relative lg:col-span-6 lg:col-start-7">
          <div className="absolute top-2 bottom-2 left-[0.3rem] w-px bg-line" aria-hidden>
            <motion.div className="brand-gradient w-full origin-top" style={{ height: fill }} />
          </div>
          {shift.eras.map((era, i) => (
            <li key={era.name} className="relative pb-24 pl-12 last:pb-0 lg:pb-40">
              <span
                className={clsx(
                  "absolute top-2 left-0 size-[0.65rem] rounded-full ring-4 ring-white transition-colors duration-500",
                  i <= active ? "brand-gradient" : "bg-line",
                )}
                aria-hidden
              />
              <p className={clsx("t-data text-sm font-semibold transition-colors duration-500", i === active ? "text-sky" : "text-muted")}>{era.when}</p>
              <h3 className={clsx("t-h2 mt-3 transition-colors duration-700", i === active ? "text-ink" : "text-ink/25")}>{era.name}</h3>
              <p className={clsx("t-lead mt-5 max-w-[40ch] transition-colors duration-700", i === active ? "text-slate" : "text-slate/40")}>{era.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

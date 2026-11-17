// filepath: apps/web/components/home/Stack.tsx
"use client";
// The L0 to L6 service stack as an exploded 3D view. Scrolling spreads the layers
// apart; pointing at a layer (or its row in the list) lifts it and shows the detail.
// The list is the accessible control. The 3D drawing mirrors it and is hidden from screen readers.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import clsx from "clsx";
import type { HomePage } from "@p99/contracts";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Stack({ stack }: { stack: HomePage["stack"] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const max = narrow ? 16 : 34;
  const spread = useTransform(scrollYProgress, [0.2, 1], reduce ? [max, max] : [8, max]);
  const turn = useTransform(scrollYProgress, [0, 1], reduce ? [-38, -38] : [-58, -38]);
  const layers = stack.layers;
  const current = layers[active]!;
  const last = layers.length - 1;

  return (
    <section ref={ref} id="stack" className="relative overflow-x-clip bg-ink py-28 text-white lg:py-40" aria-labelledby="stack-title">
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-sky/10 blur-[120px]" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* 3D exploded stack: pinned while the list scrolls past */}
          <div className="relative order-2 mt-16 h-[20rem] sm:h-[28rem] lg:order-1 lg:col-span-7 lg:mt-0 lg:h-auto" aria-hidden>
           <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="absolute inset-0 grid place-items-center [perspective:2000px]">
              <motion.div
                className="relative size-[11rem] sm:size-[15rem] lg:size-[18rem] [transform-style:preserve-3d]"
                style={{ rotateX: 60, rotateZ: turn, ["--spread" as string]: spread }}
              >
                {layers.map((l, i) => {
                  const isActive = i === active;
                  const level = last - i; // L0 sits on top
                  return (
                    <div
                      key={l.code}
                      onPointerEnter={() => setActive(i)}
                      className={clsx(
                        "absolute inset-0 rounded-[1.75rem] border transition-[transform,background-color,border-color,opacity] duration-700 ease-[var(--ease-out-expo)]",
                        isActive ? "brand-gradient border-white/40" : "border-white/12 bg-ink-2/90",
                        !isActive && "hover:border-white/30",
                      )}
                      style={{
                        transform: `translateZ(calc(var(--spread) * ${level * 1.15}px + ${isActive ? (narrow ? 24 : 46) : 0}px))`,
                        opacity: isActive ? 1 : 0.92,
                        boxShadow: isActive ? "0 40px 80px -20px rgba(81,197,224,0.55)" : "0 1px 0 rgba(255,255,255,0.06) inset",
                      }}
                    >
                      <span className={clsx("t-data absolute top-5 left-6 text-lg font-semibold", isActive ? "text-ink" : "text-white/40")}>{l.code}</span>
                      <span className={clsx("absolute right-6 bottom-5 left-6 text-sm leading-snug font-semibold", isActive ? "text-ink" : "text-white/0")}>{l.name}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
           </div>
          </div>

          {/* title, layer list, detail */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8 lg:py-16">
            <h2 id="stack-title" className="t-h2">{stack.title}</h2>
            <p className="t-lead mt-6 max-w-[40ch] text-white/65">{stack.intro}</p>
            <ul className="mt-12 border-t border-line-dark" role="list">
              {layers.map((l, i) => (
                <li key={l.code}>
                  <button
                    type="button"
                    aria-pressed={i === active}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group flex w-full items-baseline gap-5 border-b border-line-dark py-4 text-left"
                  >
                    <span className={clsx("t-data w-8 shrink-0 text-sm font-semibold transition-colors", i === active ? "text-sky" : "text-white/35")}>{l.code}</span>
                    <span className={clsx("text-lg font-semibold tracking-tight transition-colors", i === active ? "text-white" : "text-white/55 group-hover:text-white/80")}>{l.name}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 min-h-[9.5rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="max-w-[40ch] text-white/75">{current.short}</p>
                  <Link
                    href={`/services/${current.slug}`}
                    className="mt-5 inline-flex font-semibold text-white underline decoration-sky decoration-2 underline-offset-[6px] hover:decoration-white"
                  >
                    {current.name} in detail
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

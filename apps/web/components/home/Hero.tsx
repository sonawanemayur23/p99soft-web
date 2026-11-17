// filepath: apps/web/components/home/Hero.tsx
"use client";
// The one orchestrated moment on the site: scattered customer systems line up,
// connect, and feed the brand arrow, which sends out one journey. It is the
// positioning statement, animated: fragmented estates in, trusted journeys out.
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { HomePage } from "@p99/contracts";
import { BrandArrow } from "@/components/site/Logo";
import { Button, TextLink } from "@/components/site/Button";

const EASE = [0.16, 1, 0.3, 1] as const;
// Scattered start positions (unit coords) and tilt, one per system chip.
const SCATTER: [number, number, number][] = [
  [0.14, 0.16, -9], [0.56, 0.07, 6], [0.88, 0.22, -5], [0.32, 0.4, 11],
  [0.8, 0.6, -13], [0.1, 0.68, 6], [0.5, 0.88, -7], [0.9, 0.9, 9],
];

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => e && setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function Hero({ hero }: { hero: HomePage["hero"] }) {
  const reduce = useReducedMotion();
  const lines = hero.headline.split(/(?<=\.)\s+/);
  const [stageRef, W] = useSize<HTMLDivElement>();
  const H = W; // square stage

  // Pointer parallax on the arrow. Responds to the visitor, never runs on its own.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-1, 1], [-14, 14]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 120, damping: 18 });

  const systems = hero.systems.slice(0, SCATTER.length);
  const n = systems.length;
  const narrow = W > 0 && W < 480;
  const chipW = narrow ? W * 0.34 : Math.min(150, W * 0.27);
  const chipH = narrow ? 30 : Math.max(32, Math.min(40, W * 0.07));
  const colX = narrow ? chipW / 2 + 2 : W * 0.17;
  const top = H * 0.1;
  const gap = n > 1 ? (H * 0.8) / (n - 1) : 0;
  const arrowW = narrow ? W * 0.27 : W * 0.3;
  const arrowCx = narrow ? W * 0.7 : W * 0.66;
  const arrowCy = H * 0.5;
  const arrowLeft = arrowCx - arrowW * 0.45;
  const arrowTip = arrowCx + arrowW * 0.42;

  const t = (s: number) => (reduce ? 0 : s); // timeline helper

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#fff_55%,var(--color-mist)_100%)] pt-32 pb-20 lg:min-h-[100svh] lg:pt-36">
      <div className="container-x grid items-center gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <h1 className="t-display max-w-[15ch]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.14, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="t-lead mt-8 max-w-[38ch] text-slate"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          >
            {hero.subhead}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          >
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <div
            ref={stageRef}
            className="relative mx-auto aspect-square w-full max-w-[560px] [perspective:900px]"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              px.set(((e.clientX - r.left) / r.width) * 2 - 1);
              py.set(((e.clientY - r.top) / r.height) * 2 - 1);
            }}
            onPointerLeave={() => {
              px.set(0);
              py.set(0);
            }}
            aria-hidden
          >
            {W > 0 && (
              <>
                {/* connectors */}
                <svg className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${W} ${H}`}>
                  <defs>
                    <linearGradient id="hero-line" x1="0" x2="1">
                      <stop offset="0" stopColor="#6FCB8F" stopOpacity="0.15" />
                      <stop offset="1" stopColor="#51C5E0" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  {systems.map((_, i) => {
                    const y = top + i * gap;
                    const x0 = colX + chipW / 2;
                    const d = `M ${x0} ${y} C ${x0 + (arrowLeft - x0) * 0.55} ${y}, ${arrowLeft - (arrowLeft - x0) * 0.45} ${arrowCy}, ${arrowLeft} ${arrowCy}`;
                    return (
                      <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke="url(#hero-line)"
                        strokeWidth={1.5}
                        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.9, delay: t(1.75 + i * 0.05), ease: EASE }}
                      />
                    );
                  })}
                  <motion.path
                    d={`M ${arrowTip} ${arrowCy} L ${W + 40} ${arrowCy}`}
                    stroke="#51C5E0"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: t(2.55), ease: EASE }}
                  />
                </svg>

                {/* outline echo of the arrow, as in the brand guidelines */}
                <motion.div
                  className="absolute text-mint"
                  style={{ width: arrowW * 1.3, left: arrowCx - arrowW * 0.6, top: arrowCy - arrowW * 0.975 }}
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.4, delay: t(2.2), ease: EASE }}
                >
                  <svg viewBox="6.8 15.3 12.4 18.6" className="w-full overflow-visible">
                    <path
                      d="M 18.125 25.890625 C 18.949219 25.210938 18.949219 23.945312 18.125 23.265625 L 9.773438 16.398438 C 8.664062 15.488281 7 16.273438 7 17.710938 L 7 31.449219 C 7 32.882812 8.664062 33.667969 9.773438 32.757812 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={0.12}
                    />
                  </svg>
                </motion.div>

                {/* the arrow */}
                <motion.div
                  className="absolute drop-shadow-[0_30px_60px_rgba(81,197,224,0.35)]"
                  style={{ width: arrowW, left: arrowCx - arrowW / 2, top: arrowCy - (arrowW * 1.5) / 2, rotateX: rotX, rotateY: rotY }}
                  initial={reduce ? false : { opacity: 0, scale: 0.55 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 14, delay: t(2.05) }}
                >
                  <BrandArrow className="w-full" />
                </motion.div>

                {/* chips */}
                {systems.map((label, i) => {
                  const [sx, sy, rot] = SCATTER[i]!;
                  const fx = colX - chipW / 2;
                  const fy = top + i * gap - chipH / 2;
                  return (
                    <motion.div
                      key={label}
                      className="t-data absolute flex items-center gap-2 rounded-full bg-white px-2.5 text-[0.72rem] font-medium sm:px-3 text-ink shadow-[0_1px_0_var(--color-line),0_8px_24px_-12px_rgba(12,29,33,0.25)] ring-1 ring-line sm:text-sm"
                      style={{ width: chipW, height: chipH, left: 0, top: 0 }}
                      initial={reduce ? { x: fx, y: fy } : { x: sx * W - chipW / 2, y: sy * H - chipH / 2, rotate: rot, opacity: 0, scale: 0.92 }}
                      animate={{
                        x: reduce ? fx : [sx * W - chipW / 2, sx * W - chipW / 2, fx],
                        y: reduce ? fy : [sy * H - chipH / 2, sy * H - chipH / 2, fy],
                        rotate: 0,
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        duration: reduce ? 0 : 1.9,
                        times: [0, 0.4, 1],
                        delay: t(0.25 + i * 0.05),
                        ease: EASE,
                        opacity: { duration: 0.5, delay: t(0.25 + i * 0.06) },
                      }}
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-slate/40" />
                      <span className="truncate">{label}</span>
                    </motion.div>
                  );
                })}

                <motion.p
                  className="t-data absolute text-xs font-semibold whitespace-nowrap text-slate sm:text-sm"
                  style={narrow ? { right: 0, top: arrowCy + arrowW * 0.85 } : { left: arrowTip + arrowW * 0.45, top: arrowCy - 32 }}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: t(2.95), ease: EASE }}
                >
                  One customer journey
                </motion.p>
              </>
            )}
          </div>
        </div>
      </div>

      {hero.proof.length > 0 && (
        <div className="container-x mt-16 lg:mt-6">
          <dl className="grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {hero.proof.map((p) => (
              <div key={p.label}>
                <dt className="sr-only">{p.label}</dt>
                <dd>
                  <span className="block text-2xl font-extrabold tracking-[-0.03em]">{p.value}</span>
                  <span className="mt-1 block max-w-[28ch] text-[0.95rem] text-slate">{p.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

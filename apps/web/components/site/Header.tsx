// filepath: apps/web/components/site/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import clsx from "clsx";
import type { Cta, NavItem } from "@p99/contracts";
import { Logo } from "./Logo";
import { Button } from "./Button";

export function Header({ nav, cta }: { nav: NavItem[]; cta: Cta }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > 480 && y > prev && !open && !mobile);
  });

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const show = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };
  const active = nav.find((n) => n.label === open);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
      onKeyDown={(e) => e.key === "Escape" && setOpen(null)}
    >
      <div
        className={clsx(
          "transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled || open || mobile ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="relative z-10 shrink-0" aria-label="P99soft home">
            <Logo className="h-7 w-auto" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.label} onMouseEnter={() => item.children && show(item.label)} onMouseLeave={hide}>
                  {item.children ? (
                    <button
                      type="button"
                      aria-expanded={open === item.label}
                      aria-controls="mega"
                      onClick={() => setOpen(open === item.label ? null : item.label)}
                      onFocus={() => show(item.label)}
                      className={clsx(
                        "inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] leading-none font-medium transition-colors",
                        open === item.label || pathname.startsWith(item.href) ? "text-ink" : "text-slate hover:text-ink",
                      )}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] leading-none font-medium transition-colors",
                        pathname.startsWith(item.href) ? "text-ink" : "text-slate hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href={cta.href} className="!py-2.5">
                {cta.label}
              </Button>
            </div>
            <button
              type="button"
              className="relative z-10 grid size-11 place-items-center rounded-full ring-1 ring-line lg:hidden"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((m) => !m)}
            >
              <span className="relative block h-3 w-5">
                <span className={clsx("absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300", mobile ? "top-1.5 rotate-45" : "top-0")} />
                <span className={clsx("absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300", mobile ? "top-1.5 -rotate-45" : "top-2.5")} />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {active?.children && (
            <motion.div
              id="mega"
              key={active.label}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden overflow-hidden lg:block"
              onMouseEnter={() => show(active.label)}
              onMouseLeave={hide}
            >
              <div className="container-x grid grid-cols-12 gap-8 pt-6 pb-10">
                <div className="col-span-3">
                  <p className="t-h3">{active.label}</p>
                  <Link href={active.href} className="mt-3 inline-block text-sm font-semibold text-slate underline decoration-line underline-offset-4 hover:decoration-sky">
                    View all {active.label.toLowerCase()}
                  </Link>
                </div>
                <ul className="col-span-9 grid grid-cols-2 gap-x-8">
                  {active.children.map((c, i) => (
                    <motion.li
                      key={c.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link href={c.href} className="group flex items-baseline gap-4 border-b border-line py-3.5 hover:border-ink">
                        {c.note && <span className="t-data w-7 shrink-0 text-sm font-semibold text-muted group-hover:text-sky">{c.note}</span>}
                        <span className="font-semibold">{c.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[4.5rem] overflow-y-auto bg-white lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x pt-6 pb-16">
              {nav.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link href={item.href} className="block border-b border-line py-4 text-2xl font-bold tracking-tight">
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="py-2">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex gap-3 py-2 text-slate">
                            {c.note && <span className="t-data w-7 text-sm">{c.note}</span>}
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
              <Button href={cta.href} className="mt-8">
                {cta.label}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

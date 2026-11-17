// filepath: apps/web/components/site/Button.tsx
import Link from "next/link";
import clsx from "clsx";
import { BrandArrow } from "./Logo";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "ghost";
  className?: string;
};

/** Pill button. The brand arrow slides forward on hover: the one motion every CTA shares. */
export function Button({ href, children, variant = "primary", className }: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex items-center gap-3 rounded-full py-3.5 pr-5 pl-6 text-[0.975rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
        variant === "primary" && "bg-ink text-white hover:bg-ink-2",
        variant === "light" && "bg-white text-ink hover:bg-mist",
        variant === "ghost" && "text-ink ring-1 ring-line ring-inset hover:ring-slate",
        className,
      )}
    >
      <span>{children}</span>
      <span className="relative grid size-6 place-items-center overflow-hidden rounded-full">
        <BrandArrow className="h-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-6" />
        <BrandArrow className="absolute h-3.5 -translate-x-6 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0" />
      </span>
    </Link>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-sky",
        className,
      )}
    >
      {children}
    </Link>
  );
}

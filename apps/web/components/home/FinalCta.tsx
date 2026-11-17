// filepath: apps/web/components/home/FinalCta.tsx
import type { Cta } from "@p99/contracts";
import { BrandArrow } from "@/components/site/Logo";
import { Button } from "@/components/site/Button";

export function FinalCta({ title, body, cta }: { title: string; body: string; cta: Cta }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white" aria-labelledby="final-title">
      <BrandArrow className="pointer-events-none absolute top-1/2 right-[-10%] h-[82%] w-auto -translate-y-1/2 opacity-30 lg:right-[-4%] lg:opacity-95" />
      <div className="container-x relative py-28 lg:py-44">
        <h2 id="final-title" className="t-display max-w-[11ch]">{title}</h2>
        <p className="t-lead mt-8 max-w-[40ch] text-white/70">{body}</p>
        <Button href={cta.href} variant="light" className="mt-10">{cta.label}</Button>
      </div>
    </section>
  );
}

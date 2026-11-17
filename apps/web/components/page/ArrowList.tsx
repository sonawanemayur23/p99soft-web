// filepath: apps/web/components/page/ArrowList.tsx
import { BrandArrow } from "@/components/site/Logo";

export function ArrowList({ items, large }: { items: string[]; large?: boolean }) {
  return (
    <ul className="space-y-5">
      {items.map((t) => (
        <li key={t} className="flex gap-4">
          <BrandArrow className="mt-[0.4em] h-[0.9em] shrink-0" />
          <span className={large ? "t-lead" : undefined}>{t}</span>
        </li>
      ))}
    </ul>
  );
}

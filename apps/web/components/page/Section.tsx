// filepath: apps/web/components/page/Section.tsx
import clsx from "clsx";

/** Two-column content band: heading on the left, content on the right. */
export function Section({ title, children, className, id }: { title: string; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={clsx("py-16 lg:py-24", className)}>
      <div className="container-x">
        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:pt-16">
          <h2 className="t-h3 lg:col-span-4">{title}</h2>
          <div className="lg:col-span-7 lg:col-start-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

// filepath: apps/web/app/not-found.tsx
import type { Metadata } from "next";
import { Button, TextLink } from "@/components/site/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-x pt-44 pb-32">
      <p className="t-data text-sm font-semibold text-sky">404</p>
      <h1 className="t-h1 mt-4 max-w-[16ch]">This page does not exist, or it moved.</h1>
      <p className="t-lead mt-6 max-w-[44ch] text-slate">Start from the home page, or see the services we offer.</p>
      <div className="mt-10 flex flex-wrap items-center gap-8">
        <Button href="/">Go to the home page</Button>
        <TextLink href="/services">See services</TextLink>
      </div>
    </section>
  );
}

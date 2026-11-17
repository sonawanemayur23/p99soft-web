// filepath: apps/web/app/contact/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { bff } from "@/lib/bff";
import { toMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  return toMetadata((await bff.contact()).seo);
}

export default async function ContactPage() {
  const [page, site] = await Promise.all([bff.contact(), bff.site()]);
  return (
    <>
      <JsonLd data={page.seo.jsonLd} />
      <PageHero trail={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} title={page.title} intro={page.intro} />
      <section className="pb-28 lg:pb-40">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Suspense>
              <ContactForm topics={page.topics} />
            </Suspense>
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="t-data text-sm font-semibold text-muted">Email</h2>
              <a href={`mailto:${site.contactEmail}`} className="mt-2 block text-lg font-semibold underline decoration-line underline-offset-4 hover:decoration-sky">{site.contactEmail}</a>
            </div>
            <div>
              <h2 className="t-data text-sm font-semibold text-muted">Offices</h2>
              <ul className="mt-3 space-y-3">
                {site.offices.map((o) => {
                  const [city, address] = o.split(": ");
                  return (
                    <li key={o}>
                      <p className="font-semibold">{city}</p>
                      {address && <p className="text-sm text-slate">{address}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

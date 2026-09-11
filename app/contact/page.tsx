import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { glassPanelClassName, liquidGlassPrimaryButtonClassName, moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact M Air Electro AI about independent home-energy planning and external supplier guidance for Romania.",
  path: "/contact",
});

export default function ContactPage() {
  const mailto = `mailto:${siteConfig.contactEmail}?subject=M%20Air%20Electro%20AI%20Inquiry`;

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Contact"
          title="Questions about a backup-power plan start here."
          description="Use contact for independent planning guidance, calculator feedback, or questions about the supplier-link disclosure for Romania."
          actions={[
            { href: mailto, label: "Email the team" },
            { href: "/experts", label: "Review expert tracks", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Backup-power planning",
              body: "Ask about batteries, inverters, solar components and the assumptions used by the planning tools.",
            },
            {
              title: "Supplier-link disclosure",
              body: "Ask how external supplier links are selected and how disclosure will change after any affiliate approval.",
            },
            {
              title: "Safety and final design",
              body: "A qualified installer must validate final compatibility, protection and local electrical requirements.",
            },
          ].map((item) => (
            <article key={item.title} className={moduleCardClassName}>
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/76">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              eyebrow="Contact Details"
              title="Direct commercial contact"
              description="For product questions and disclosure feedback, use the public inbox below."
            />
          </div>
          <div className={`${glassPanelClassName} p-6 sm:p-8`}>
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/76">Email</dt>
                <dd className="mt-2 text-lg font-medium text-white">
                  <Link href={mailto} className="hover:text-lime-50">
                    {siteConfig.contactEmail}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/76">Primary market</dt>
                <dd className="mt-2 text-sm leading-7 text-white/76">{siteConfig.primaryMarket}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/76">Coverage</dt>
                <dd className="mt-2 text-sm leading-7 text-white/76">
                  Romania-focused planning for home backup, batteries, inverters, solar and external supplier research.
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link href={mailto} className={`${liquidGlassPrimaryButtonClassName} px-5 py-3 text-sm font-semibold`}>
                Open email draft
              </Link>
            </div>
          </div>
        </section>
      </section>
    </PlatformShell>
  );
}

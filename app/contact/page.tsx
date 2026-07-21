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
    "Contact M Air Electro AI for pilot access, specialist marketplace onboarding, marine and industrial cases, or commercial partnership discussions.",
  path: "/contact",
});

export default function ContactPage() {
  const mailto = `mailto:${siteConfig.contactEmail}?subject=M%20Air%20Electro%20AI%20Inquiry`;

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Contact"
          title="Start with the right electrical context, and we can route the conversation correctly."
          description="Use contact for pilot access, expert onboarding, marine and industrial support requests, marketplace partnerships, and early enterprise discussions."
          actions={[
            { href: mailto, label: "Email the team" },
            { href: "/experts", label: "Review expert tracks", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Commercial & pilot access",
              body: "Use this path for early customer access, team onboarding, and deployment conversations.",
            },
            {
              title: "Expert verification",
              body: "Use this path if you are an electrician, marine ETO, or controls specialist seeking verified profile onboarding.",
            },
            {
              title: "Marketplace partnerships",
              body: "Use this path for verified parts, specialist services, or payment-provider integration discussions.",
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
              description="For launch readiness, update the production inbox and public site URL in Vercel environment variables before going live."
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
                  Residential, industrial, marine, offshore, verified experts, verified parts, and protected electrical marketplace flows.
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

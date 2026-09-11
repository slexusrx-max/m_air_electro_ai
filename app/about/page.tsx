import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn how M Air Electro AI helps Romanian households plan batteries, inverters, solar and backup power before choosing a supplier.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="About"
          title="Independent energy planning for Romanian homes."
          description="M Air Electro AI helps you turn essential loads and desired backup time into a clear starting point for batteries, inverters and solar components."
          actions={[
            { href: "/marketplace/find-my-solution", label: "Plan my system" },
            { href: "/affiliate-disclosure", label: "Read supplier-link disclosure", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            "Start with what must keep running, then choose the backup duration and compare suitable equipment categories.",
            "Calculators make assumptions visible so you can discuss a final design with a qualified installer.",
            "External supplier links are reference links. The supplier controls checkout, delivery, returns and warranty.",
          ].map((item, index) => (
            <article key={item} className={moduleCardClassName}>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/78">
                0{index + 1}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/80">{item}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              eyebrow="Markets"
              title="Primary launch focus is Romania, with practical home-energy planning and transparent EU supplier research."
              description="The service is focused on practical household energy resilience: batteries, inverters, solar components and backup planning."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {siteConfig.launchMarkets.map((market) => (
              <article key={market} className={moduleCardClassName}>
                <p className="text-sm leading-7 text-white/78">{market}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <SectionHeading
            eyebrow="What We Solve"
            title="A simple path from energy need to an informed supplier visit."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "List the appliances that must remain powered.",
              "Choose the number of backup hours you need.",
              "Review the estimated battery, inverter and solar requirements.",
              "Confirm the final equipment choice and installation with a qualified installer and the supplier.",
            ].map((problem) => (
              <article key={problem} className={moduleCardClassName}>
                <p className="text-sm leading-7 text-white/78">{problem}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PlatformShell>
  );
}

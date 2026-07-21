import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn why M Air Electro AI focuses on electrical diagnostics, engineering tools, verified experts, and high-trust marketplace workflows.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="About"
          title="An AI-first platform built for electrical work where trust, diagnostics, and technical depth matter."
          description="M Air Electro AI is designed for electrical professionals, specialist companies, and serious equipment owners who need engineering reasoning, deterministic tools, verified expertise, and protected transactions in one place."
          actions={[
            { href: "/assistant", label: "Open AI Assistant" },
            { href: "/marketplace", label: "See marketplace workflow", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            "Electrical engineering only. The platform is intentionally narrow to stay high-trust and technically credible.",
            "AI diagnostics is the center of the product. Marketplace workflows support decisions instead of replacing them.",
            "Marine and industrial electrical expertise are premium differentiators, not side categories.",
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
              title="Primary launch focus starts in the United States and extends into specialist global electrical workflows."
              description="The first commercial motion is aimed at residential electrical diagnostics, verified electrical services, verified parts, and premium marine and industrial remote expertise."
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
            title="The product closes the gap between diagnosis, documentation, expertise, and transaction trust."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Users need a fast path from electrical symptoms to structured next actions.",
              "Specialist calculations should be available without switching tools or digging through spreadsheets.",
              "Technical documents and images should feed reasoning instead of staying disconnected from the workflow.",
              "Service and parts transactions need verification, payment protection, and dispute structure.",
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

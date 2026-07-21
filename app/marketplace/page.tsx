import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { getMarketplaceRuntimeStatus, marketplaceProtectionSteps } from "@/lib/server/marketplace";
import { getPaymentRuntimeStatus } from "@/lib/server/payments";

export const metadata = buildMetadata({
  title: "Marketplace",
  description: "Verified electrical experts, verified parts, job requests, and protected marketplace payment workflows.",
  path: "/marketplace",
});

export default function MarketplacePage() {
  const marketplace = getMarketplaceRuntimeStatus();
  const payments = getPaymentRuntimeStatus();

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Marketplace"
          title="Protected electrical services and parts workflows, not a generic classified board."
          description="The marketplace is designed as a trust layer for verified electrical experts, verified parts, service requests, and protected payment release logic using marketplace payment providers."
          actions={[
            { href: "/experts", label: "Browse expert tracks" },
            { href: "/contact", label: "Discuss onboarding", variant: "secondary" },
          ]}
        />

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Protection Model"
            title="The workflow is intentionally structured around verification, evidence, and provider-backed payments."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {marketplaceProtectionSteps.map((step, index) => (
              <article key={step} className={moduleCardClassName}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/76">
                  Step 0{index + 1}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/78">{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill label={payments.provider} tone={payments.configured ? "success" : "warning"} />
            <StatusPill label={payments.configured ? "Payment runtime configured" : "Payment runtime not configured"} tone={payments.configured ? "success" : "warning"} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {marketplace.verticals.map((vertical) => (
              <article key={vertical} className={moduleCardClassName}>
                <h2 className="text-lg font-semibold capitalize text-white">{vertical.replaceAll("-", " ")}</h2>
                <p className="mt-3 text-sm leading-7 text-white/76">
                  Request types: {marketplace.requestTypes.join(", ")}.
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PlatformShell>
  );
}

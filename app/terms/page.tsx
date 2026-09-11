import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { DataDisclaimer } from "@/components/power/marketing";

const termsSections = [
  {
    title: "Platform scope",
    body: [
      "M Air Electro AI provides independent planning tools and educational information for batteries, inverters, solar components and home backup systems in Romania.",
      "It is not an installer, retailer, marketplace operator or emergency service. It does not accept payment, fulfil orders, or make availability promises for equipment.",
    ],
  },
  {
    title: "No substitute for professional judgment",
    body: [
      "AI outputs, calculators, articles, and marketplace content are intended to support engineering and operational decision-making. They do not replace qualified site assessment, electrical codes, or safety procedures.",
      "Users remain responsible for verifying assumptions, measurements, local code compliance, equipment suitability, and safe work execution.",
    ],
  },
  {
    title: "External supplier links",
    body: [
      "Supplier links are provided for reference after a planning step. Prices, stock, delivery, warranty, returns, customer support and the purchase contract belong to the supplier, not M Air Electro AI.",
      "M Air Electro AI is preparing an application to the Renogy Affiliate Program through Impact. Until approval, Renogy EU links are ordinary, untracked supplier links. See the Affiliate disclosure page for the current status.",
    ],
  },
  {
    title: "Service availability",
    body: [
      "The planning tools are provided as-is and may be updated as assumptions or product categories improve.",
      "These terms apply to use of this informational website. For an equipment purchase, read and accept the supplier's own terms before checkout.",
    ],
  },
];

export const metadata = buildMetadata({
  title: "Terms",
  description: "Terms of use for M Air Electro AI and its electrical marketplace workflows.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <PageHero
          eyebrow="Terms"
          title="Terms of use for an AI-first electrical engineering platform."
          description="These terms explain the website's planning-only scope, external supplier links and user responsibilities."
        />

        <div className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <div className="space-y-8">
            <DataDisclaimer title="Data disclaimer" text="Information from Electro-AI is provided for general informational purposes and must not be the sole basis for safety, emergency, financial, or investment decisions." />
            {termsSections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-white/78 sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </PlatformShell>
  );
}

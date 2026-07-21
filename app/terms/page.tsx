import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";

const termsSections = [
  {
    title: "Platform scope",
    body: [
      "M Air Electro AI is a specialist electrical engineering platform. It is not a general handyman marketplace and should not be described or operated as one.",
      "The platform may provide AI guidance, calculators, technical document analysis, verified expert discovery, and protected marketplace workflows for electrical services and parts.",
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
    title: "Marketplace and payments",
    body: [
      "Marketplace payments should be handled by third-party providers such as Stripe Connect or another supported marketplace payment provider.",
      "The platform should not independently store or transmit customer funds as if acting as an escrow company. Completion confirmation, delayed payout, and dispute windows must align with platform rules and payment-provider capabilities.",
    ],
  },
  {
    title: "Verification and moderation",
    body: [
      "Expert, seller, and company verification may require identity, business, credential, experience, or product-condition evidence.",
      "The platform reserves the right to suspend, reject, or remove users, listings, or requests that do not fit the platform focus or trust requirements.",
    ],
  },
  {
    title: "Service availability",
    body: [
      "The MVP is provided on an evolving basis and may change as AI providers, marketplace rules, or specialist verification systems mature.",
      "Production launch should add jurisdiction-specific legal terms, refund handling, tax language, and enterprise contracting where needed.",
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
          description="These MVP terms establish the platform scope, marketplace posture, and user responsibilities. They should be reviewed by legal counsel before public launch."
        />

        <div className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <div className="space-y-8">
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

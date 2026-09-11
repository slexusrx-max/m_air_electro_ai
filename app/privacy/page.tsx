import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { DataDisclaimer } from "@/components/power/marketing";

const privacySections = [
  {
    title: "Scope",
    body: [
      "This page describes the privacy principles for visitors using M Air Electro AI's public planning tools and contacting the team.",
      "The public website does not process payments or create supplier orders. A supplier's privacy policy applies when you visit its website or make a purchase there.",
    ],
  },
  {
    title: "Data categories",
    body: [
      "Information may include a contact email sent to us, calculator inputs you enter in your browser, and ordinary technical data needed to operate and secure the site.",
      "Do not send payment-card details or sensitive identity documents to M Air Electro AI through this website.",
    ],
  },
  {
    title: "How data is used",
    body: [
      "Information is used to reply to questions, maintain the site and improve the planning content.",
      "We do not sell personal data or use contact information for unrelated purposes.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "Information is shared only with service providers needed to host and secure this website, or where required by law.",
      "External suppliers receive information only when you voluntarily visit their site or contact them directly.",
    ],
  },
  {
    title: "Retention and deletion",
    body: [
      "We keep contact information only for as long as needed to handle the request, comply with legal obligations or resolve a dispute.",
      "You may ask about personal information held in connection with a contact request by using the public email address on the Contact page.",
    ],
  },
];

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for M Air Electro AI, including AI, document, and marketplace data handling principles.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <PageHero
          eyebrow="Privacy Policy"
          title="Privacy principles for diagnostics, documents, marketplace workflows, and expert collaboration."
          description="This policy explains how the public planning site handles contact information and its relationship with external supplier websites."
        />

        <div className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <div className="space-y-8">
            <DataDisclaimer title="Data disclaimer" text="Information from Electro-AI is provided for general informational purposes and must not be the sole basis for safety, emergency, financial, or investment decisions." />
            {privacySections.map((section) => (
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

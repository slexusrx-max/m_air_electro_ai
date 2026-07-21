import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";

const privacySections = [
  {
    title: "Scope",
    body: [
      "This MVP privacy page describes how M Air Electro AI may collect and use account information, usage data, uploaded technical files, and marketplace workflow evidence.",
      "Because the platform is built for electrical diagnostics and technical collaboration, uploaded content can include manuals, schematics, photos, fault descriptions, and marketplace transaction records.",
    ],
  },
  {
    title: "Data categories",
    body: [
      "Potential data categories include contact details, account role, usage analytics, calculation inputs, support messages, uploaded technical documents, device and browser metadata, and marketplace workflow events.",
      "Sensitive payment data should be handled by third-party payment providers rather than stored directly by the platform wherever possible.",
    ],
  },
  {
    title: "How data is used",
    body: [
      "Data may be used to operate the platform, improve AI diagnostics, secure accounts, moderate marketplace activity, investigate disputes, and maintain product reliability.",
      "Uploaded documents and technical evidence should only be processed in line with the service purpose, access controls, and applicable contractual obligations.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "Data may be shared with infrastructure providers, analytics tools, authentication providers, or payment providers strictly as needed to run the service.",
      "Marketplace evidence may be shared with counterparties, moderators, and payment providers when required for completion confirmation, fraud review, or dispute handling.",
    ],
  },
  {
    title: "Retention and deletion",
    body: [
      "Retention periods should be tied to product operations, legal requirements, fraud prevention, dispute handling, and customer support history.",
      "Production deployment should define documented retention schedules for AI conversations, marketplace evidence, uploaded files, and account records.",
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
          description="This MVP privacy policy should be reviewed by legal counsel before public launch. It is structured for an AI-first electrical engineering platform with protected marketplace workflows."
        />

        <div className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <div className="space-y-8">
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

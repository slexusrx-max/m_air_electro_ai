import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Diagnostics",
  description: "Step-by-step electrical diagnostics workflows for residential, industrial, marine, and offshore systems.",
  path: "/diagnostics",
});

export default function DiagnosticsPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Diagnostics"
          title="Symptom-led electrical diagnostics with clear escalation paths."
          description="Diagnostics is where the platform structures fault finding before users spend money, replace parts, or dispatch the wrong expert. The logic is meant to stay grounded in electrical workflows, not generic chatbot answers."
          actions={[
            { href: "/assistant", label: "Open AI Assistant" },
            { href: "/knowledge-base", label: "Read troubleshooting guides", variant: "secondary" },
          ]}
        />

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Scope"
            title="Planned diagnostic lanes"
            description="This MVP establishes the route and design language for future structured diagnostics."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Residential wiring faults, tripping circuits, outlets, switches, and lighting.",
              "Motor, VFD, PLC, relay, and sensor issues for industrial environments.",
              "Generator, switchboard, AMS, and alarm cases for marine and offshore systems.",
              "Escalation into documents, calculators, and expert routing when first-pass triage is insufficient.",
            ].map((item) => (
              <article key={item} className={moduleCardClassName}>
                <p className="text-sm leading-7 text-white/78">{item}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PlatformShell>
  );
}

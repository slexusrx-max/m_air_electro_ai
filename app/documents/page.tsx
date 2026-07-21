import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Documents AI",
  description: "Technical document analysis for manuals, schematics, drawings, and electrical evidence packages.",
  path: "/documents",
});

export default function DocumentsPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Documents AI"
          title="Technical files should become part of the electrical workflow, not disconnected attachments."
          description="Documents AI is prepared to support PDF manuals, schematics, drawings, fault reports, photographs, and evidence packs so that diagnostics and expert routing can work against real technical context."
          actions={[
            { href: "/assistant", label: "Open AI Assistant" },
            { href: "/marketplace", label: "See expert routing", variant: "secondary" },
          ]}
        />

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Planned Capabilities"
            title="Document analysis architecture for specialist workflows"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Manual and PDF question answering against uploaded technical files.",
              "Schematic and drawing interpretation for troubleshooting and planning support.",
              "Evidence packaging for marketplace disputes, completion confirmation, and expert handoff.",
              "Marine and industrial readiness for alarm lists, PMS notes, and technical incident context.",
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

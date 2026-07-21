import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { getAiRuntimeStatus } from "@/lib/server/ai";

export const metadata = buildMetadata({
  title: "AI Assistant",
  description: "Electrical AI assistant architecture for diagnostics, document reasoning, and expert-routing workflows.",
  path: "/assistant",
});

export default function AssistantPage() {
  const runtime = getAiRuntimeStatus();

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="AI Assistant"
          title="Electrical AI built as the diagnostic core of the platform."
          description="The assistant is designed to route electrical questions into structured reasoning, safety-aware next actions, document context, calculator follow-ups, and expert escalation when needed."
          actions={[
            { href: "/documents", label: "See document analysis" },
            { href: "/calculators", label: "Open calculators", variant: "secondary" },
          ]}
        />

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Provider Runtime"
            title="Switchable multi-provider AI architecture"
            description="The production contract is ready for OpenAI, Anthropic, Google, and Azure OpenAI through environment-driven provider selection."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {runtime.providers.map((provider) => (
              <article key={provider.id} className={moduleCardClassName}>
                <div className="flex items-center justify-between gap-3">
                  <StatusPill label={provider.label} tone={provider.configured ? "success" : "warning"} />
                  <span className="text-xs uppercase tracking-[0.24em] text-white/48">
                    {runtime.preferredProvider === provider.id ? "Selected" : "Available"}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/76">
                  {provider.configured
                    ? "Configured in the current environment."
                    : `Missing env: ${provider.missingEnv.join(", ")}`}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <SectionHeading
            eyebrow="Use Cases"
            title="Designed to move from electrical uncertainty to the next right action"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Residential fault triage for breakers, outlets, switches, lighting, and EV chargers.",
              "Industrial reasoning for PLC, VFD, control-panel, relay, sensor, and 4-20 mA cases.",
              "Marine and offshore reasoning for DP, PMS, generators, switchboards, and thrusters.",
              "Context-aware handoff into calculators, document analysis, and expert workflows.",
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

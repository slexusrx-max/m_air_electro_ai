import { ElectroAiChat } from "@/components/electro-ai-chat";
import { PlatformShell } from "@/components/platform-shell";
import { buildMetadata } from "@/lib/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import { getAiRuntimeStatus } from "@/lib/server/ai";

export const metadata = buildMetadata({
  title: "AI Assistant",
  description: "Electrical AI assistant architecture for diagnostics, document reasoning, and expert-routing workflows.",
  path: "/assistant",
});

export default async function AssistantPage() {
  const runtime = getAiRuntimeStatus();
  const locale = await getRequestLocale();

  return (
    <PlatformShell>
      <ElectroAiChat locale={locale} configured={runtime.preferredProvider === "openai" && runtime.activeProviderConfigured} />
    </PlatformShell>
  );
}

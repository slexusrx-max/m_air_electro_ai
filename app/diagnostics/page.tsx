import { DiagnosticFlow } from "@/components/diagnostic-flow";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Diagnostics",
  description: "Step-by-step electrical diagnostics workflows for residential, industrial, marine, and offshore systems.",
  path: "/diagnostics",
});

export default async function DiagnosticsPage() {
  const locale = await getRequestLocale();
  return (
    <PlatformShell>
      <DiagnosticFlow locale={locale} />
    </PlatformShell>
  );
}

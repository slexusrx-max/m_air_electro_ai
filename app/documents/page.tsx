import { DocumentsWorkspace } from "@/components/documents-workspace";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Documents AI",
  description: "Technical document analysis for manuals, schematics, drawings, and electrical evidence packages.",
  path: "/documents",
});

export default async function DocumentsPage() {
  const locale = await getRequestLocale();
  return (
    <PlatformShell>
      <DocumentsWorkspace locale={locale} />
    </PlatformShell>
  );
}

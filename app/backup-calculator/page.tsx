import { PlatformShell } from "@/components/platform-shell";
import { BackupCalculator } from "@/components/product/backup-calculator";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
export default async function BackupCalculatorPage() { const t=await getRequestDictionary(); return <PlatformShell><ProductPage eyebrow={t["backup.eyebrow"]} title={t["backup.title"]} description={t["backup.description"]}><BackupCalculator dictionary={t} /></ProductPage></PlatformShell>; }

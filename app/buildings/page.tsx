import { PlatformShell } from "@/components/platform-shell";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
export default async function BuildingsPage() { const t = await getRequestDictionary(); return <PlatformShell><ProductPage eyebrow={t["buildings.eyebrow"]} title={t["buildings.title"]} description={t["buildings.description"]}><section className="info-card rounded-3xl p-6"><h2>{t["buildings.emptyTitle"]}</h2><p className="mt-3">{t["buildings.emptyDescription"]}</p></section></ProductPage></PlatformShell>; }

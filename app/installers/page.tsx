import { PlatformShell } from "@/components/platform-shell";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
export default async function InstallersPage() { const t = await getRequestDictionary(); return <PlatformShell><ProductPage eyebrow={t["installers.eyebrow"]} title={t["installers.title"]} description={t["installers.description"]}><section className="info-card rounded-3xl p-6"><h2>{t["installers.noticeTitle"]}</h2><p className="mt-3">{t["installers.noticeDescription"]}</p></section></ProductPage></PlatformShell>; }

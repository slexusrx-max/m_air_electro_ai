import { PlatformShell } from "@/components/platform-shell";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
export default async function BusinessPage() { const t = await getRequestDictionary(); return <PlatformShell><ProductPage eyebrow={t["business.eyebrow"]} title={t["business.title"]} description={t["business.description"]}><section className="grid gap-4 md:grid-cols-3">{["audit", "outage", "sizing"].map((item) => <article className="info-card rounded-3xl p-5" key={item}><h2>{t[`business.cards.${item}`]}</h2><p>{t["business.note"]}</p></article>)}</section></ProductPage></PlatformShell>; }

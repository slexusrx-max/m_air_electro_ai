import { PlatformShell } from "@/components/platform-shell";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
export default async function MyHomePage() { const t = await getRequestDictionary(); return <PlatformShell><ProductPage eyebrow={t["myHome.eyebrow"]} title={t["myHome.title"]} description={t["myHome.description"]}><section className="grid gap-4 md:grid-cols-3">{["home", "battery", "score"].map((item) => <article className="info-card rounded-3xl p-5" key={item}><h2>{t[`myHome.cards.${item}.title`]}</h2><p>{t[`myHome.cards.${item}.description`]}</p></article>)}</section></ProductPage></PlatformShell>; }

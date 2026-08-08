import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";

const categoryKeys = ["homeBatteries", "portableStations", "inverters", "solarPanels", "hybridInverters", "ups", "generators", "ats", "meters", "smartDevices", "evChargers", "cables"];
export default async function MarketplacePage() { const t = await getRequestDictionary(); return <PlatformShell><ProductPage eyebrow={t["marketplace.eyebrow"]} title={t["marketplace.title"]} description={t["marketplace.description"]}><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categoryKeys.map((category) => <article key={category} className="info-card rounded-2xl p-5"><h2 className="font-bold text-slate-950">{t[`marketplace.categories.${category}`]}</h2><p className="mt-2 text-sm text-slate-700">{t["marketplace.feedUnavailable"]}</p><Link href="/backup-calculator" className="mt-4 inline-block font-semibold text-teal-800">{t["marketplace.sizeSystem"]} →</Link></article>)}</section></ProductPage></PlatformShell>; }

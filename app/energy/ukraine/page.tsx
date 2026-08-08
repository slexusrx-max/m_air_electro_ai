import { UkraineEnergyDashboard } from "@/components/energy/UkraineEnergyDashboard";
import { PlatformShell } from "@/components/platform-shell";
import { demoUkraineEnergyAdapter } from "@/lib/energy/adapters";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
export const metadata = { title: "Ukraine Energy System | M Air Electro AI", description: "Clearly labelled Ukraine energy data, source status and outage-service readiness." };
export default async function UkraineEnergyPage() { const [snapshot, dictionary, locale] = await Promise.all([demoUkraineEnergyAdapter.getSnapshot(), getRequestDictionary(), getRequestLocale()]); return <PlatformShell><UkraineEnergyDashboard initialSnapshot={snapshot} dictionary={dictionary} locale={locale} /></PlatformShell>; }

import { UkraineEnergyDashboard } from "@/components/energy/UkraineEnergyDashboard";
import { PlatformShell } from "@/components/platform-shell";
import { demoUkraineEnergyAdapter } from "@/lib/energy/adapters";
export const metadata = { title: "Ukraine Energy System | M Air Electro AI", description: "Clearly labelled Ukraine energy data, source status and outage-service readiness." };
export default async function UkraineEnergyPage() { const snapshot = await demoUkraineEnergyAdapter.getSnapshot(); return <PlatformShell><UkraineEnergyDashboard initialSnapshot={snapshot} /></PlatformShell>; }

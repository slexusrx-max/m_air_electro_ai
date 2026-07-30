import { PowerMapClient } from "@/components/map/PowerMapClient";
import { PlatformShell } from "@/components/platform-shell";
import { getPowerPlants } from "@/services/power-plants";
export const metadata = { title: "Global Power Resilience Map", description: "Explore demonstration power infrastructure and regional electricity resilience." };
export default async function MapPage() { const plants = await getPowerPlants(); return <PlatformShell contentClassName="flex-1 px-3 pb-4 pt-4 sm:px-5"><PowerMapClient plants={plants}/></PlatformShell>; }

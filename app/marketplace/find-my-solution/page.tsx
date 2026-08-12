import { PlatformShell } from "@/components/platform-shell";
import { SolutionFinder } from "@/components/marketplace/solution-finder";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({ title: "Find My Energy Solution", description: "Use load and backup time to calculate a practical starting energy-system recommendation.", path: "/marketplace/find-my-solution" });
export default function FindMySolutionPage() { return <PlatformShell><SolutionFinder/></PlatformShell>; }

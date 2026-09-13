import { PlatformShell } from "@/components/platform-shell";
import { DiscoveryHome } from "@/components/marketplace/discovery-home";
import { buildMetadata } from "@/lib/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
export async function generateMetadata() {
  const ro = (await getRequestLocale()) === "ro";
  return buildMetadata({
    title: ro
      ? "Marketplace de echipamente energetice"
      : "Energy equipment marketplace",
    description: ro
      ? "Explorează categorii de baterii, solar, invertoare, încărcătoare, generatoare și componente electrice."
      : "Explore batteries, solar, inverters, charging, generators and electrical components.",
    path: "/marketplace",
  });
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <PlatformShell>
      <DiscoveryHome marketplace requirements={await searchParams} />
    </PlatformShell>
  );
}

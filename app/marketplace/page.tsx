import { PlatformShell } from "@/components/platform-shell";
import { DiscoveryHome } from "@/components/marketplace/discovery-home";
import { buildMetadata } from "@/lib/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
type Props = { searchParams: Promise<Record<string, string | undefined>> };
export async function generateMetadata({ searchParams }: Props) {
  const ro = (await getRequestLocale()) === "ro";
  const query = await searchParams;
  return { ...buildMetadata({
    title: ro
      ? "Descoperă echipamente energetice"
      : "Independent energy equipment discovery",
    description: ro
      ? "Explorează categorii de baterii, solar, invertoare, încărcătoare, generatoare și componente electrice."
      : "Explore batteries, solar, inverters, charging, generators and electrical components.",
    path: "/marketplace",
  }), robots: Object.values(query).some(Boolean)
    ? { index: false, follow: true }
    : undefined };
}
export default async function Page({ searchParams }: Props) {
  return (
    <PlatformShell>
      <DiscoveryHome marketplace requirements={await searchParams} />
    </PlatformShell>
  );
}

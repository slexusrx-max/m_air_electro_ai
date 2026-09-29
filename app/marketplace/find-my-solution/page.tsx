import { PlatformShell } from "@/components/platform-shell";
import { SolutionFinder } from "@/components/marketplace/solution-finder";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Găsește soluția energetică" : "Find My Solution",
    description: ro
      ? "Dimensionează sistemul energetic după consum, puterea de pornire, autonomie și echipamentele existente, apoi compară opțiunile din catalog."
      : "Size an energy system from load, starting power, runtime and existing equipment, then compare catalog candidates.",
    path: "/marketplace/find-my-solution",
  });
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <PlatformShell>
      <SolutionFinder
        dictionary={await getRequestDictionary()}
        initial={await searchParams}
      />
    </PlatformShell>
  );
}

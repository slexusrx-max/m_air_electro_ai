import { PlatformShell } from "@/components/platform-shell";
import { SolutionFinder } from "@/components/marketplace/solution-finder";
import { getRequestDictionary } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Găsește soluția mea",
  description:
    "Calculează bateria, invertorul și panourile solare pornind de la consum și autonomia dorită.",
  path: "/marketplace/find-my-solution",
});
export default async function FindMySolutionPage() {
  const dictionary = await getRequestDictionary();
  return (
    <PlatformShell>
      <SolutionFinder dictionary={dictionary} />
    </PlatformShell>
  );
}

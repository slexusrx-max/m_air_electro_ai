import { getRequestLocale } from "@/lib/i18n/request";
import CableSizingCalculator from "@/app/calculators/cable-sizing/cable-sizing-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator pentru dimensionarea cablurilor" : "Cable sizing calculator",
    description: ro
      ? "Dimensionare preliminară a cablurilor pe baza curentului, capacității de transport și căderii de tensiune."
      : "Preliminary cable sizing based on current, ampacity, and voltage drop.",
    path: "/calculators/cable-sizing",
  });
}

export default function CableSizingPage() {
  return (
    <CalculatorPageShell
      title="Cable sizing calculator"
      description="Preliminary conductor sizing using deterministic logic: a simplified ampacity table combined with a resistive voltage-drop estimate."
      actions={[
        {
          href: "/calculators",
          label: "Back to calculators",
          variant: "secondary",
        },
        { href: "/calculators/voltage-drop", label: "Open voltage drop" },
      ]}
    >
      <CableSizingCalculator />
    </CalculatorPageShell>
  );
}

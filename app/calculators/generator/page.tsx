import { getRequestLocale } from "@/lib/i18n/request";
import GeneratorCalculator from "@/app/calculators/generator/generator-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator pentru generatoare" : "Generator sizing calculator",
    description: ro
      ? "Estimează puterea generatorului după sarcina de funcționare, rezerva de putere și pornirea motoarelor."
      : "Estimate generator sizing for running load, reserve, and motor-start allowance.",
    path: "/calculators/generator",
  });
}

export default function GeneratorPage() {
  return (
    <CalculatorPageShell
      title="Generator calculator"
      description="Estimate running kVA, reserve-adjusted demand, and a preliminary generator size that also considers the largest motor-start event."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/transformer", label: "Open transformer sizing" },
      ]}
    >
      <GeneratorCalculator />
    </CalculatorPageShell>
  );
}

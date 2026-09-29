import { getRequestLocale } from "@/lib/i18n/request";
import TransformerCalculator from "@/app/calculators/transformer/transformer-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator pentru transformatoare" : "Transformer calculator",
    description: ro
      ? "Estimează încărcarea transformatorului și curenții din circuitele primar și secundar."
      : "Estimate transformer loading and primary-secondary current demand.",
    path: "/calculators/transformer",
  });
}

export default function TransformerPage() {
  return (
    <CalculatorPageShell
      title="Transformer calculator"
      description="Estimate primary and secondary current at full load and at the expected operating load level."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/generator", label: "Open generator sizing" },
      ]}
    >
      <TransformerCalculator />
    </CalculatorPageShell>
  );
}

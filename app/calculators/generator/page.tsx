import GeneratorCalculator from "@/app/calculators/generator/generator-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Generator Calculator",
  description: "Estimate generator sizing for running load, reserve, and motor-start allowance.",
  path: "/calculators/generator",
});

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

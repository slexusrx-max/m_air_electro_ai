import CableSizingCalculator from "@/app/calculators/cable-sizing/cable-sizing-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Cable Sizing Calculator",
  description: "Preliminary cable sizing based on current, ampacity, and voltage drop.",
  path: "/calculators/cable-sizing",
});

export default function CableSizingPage() {
  return (
    <CalculatorPageShell
      title="Cable sizing calculator"
      description="Preliminary conductor sizing using deterministic logic: a simplified ampacity table combined with a resistive voltage-drop estimate."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/diagnostics", label: "Go to diagnostics" },
      ]}
    >
      <CableSizingCalculator />
    </CalculatorPageShell>
  );
}

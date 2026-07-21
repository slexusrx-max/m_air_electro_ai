import BreakerSelectionCalculator from "@/app/calculators/breaker-selection/breaker-selection-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Breaker Selection Calculator",
  description: "Select a preliminary breaker rating from design current, duty assumptions, and derating.",
  path: "/calculators/breaker-selection",
});

export default function BreakerSelectionPage() {
  return (
    <CalculatorPageShell
      title="Breaker selection calculator"
      description="Select a preliminary breaker rating using design current, load duty, ambient derating, spare margin, and inrush awareness."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/fuse-selection", label: "Open fuse selection" },
      ]}
    >
      <BreakerSelectionCalculator />
    </CalculatorPageShell>
  );
}

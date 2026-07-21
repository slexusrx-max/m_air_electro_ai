import FuseSelectionCalculator from "@/app/calculators/fuse-selection/fuse-selection-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Fuse Selection Calculator",
  description: "Select a preliminary fuse family and fuse rating from load and application assumptions.",
  path: "/calculators/fuse-selection",
});

export default function FuseSelectionPage() {
  return (
    <CalculatorPageShell
      title="Fuse selection calculator"
      description="Select a preliminary fuse family and rating using load current, application type, continuity assumptions, and spare margin."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/breaker-selection", label: "Open breaker selection" },
      ]}
    >
      <FuseSelectionCalculator />
    </CalculatorPageShell>
  );
}

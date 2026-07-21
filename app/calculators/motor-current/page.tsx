import MotorCurrentCalculator from "@/app/calculators/motor-current/motor-current-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Motor Current Calculator",
  description: "Estimate motor full-load current, inrush current, and apparent power.",
  path: "/calculators/motor-current",
});

export default function MotorCurrentPage() {
  return (
    <CalculatorPageShell
      title="Motor current calculator"
      description="Estimate motor full-load current, electrical input, apparent power, and startup current for single-phase and three-phase AC motors."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/voltage-drop", label: "Open voltage drop" },
      ]}
    >
      <MotorCurrentCalculator />
    </CalculatorPageShell>
  );
}

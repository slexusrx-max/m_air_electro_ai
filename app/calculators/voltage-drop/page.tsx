import VoltageDropCalculator from "@/app/calculators/voltage-drop/voltage-drop-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Voltage Drop Calculator",
  description: "Estimate electrical voltage drop for selected conductor size and route length.",
  path: "/calculators/voltage-drop",
});

export default function VoltageDropPage() {
  return (
    <CalculatorPageShell
      title="Voltage drop calculator"
      description="Estimate voltage drop for a selected conductor size, material, route length, and system type."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/cable-sizing", label: "Open cable sizing" },
      ]}
    >
      <VoltageDropCalculator />
    </CalculatorPageShell>
  );
}

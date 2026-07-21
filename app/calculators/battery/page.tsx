import BatteryCalculator from "@/app/calculators/battery/battery-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Battery Calculator",
  description: "Estimate battery-bank capacity and required backup runtime.",
  path: "/calculators/battery",
});

export default function BatteryPage() {
  return (
    <CalculatorPageShell
      title="Battery calculator"
      description="Estimate nominal battery-bank capacity from load power, autonomy time, system voltage, efficiency, and depth-of-discharge limits."
      actions={[
        { href: "/calculators", label: "Back to calculators", variant: "secondary" },
        { href: "/calculators/fuse-selection", label: "Open fuse selection" },
      ]}
    >
      <BatteryCalculator />
    </CalculatorPageShell>
  );
}

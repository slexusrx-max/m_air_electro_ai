import { getRequestLocale } from "@/lib/i18n/request";
import MotorCurrentCalculator from "@/app/calculators/motor-current/motor-current-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator pentru curentul motorului" : "Motor current calculator",
    description: ro
      ? "Estimează curentul motorului la sarcină nominală, curentul de pornire și puterea aparentă."
      : "Estimate motor full-load current, inrush current, and apparent power.",
    path: "/calculators/motor-current",
  });
}

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

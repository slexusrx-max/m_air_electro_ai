import { getRequestLocale } from "@/lib/i18n/request";
import VoltageDropCalculator from "@/app/calculators/voltage-drop/voltage-drop-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator pentru căderea de tensiune" : "Voltage drop calculator",
    description: ro
      ? "Estimează căderea de tensiune pentru secțiunea conductorului și lungimea traseului alese."
      : "Estimate electrical voltage drop for selected conductor size and route length.",
    path: "/calculators/voltage-drop",
  });
}

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

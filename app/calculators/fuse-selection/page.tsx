import { getRequestLocale } from "@/lib/i18n/request";
import FuseSelectionCalculator from "@/app/calculators/fuse-selection/fuse-selection-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Alegerea siguranței fuzibile" : "Fuse selection",
    description: ro
      ? "Alege preliminar tipul și calibrul siguranței fuzibile după sarcină și condițiile de utilizare."
      : "Select a preliminary fuse family and fuse rating from load and application assumptions.",
    path: "/calculators/fuse-selection",
  });
}

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

import { EditorialPage } from "@/components/marketplace/editorial-page";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Condiții de utilizare",
  description:
    "Informații despre M Air Electro AI, planificarea independentă și relația cu furnizorii externi.",
  path: "/terms",
});
export default function Page() {
  return <EditorialPage page="terms" />;
}

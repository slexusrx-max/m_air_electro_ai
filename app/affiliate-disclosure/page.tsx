import { EditorialPage } from "@/components/marketplace/editorial-page";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Transparență și afiliere",
  description:
    "Informații despre M Air Electro AI, planificarea independentă și relația cu furnizorii externi.",
  path: "/affiliate-disclosure",
});
export default function Page() {
  return <EditorialPage page="affiliate-disclosure" />;
}

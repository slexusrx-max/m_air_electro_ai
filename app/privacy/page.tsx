import { EditorialPage } from "@/components/marketplace/editorial-page";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Confidențialitate",
  description:
    "Informații despre M Air Electro AI, planificarea independentă și relația cu furnizorii externi.",
  path: "/privacy",
});
export default function Page() {
  return <EditorialPage page="privacy" />;
}

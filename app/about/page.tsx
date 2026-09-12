import { EditorialPage } from "@/components/marketplace/editorial-page";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Despre M Air Electro AI",
  description:
    "Informații despre M Air Electro AI, planificarea independentă și relația cu furnizorii externi.",
  path: "/about",
});
export default function Page() {
  return <EditorialPage page="about" />;
}

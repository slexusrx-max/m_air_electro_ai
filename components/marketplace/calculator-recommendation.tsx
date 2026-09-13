import Link from "next/link";
const destinations: Record<string, string> = {
  "lithium-batteries": "batteries",
  "electrical-accessories": "electrical-components",
  "industrial-electrical": "industrial",
  "marine-electrical": "marine",
  "charge-controllers": "solar/controllers",
  "solar-panels": "solar/panels",
  "solar-kits": "solar/kits",
};
export function CalculatorRecommendation({
  title,
  copy,
  category,
}: {
  title: string;
  copy: string;
  category: string;
}) {
  return (
    <aside className="content-panel mt-4">
      <h3>{title}</h3>
      <p>{copy}</p>
      <Link href={`/marketplace/${destinations[category] ?? category}`}>
        Marketplace →
      </Link>
    </aside>
  );
}

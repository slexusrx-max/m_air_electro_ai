"use client";
import Link from "next/link";
import { useCalculatorCopy } from "@/components/calculators/calculator-locale";
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
  const l = useCalculatorCopy();
  return (
    <aside className="content-panel mt-4">
      <h3>{l(title)}</h3>
      <p>{l(copy)}</p>
      <Link href={`/marketplace/${destinations[category] ?? category}`}>
        Marketplace →
      </Link>
    </aside>
  );
}

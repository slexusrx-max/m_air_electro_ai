import Link from "next/link";
import { specificationLabel } from "@/lib/marketplace/specifications";
import { CompareControl } from "./compare-control";
import { EquipmentVisual } from "./equipment-visual";
import type { CatalogProduct } from "@/lib/affiliate/types";
import type { Dictionary } from "@/lib/i18n/types";
import type { Equipment } from "@/lib/marketplace/catalog-data";
import { categoryByPath } from "@/lib/marketplace/content";
export function ProductCard({
  product,
  dictionary: t,
}: {
  product: CatalogProduct;
  dictionary: Dictionary;
}) {
  const p = product as Equipment;
  const ro = t["locale.code"] === "ro";
  return (
    <article className="equipment-card">
      <Link
        href={`/marketplace/products/${p.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <EquipmentVisual category={p.category} />
      </Link>
      <p className="eyebrow">
        {p.kind === "product"
          ? p.brand
          : ro
            ? "Clasă de echipament"
            : "Equipment class"}
      </p>
      <h3>
        <Link href={`/marketplace/products/${p.slug}`}>
          {ro ? (p.title?.ro ?? p.name) : p.name}
        </Link>
      </h3>
      <p>{ro ? (p.summary?.ro ?? p.description) : p.description}</p>
      <dl>
        {Object.entries(p.technicalSpecs)
          .slice(0, 3)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{specificationLabel(k, ro)}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      <Link className="text-link" href={`/marketplace/products/${p.slug}`}>
        {ro ? "Detalii și compatibilitate" : "Details & compatibility"} →
      </Link>
      <CompareControl id={p.id} ro={ro} />
      <div className="product-actions">
        <Link href={categoryByPath(p.paths?.[0] ?? "")?.calculator ?? "/marketplace/find-my-solution"}>
          {ro ? "Calculează necesarul" : "Calculate requirements"} →
        </Link>
        {p.productUrl && <a href={p.productUrl} target="_blank" rel="noopener noreferrer">
          {ro ? "Verifică prețul la furnizor" : "Check price at supplier"} ↗
        </a>}
      </div>
    </article>
  );
}

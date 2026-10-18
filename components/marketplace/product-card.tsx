import { SupplierLink } from "./supplier-link";
import Link from "@/components/localized-link";
import { specificationLabel } from "@/lib/marketplace/specifications";
import { CompareControl } from "./compare-control";
import { ProductVisual } from "./product-visual";
import { isCatalogListing } from "@/lib/marketplace/product-presentation";
import type { CatalogProduct } from "@/lib/affiliate/types";
import type { Dictionary } from "@/lib/i18n/types";
import type { Equipment } from "@/lib/marketplace/catalog-data";
import { categoryByPath } from "@/lib/marketplace/content";
export function ProductCard({
  product,
  dictionary: t,
  extended = false,
}: {
  product: CatalogProduct;
  dictionary: Dictionary;
  extended?: boolean;
}) {
  const p = product as Equipment;
  const ro = t["locale.code"] === "ro";
  if (!isCatalogListing(p)) return null;
  return (
    <article className="equipment-card">
      <Link
        href={`/marketplace/products/${p.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductVisual product={p} ro={ro} />
      </Link>
      {p.kind === "equipment-class" && <p className="small-copy" data-testid="equipment-class-image-note">
        {ro ? "Imagine ilustrativă a categoriei. Ghid, fără ofertă de cumpărare." : "Illustrative category image. Guide, not a purchase offer."}
      </p>}
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
      <p className="product-purpose">{ro ? p.bestFor.ro : p.bestFor.en}</p>
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
      <details className="product-context">
        <summary>{ro ? "Utilizare și limite" : "Applications & limitations"}</summary>
        <p><strong>{ro ? "Utilizare" : "Applications"}</strong>{ro ? p.bestFor.ro : p.bestFor.en}</p>
        {extended && <p><strong>{ro ? "Compatibilitate" : "Compatibility"}</strong>{ro ? p.compatibility.ro : p.compatibility.en}</p>}
        <p><strong>{ro ? "Limite" : "Limitations"}</strong>{ro ? p.limitations.ro : p.limitations.en}</p>
      </details>
      <Link className="text-link" href={`/marketplace/products/${p.slug}`}>
        {ro ? "Detalii și compatibilitate" : "Details & compatibility"} →
      </Link>
      <CompareControl id={p.id} ro={ro} />
      <div className="product-actions">
        <Link href={categoryByPath(p.paths?.[0] ?? "")?.calculator ?? "/marketplace/find-my-solution"}>
          {ro ? "Calculează necesarul" : "Calculate requirements"} →
        </Link>
        <SupplierLink product={p} ro={ro} />
      </div>
    </article>
  );
}

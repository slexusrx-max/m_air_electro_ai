import { SupplierPrice } from "./supplier-link";
import { EquipmentGuideActions } from "./equipment-guide-actions";
import Link from "@/components/localized-link";
import { specificationLabel, specificationValue } from "@/lib/marketplace/specifications";
import { CompareControl } from "./compare-control";
import { ProductVisual } from "./product-visual";
import { isCatalogListing } from "@/lib/marketplace/product-presentation";
import { cardSpecifications } from "@/lib/marketplace/card-specifications";
import { categoryByPath, legacyCategories } from "@/lib/marketplace/content";
import { CategoryIdentifier } from "./category-identifier";
import styles from "./product-card.module.css";
import type { CatalogProduct } from "@/lib/affiliate/types";
import type { Dictionary } from "@/lib/i18n/types";
import type { Equipment } from "@/lib/marketplace/catalog-data";
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
  const categoryPath = legacyCategories[p.category] ?? p.category;
  const category = categoryByPath(categoryPath);
  const sku = p.technicalSpecs.SKU ?? p.technicalSpecs["Feed SKU"];
  const specs = cardSpecifications(p);
  return (
    <article className={`equipment-card ${styles.card}`} data-product-card={p.id} data-card-tone={p.category === "water" ? "water" : "energy"} data-pointer-tilt>
      {p.kind === "equipment-class" && <p className="eyebrow">{ro ? "Ghid de alegere · fără model selectat" : "Buying guide · no model selected"}</p>}
      <Link
        className={styles.imageLink}
        href={`/marketplace/products/${p.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductVisual product={p} ro={ro} />
      </Link>
      {p.kind === "equipment-class" && <p className="small-copy" data-testid="equipment-class-image-note">
        {ro ? "Imagine ilustrativă a categoriei. Ghid, fără ofertă de cumpărare." : "Illustrative category image. Guide, not a purchase offer."}
      </p>}
      <div className={styles.identity}>
        <div className={styles.category}><CategoryIdentifier category={p.category} /><span>{category ? category.title[ro ? "ro" : "en"] : p.category}</span></div>
        <p className={`eyebrow ${styles.manufacturer}`}>
          {p.kind === "product" ? p.brand : ro ? "Clasă de echipament" : "Equipment class"}
        </p>
        <h3 className={styles.title}>
          <Link href={`/marketplace/products/${p.slug}`}>
            {ro ? (p.title?.ro ?? p.name) : p.name}
          </Link>
        </h3>
        {sku && <p className={styles.sku}>SKU: <span>{sku}</span></p>}
      </div>
      {specs.length ? <dl className={styles.specs} aria-label={ro ? "Specificații principale documentate" : "Documented key specifications"}>
        {specs
          .map(([k, v]) => (
            <div key={k}>
              <dt>{specificationLabel(k, ro)}</dt>
              <dd>{specificationValue(v, ro)}</dd>
            </div>
          ))}
      </dl> : <p className="small-copy">{ro ? "Specificații nedocumentate." : "Specifications not documented."}</p>}
      <p className={`product-purpose ${styles.purpose}`}><strong>{ro ? "Potrivit pentru" : "Suitable for"}</strong><span>{ro ? p.bestFor.ro : p.bestFor.en}</span></p>
      <div className={styles.actions}>
        <CompareControl id={p.id} ro={ro} />
        {p.kind === "equipment-class" ? <EquipmentGuideActions product={p} ro={ro} /> : <SupplierPrice product={p} ro={ro} prominent />}
        <Link className={`text-link ${styles.detailsLink}`} href={`/marketplace/products/${p.slug}`}>
          {ro ? "Detalii și compatibilitate" : "Details & compatibility"} →
        </Link>
      </div>
      <details className={`product-context ${styles.context}`}>
        <summary>{ro ? "Utilizare și limite" : "Applications & limitations"}</summary>
        {extended && <p><strong>{ro ? "Compatibilitate" : "Compatibility"}</strong>{ro ? p.compatibility.ro : p.compatibility.en}</p>}
        <p><strong>{ro ? "Limite" : "Limitations"}</strong>{ro ? p.limitations.ro : p.limitations.en}</p>
      </details>
    </article>
  );
}

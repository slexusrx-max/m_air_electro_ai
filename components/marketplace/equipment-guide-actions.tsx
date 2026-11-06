import Link from "@/components/localized-link";
import { categoryByPath } from "@/lib/marketplace/content";
import type { Equipment } from "@/lib/marketplace/catalog-data";

/** Category destinations are separate from exact-model and affiliate mappings. */
export function EquipmentGuideActions({ product, ro }: { product: Equipment; ro: boolean }) {
  if (product.kind !== "equipment-class") return null;
  const category = categoryByPath(product.paths[0]);
  // Merchant category and Romania delivery policy checked on 6 November 2026.
  // Evidence: docs/ev-supplier-navigation-2026-11-06.md. This is not a model offer.
  const ev = product.id === "ac-ev-charging-class";
  return <div className="equipment-guide-actions" data-equipment-guide-actions={product.id}>
    <p className="small-copy">{ev
      ? (ro ? "Alege un model concret din catalogul comerciantului. Fotografia de aici ilustrează categoria, nu un produs oferit spre cumpărare."
        : "Choose a specific model in the retailer's catalog. The photo here illustrates the category, not a product offered for purchase.")
      : (ro ? "Acesta este un ghid de selecție. Nu este selectat un model comercial sau un furnizor."
        : "This is a selection guide. No commercial model or supplier has been selected.")}</p>
    {ev && <>
      <a className="button-primary" href="https://ev-mag.ro/15-statii-de-incarcare-home" target="_blank" rel="noopener noreferrer"
        data-supplier-product={product.id} data-supplier="ev-mag" data-supplier-category={product.category}
        data-supplier-language={ro ? "ro" : "en"} data-supplier-kind="equipment-class"
        data-tracking-status="ordinary" data-disclosure-status="not-required" data-destination-kind="merchant-category">
        {ro ? "Vezi stațiile de încărcare la EV-Mag" : "View charging stations at EV-Mag"} ↗
      </a>
      <p className="small-copy">{ro ? "Catalog extern · link neafiliat. Confirmă modelul, prețul, livrarea și instalarea la comerciant."
        : "External catalog · non-affiliate link. Confirm the model, price, delivery and installation with the retailer."}</p>
    </>}
    {category && <Link className={ev ? "text-link" : "button-primary"} href={`/learn/${category.guide}`}>
      {ro ? "Citește ghidul de alegere" : "Read the buying guide"} →
    </Link>}
  </div>;
}

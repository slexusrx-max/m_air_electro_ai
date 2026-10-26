import Link from "@/components/localized-link";
import type { PublicSupplierPrice } from "@/lib/affiliate/pricing";
import { supplierEntryName, type SupplierEntry } from "@/lib/marketplace/supplier-discovery";

export function SupplierEntryCard({ entry, price, ro }: { entry: SupplierEntry; price?: PublicSupplierPrice; ro: boolean }) {
  return <article className="supplier-entry-card" data-feed-sku={entry.sku} data-price-status={price ? "fresh" : "unavailable"}>
    <p className="eyebrow">Renogy EU · {ro ? "Catalog furnizor" : "Supplier catalog"}</p>
    <h3>{supplierEntryName(entry)}</h3>
    <p className="small-copy">SKU {entry.sku} · {entry.kind === "variant" ? (ro ? "Variantă" : "Variant") : entry.kind === "parent" ? (ro ? "Poziție principală" : "Parent entry") : (ro ? "Poziție feed" : "Feed entry")}</p>
    <p>{ro ? "Denumire din feed-ul oficial. Specificațiile și compatibilitatea acestei poziții nu sunt evaluate individual." : "Name from the official feed. Specifications and compatibility of this entry have not been individually evaluated."}</p>
    {price && <div className="supplier-entry-price"><strong>{new Intl.NumberFormat(ro ? "ro-RO" : "en-IE", { style: "currency", currency: "EUR" }).format(price.amount)}</strong><span>{ro ? "Preț din feed, actualizat" : "Feed price, updated"} {new Intl.DateTimeFormat(ro ? "ro-RO" : "en-GB", { dateStyle: "medium", timeZone: "Europe/Bucharest" }).format(new Date(price.retrievedAt))}</span></div>}
    <a className="button-primary" href={entry.url} target="_blank" rel="noopener noreferrer">{price ? (ro ? "Vezi varianta la Renogy EU" : "Check variant at Renogy EU") : (ro ? "Verifică prețul actual la furnizor" : "Check current price with supplier")} ↗</a>
    <p className="small-copy">{ro ? "Selectează varianta exactă pe pagina furnizorului. Link obișnuit, fără urmărire afiliată." : "Select the exact variant on the supplier page. Ordinary link, without affiliate tracking."}</p>
    <Link href={`/renogy/catalog?q=${entry.sku}`}>{ro ? "Vezi în indexul furnizorului" : "View in the supplier index"} →</Link>
  </article>;
}

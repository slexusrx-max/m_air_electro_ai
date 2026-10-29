import type { ReactNode } from "react";
import { renogyLink } from "@/lib/affiliate/providers/renogy";
import { validSupplierUrl } from "@/lib/affiliate/suppliers";
import type { SupplierEntry } from "@/lib/marketplace/supplier-discovery";

/** Prefer an exact issued SKU mapping; otherwise preserve the approved parent or ordinary link. */
function renogyEntryLink(entry: SupplierEntry) {
  const variantUrl = new URL(entry.url);
  variantUrl.searchParams.set("variant", entry.sku);
  // The strict resolver rejects unreviewed variants; raw feed rows must keep
  // their existing parent/ordinary path instead of failing page rendering.
  if (!validSupplierUrl(variantUrl.href, "renogy")) return renogyLink(entry.url);
  const exactVariant = renogyLink(variantUrl.href);
  return exactVariant.tracked ? exactVariant : renogyLink(entry.url);
}

export function RenogyFeedLink({ entry, ro, className, children }: {
  entry: SupplierEntry; ro: boolean; className?: string; children: ReactNode;
}) {
  const link = renogyEntryLink(entry);
  return <a href={link.href} target="_blank" className={className}
    rel={link.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer"}
    data-supplier-product={`renogy-feed-${entry.sku}`} data-supplier="renogy"
    data-supplier-category="supplier-entry" data-supplier-language={ro ? "ro" : "en"}
    data-tracking-status={link.tracked ? "active" : "ordinary"}
    data-disclosure-status={link.tracked ? "labelled" : "not-required"}>
    {children} ↗{link.tracked ? (ro ? " (link afiliat)" : " (affiliate link)") : ""}
  </a>;
}

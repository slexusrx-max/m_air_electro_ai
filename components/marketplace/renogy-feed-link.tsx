import type { ReactNode } from "react";
import { renogyLink } from "@/lib/affiliate/providers/renogy";
import type { SupplierEntry } from "@/lib/marketplace/supplier-discovery";

/** Uses only exact approved mappings; unmapped variants remain ordinary. */
export function RenogyFeedLink({ entry, ro, className, children }: {
  entry: SupplierEntry; ro: boolean; className?: string; children: ReactNode;
}) {
  const link = renogyLink(entry.url);
  return <a href={link.href} target="_blank" className={className}
    rel={link.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer"}
    data-supplier-product={`renogy-feed-${entry.sku}`} data-supplier="renogy"
    data-supplier-category="supplier-entry" data-supplier-language={ro ? "ro" : "en"}
    data-tracking-status={link.tracked ? "active" : "ordinary"}
    data-disclosure-status={link.tracked ? "labelled" : "not-required"}>
    {children} ↗{link.tracked ? (ro ? " (link afiliat)" : " (affiliate link)") : ""}
  </a>;
}

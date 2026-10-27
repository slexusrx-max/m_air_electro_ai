"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { CatalogProduct } from "@/lib/affiliate/types";
import type { PublicSupplierPrice } from "@/lib/affiliate/pricing";

type PublicLink = { href: string; tracked: boolean };
const SupplierLinks = createContext<Record<string, PublicLink>>({});
export function SupplierLinksProvider({ links, children }: { links: Record<string, PublicLink>; prices: Record<string, PublicSupplierPrice>; children: ReactNode }) {
  return <SupplierLinks.Provider value={links}>{children}</SupplierLinks.Provider>;
}

/** Receives only resolved public URLs from the server, including in the interactive finder. */
export function SupplierLink({ product, ro, children, className }: {
  product: CatalogProduct;
  ro: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const links = useContext(SupplierLinks);
  if (!product.productUrl) return null;
  const link = product.availability === "unavailable" ? { href: product.productUrl, tracked: false } : links[product.id] ?? { href: product.productUrl, tracked: false };
  return <a href={link.href} target="_blank" className={className}
    rel={link.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer"}
    data-supplier-product={product.id} data-supplier={product.provider}
    data-supplier-category={product.category} data-supplier-language={ro ? "ro" : "en"}
    data-tracking-status={link.tracked ? "active" : "ordinary"}
    data-disclosure-status={link.tracked ? "labelled" : "not-required"}>
    {product.availability === "unavailable" ? (ro ? "Model retras - documentatia producatorului" : "Discontinued model - manufacturer documentation") : children ?? (ro ? "Verifică prețul la furnizor" : "Check price at supplier")} ↗
    {link.tracked ? (ro ? " (link afiliat)" : " (affiliate link)") : ""}
  </a>;
}

export function SupplierPrice({ product, ro, prominent = false, compact = false }: {
  product: CatalogProduct;
  ro: boolean;
  prominent?: boolean;
  compact?: boolean;
}) {
  if (!product.productUrl) return null;
  // Owner policy: supplier prices are checked at the merchant, never rendered here.
  return <div className={`supplier-price supplier-price-unavailable${compact ? " supplier-price-compact" : ""}`} data-price-status="unavailable">
    <SupplierLink product={product} ro={ro} className={prominent ? "button-primary" : undefined}>
      {ro ? `Vezi prețul actual la ${product.merchant}` : `See current price at ${product.merchant}`}
    </SupplierLink>
  </div>;
}

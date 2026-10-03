"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { CatalogProduct } from "@/lib/affiliate/types";

type PublicLink = { href: string; tracked: boolean };
const SupplierLinks = createContext<Record<string, PublicLink>>({});
export function SupplierLinksProvider({ links, children }: { links: Record<string, PublicLink>; children: ReactNode }) {
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
  const link = links[product.id] ?? { href: product.productUrl, tracked: false };
  return <a href={link.href} target="_blank" className={className}
    rel={link.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer"}
    data-supplier-product={product.id} data-supplier={product.provider}
    data-supplier-category={product.category} data-supplier-language={ro ? "ro" : "en"}
    data-tracking-status={link.tracked ? "active" : "ordinary"}
    data-disclosure-status={link.tracked ? "labelled" : "not-required"}>
    {children ?? (ro ? "Verifică prețul la furnizor" : "Check price at supplier")} ↗
    {link.tracked ? (ro ? " (link afiliat)" : " (affiliate link)") : ""}
  </a>;
}

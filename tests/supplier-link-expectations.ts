import { expect, type Locator } from "@playwright/test";
import type { CatalogProduct } from "../lib/affiliate/types";

// Actual issued Waterdrop URLs recorded in the 2026-10-13 launch evidence.
const waterdropIssued: Record<string, string> = {
  "waterdrop-g3p600": "https://dewaterdropfilter.pxf.io/OYJAjQ",
  "waterdrop-g3p800": "https://dewaterdropfilter.pxf.io/vDrd7d",
  "waterdrop-x12": "https://dewaterdropfilter.pxf.io/4aYV19",
};

export async function expectSupplierCta(link: Locator, product: CatalogProduct, production: boolean) {
  const tracked = production && product.provider === "waterdrop-eu";
  const href = tracked ? waterdropIssued[product.id] : product.productUrl;
  expect(href, `Known destination for ${product.id}`).toBeTruthy();
  await expect(link).toHaveAttribute("href", href);
  await expect(link).toHaveAttribute("data-supplier", product.provider);
  await expect(link).toHaveAttribute("data-tracking-status", tracked ? "active" : "ordinary");
  await expect(link).toHaveAttribute("data-disclosure-status", tracked ? "labelled" : "not-required");
  if (tracked) expect(await link.getAttribute("rel")).toContain("sponsored");
  else expect(await link.getAttribute("rel")).not.toContain("sponsored");
}

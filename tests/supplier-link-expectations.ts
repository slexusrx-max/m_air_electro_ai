import expansion from "../data/waterdrop-reviewed-expansion.json";
import { expect, type Locator } from "@playwright/test";
import type { CatalogProduct } from "../lib/affiliate/types";
import reviewedRenogyLinks from "../data/renogy-reviewed-links.json";
import existingRenogyLinks from "./fixtures/renogy-existing-production-links.json";
const renogyLinks: Record<string, string> = { ...existingRenogyLinks, ...reviewedRenogyLinks };

// Actual issued Waterdrop URLs recorded in the 2026-10-13 launch evidence.
const waterdropIssued: Record<string, string> = {
  ...Object.fromEntries(expansion.map(r=>[r.id,r.issued])),
  "waterdrop-g3p600": "https://dewaterdropfilter.pxf.io/OYJAjQ",
  "waterdrop-g3p800": "https://dewaterdropfilter.pxf.io/vDrd7d",
  "waterdrop-x12": "https://dewaterdropfilter.pxf.io/4aYV19",
};

export async function expectSupplierCta(link: Locator, product: CatalogProduct, production: boolean) {
  const candidate = product.provider === "waterdrop-eu" ? waterdropIssued[product.id]
    : product.provider === "renogy" ? renogyLinks[product.productUrl] : undefined;
  const tracked = production && product.availability !== "unavailable" && Boolean(candidate);
  const href = tracked ? candidate! : product.productUrl;
  expect(href, `Known destination for ${product.id}`).toBeTruthy();
  await expect(link).toHaveAttribute("href", href);
  await expect(link).toHaveAttribute("data-supplier", product.provider);
  await expect(link).toHaveAttribute("data-tracking-status", tracked ? "active" : "ordinary");
  await expect(link).toHaveAttribute("data-disclosure-status", tracked ? "labelled" : "not-required");
  if (tracked) expect(await link.getAttribute("rel")).toContain("sponsored");
  else expect(await link.getAttribute("rel")).not.toContain("sponsored");
}

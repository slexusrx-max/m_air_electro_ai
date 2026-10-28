import expansion from "../data/waterdrop-reviewed-expansion.json";
import { expect, type Locator } from "@playwright/test";
import type { CatalogProduct } from "../lib/affiliate/types";
import reviewedRenogyLinks from "../data/renogy-reviewed-links.json";
import existingRenogyLinks from "./fixtures/renogy-existing-production-links.json";
import { readFileSync } from "node:fs";
const renogyLinks: Record<string, string> = { ...existingRenogyLinks, ...reviewedRenogyLinks };

// Public href snapshot from the deployed 27 October audit, not network click evidence.
const feedLinks = new Map(readFileSync("docs/affiliate-renogy-feed-links.csv", "utf8")
  .trim().split(/\r?\n/).slice(1).map(line => {
    const cells = line.match(/"(?:[^"]|"")*"/g)?.map(cell => cell.slice(1, -1).replaceAll('""', '"'));
    if (cells?.length !== 6) throw new Error("Invalid audited feed-link row");
    return [cells[0], { source: cells[2], href: cells[3], tracked: cells[4] === "tracked" }] as const;
  }));

export function expectedRenogyFeedLink(entry: { sku: string; url: string }, production: boolean) {
  expect(feedLinks.size).toBe(365);
  const audited = feedLinks.get(entry.sku);
  expect(audited, `Audited SKU ${entry.sku}`).toBeDefined();
  expect(audited!.source).toBe(entry.url);
  const tracked = production && audited!.tracked;
  return { href: production ? audited!.href : entry.url, tracked };
}

export async function expectRenogyFeedCta(link: Locator, entry: { sku: string; url: string }, production: boolean) {
  const { href, tracked } = expectedRenogyFeedLink(entry, production);
  await expect(link).toHaveAttribute("href", href);
  await expect(link).toHaveAttribute("data-supplier-product", `renogy-feed-${entry.sku}`);
  await expect(link).toHaveAttribute("data-supplier", "renogy");
  await expect(link).toHaveAttribute("data-tracking-status", tracked ? "active" : "ordinary");
  await expect(link).toHaveAttribute("data-disclosure-status", tracked ? "labelled" : "not-required");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", tracked ? "sponsored noopener noreferrer" : "noopener noreferrer");
}

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

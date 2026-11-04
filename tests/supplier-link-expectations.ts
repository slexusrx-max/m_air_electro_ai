import { expect, type Locator } from "@playwright/test";
import type { CatalogProduct } from "../lib/affiliate/types";
import reviewedRenogyLinks from "../data/renogy-reviewed-links.json";
import existingRenogyLinks from "./fixtures/renogy-existing-production-links.json";
import { readFileSync } from "node:fs";
import { parseCsvRow } from "./csv-row";
const renogyLinks: Record<string, string> = { ...existingRenogyLinks, ...reviewedRenogyLinks };

// Public href snapshot from the deployed audit, not network click evidence.
const feedLinks = new Map(readFileSync("docs/affiliate-renogy-feed-links.csv", "utf8")
  .trim().split(/\r?\n/).slice(1).map(line => {
    const cells = parseCsvRow(line);
    if (cells.length !== 6 || !["tracked", "ordinary"].includes(cells[4])) throw new Error("Invalid audited feed-link row");
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

export async function expectSupplierCta(link: Locator, product: CatalogProduct, production: boolean) {
  if (product.provider === "waterdrop-eu") {
    // Germany-only eligibility is deliberately blocked on the Romania-facing site.
    // Verify the actual public gate, not historical issued links retained in the data.
    await expect(link).toHaveAttribute("role", "note");
    await expect(link).toHaveAttribute("data-market-status", "blocked-romania");
    await expect(link).toHaveAttribute("data-tracking-status", "disabled");
    expect(await link.getAttribute("href")).toBeNull();
    expect(await link.getAttribute("target")).toBeNull();
    expect(await link.evaluate(element => element.tagName)).not.toBe("A");
    return;
  }
  const candidate = product.provider === "renogy" ? renogyLinks[product.productUrl] : undefined;
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

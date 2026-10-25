import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { equipment, type Equipment } from "../lib/marketplace/catalog-data";
import { categories, legacyCategories } from "../lib/marketplace/content";
import { productPhotos } from "../lib/marketplace/product-photos";
import { validSupplierUrl } from "../lib/affiliate/suppliers";
import { verifiedWaterdropLinks } from "../lib/affiliate/waterdrop-policy";
import { verifiedImpactLinks } from "../lib/affiliate/renogy-policy";
import waterdrop from "../data/waterdrop-reviewed-expansion.json";
import renogyLinks from "../data/renogy-reviewed-links.json";
import { renogyParentLinks } from "../lib/affiliate/renogy-parent-links";
import parentPhotos from "../data/renogy-parent-photos.json";

const identifier = /^[a-z0-9][a-z0-9-]*$/;
const date = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const imageUrl = (value: string) => {
  if (/^\/product-photos\/[a-z0-9.-]+$/.test(value)) return existsSync(`public${value}`);
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.hash; } catch { return false; }
};

/** Offline structural validation, not freshness, licensing or merchant-stock certification. */
export function validateCatalog(rows: Equipment[], photos = productPhotos): string[] {
  const errors: string[] = [];
  const ids = new Set<string>(), slugs = new Set<string>();
  const paths = new Set(categories.map(category => category.path));
  for (const row of rows) {
    const fail = (message: string) => errors.push(`${row.id}: ${message}`);
    if (!identifier.test(row.id) || ids.has(row.id)) fail("invalid or duplicate canonical id");
    if (!identifier.test(row.slug) || slugs.has(row.slug)) fail("invalid or duplicate canonical slug");
    ids.add(row.id); slugs.add(row.slug);
    if (!["product", "equipment-class"].includes(row.kind)) fail("invalid record kind");
    if (!Object.hasOwn(legacyCategories, row.category) && row.category !== "water") fail("unknown category id");
    if (!Array.isArray(row.paths) || !row.paths.length || row.paths.some(path => !paths.has(path))) fail("unknown category path");
    for (const field of [row.title, row.summary]) if (!field || !field.ro?.trim() || !field.en?.trim()) fail("missing bilingual title/summary");
    if (!["partner-check", "unavailable"].includes(row.availability)) fail("invalid availability state");
    if (!date(row.lastUpdated)) fail("invalid source timestamp");
    if (row.price !== null && (!Number.isFinite(row.price) || row.price < 0)) fail("invalid price");
    if (row.kind === "product") {
      if (!("sourceCheckedAt" in row) || typeof row.sourceCheckedAt !== "string" || !date(row.sourceCheckedAt) || row.sourceCheckedAt !== row.lastUpdated) fail("missing or inconsistent source review timestamp");
      if (!validSupplierUrl(row.productUrl, row.provider)) fail("invalid merchant destination");
      if (!Array.isArray(row.sourceUrls) || !row.sourceUrls.includes(row.productUrl)) fail("missing product source association");
    }
  }
  for (const [id, photo] of Object.entries(photos)) {
    if (!rows.some(row => row.id === id && row.kind === "product")) errors.push(`${id}: orphan photo association`);
    if (!imageUrl(photo.src) || !(photo.width > 0 && photo.height > 0)) errors.push(`${id}: invalid photo metadata`);
  }
  return errors;
}

export function validateReviewedLinks() {
  const errors: string[] = [];
  const links = Object.fromEntries(waterdrop.map(row => [row.url, row.issued]));
  if (Object.keys(verifiedWaterdropLinks(links)).length !== waterdrop.length) errors.push("Waterdrop reviewed link shape or duplicate source");
  const renogy = { ...renogyLinks, ...renogyParentLinks };
  if (Object.keys(verifiedImpactLinks(renogy, '["https://renogy.sjv.io"]')).length !== Object.keys(renogy).length) errors.push("Renogy reviewed link shape");
  const entries: Record<string, { status: string; src?: string; width?: number; height?: number; reason?: string }> = parentPhotos.entries;
  for (const [url, photo] of Object.entries(entries)) {
    if (!Object.hasOwn(renogyParentLinks, url)) errors.push("Orphan Renogy parent photo association");
    if (photo.status === "omitted" ? !photo.reason : photo.status !== "representative" || !photo.src || !imageUrl(photo.src) || !(photo.width! > 0 && photo.height! > 0)) errors.push(`Invalid parent photo metadata: ${url}`);
  }
  for (const url of Object.keys(renogyParentLinks)) if (!Object.hasOwn(entries, url)) errors.push(`Missing parent photo decision: ${url}`);
  if (!date(parentPhotos.inspectedAt)) errors.push("Invalid parent photo review timestamp");
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = [...validateCatalog(equipment), ...validateReviewedLinks()];
  console.log(JSON.stringify({ records: equipment.length, models: equipment.filter(row => row.kind === "product").length, photos: Object.keys(productPhotos).length, errors }, null, 2));
  if (errors.length) process.exitCode = 1;
}

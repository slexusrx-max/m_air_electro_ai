import test from "node:test";
import assert from "node:assert/strict";
import { catalog, productBySlug } from "../lib/affiliate/catalog";
import { filterEquipment } from "../lib/marketplace/query";
import { isCatalogListing, categoryImagePath } from "../lib/marketplace/product-presentation";
import { rootCategories } from "../lib/marketplace/content";
import { categoryPhotos } from "../lib/marketplace/category-photos";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

test("reference battery remains addressable but never appears in catalog results", () => {
  const reference = productBySlug("lfp-battery-12v-100ah-class")!;
  assert.equal(reference.kind, "equipment-class");
  assert.equal(isCatalogListing(reference), false);
  for (const query of [{}, { q: "100 Ah" }, { kind: "equipment-class" }, { q: reference.name }])
    assert.ok(filterEquipment(catalog, query).every(product => product.id !== reference.id));
  assert.ok(filterEquipment(catalog, { q: "100 Ah" }).some(product => product.id === "renogy-mini-100"));
});

test("every root category has a distinct decodable photo with correct dimensions and source", async () => {
  const hashes = new Set<string>();
  for (const category of rootCategories) {
    const photo = categoryPhotos[category.path];
    assert.ok(photo, `Missing photo: ${category.path}`);
    assert.match(photo.source, /^https:\/\//);
    assert.ok(photo.credit);
    const bytes = readFileSync(new URL(`../public${photo.src}`, import.meta.url));
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, photo.width, category.path);
    assert.equal(metadata.height, photo.height, category.path);
    const hash = createHash("sha256").update(bytes).digest("hex");
    assert.ok(!hashes.has(hash), `Duplicate category photo: ${category.path}`);
    hashes.add(hash);
  }
  assert.equal(hashes.size, rootCategories.length);
});

test("category artwork is shared, not a verified model photograph", () => {
  for (const id of ["renogy-mini-100", "renogy-mini-200"]) {
    const product = catalog.find(product => product.id === id)!;
    assert.equal(categoryImagePath(product.category), "/product-photos/renogy-mini-100.jpg");
    assert.equal(product.image, null);
  }
  assert.ok(catalog.filter(product => product.kind === "product").every(product => product.image === null));
});

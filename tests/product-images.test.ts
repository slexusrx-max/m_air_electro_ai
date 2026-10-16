import test from "node:test";
import assert from "node:assert/strict";
import { catalog, productBySlug } from "../lib/affiliate/catalog";
import { filterEquipment } from "../lib/marketplace/query";
import { isCatalogListing, categoryImagePath } from "../lib/marketplace/product-presentation";

test("reference battery remains addressable but never appears in catalog results", () => {
  const reference = productBySlug("lfp-battery-12v-100ah-class")!;
  assert.equal(reference.kind, "equipment-class");
  assert.equal(isCatalogListing(reference), false);
  for (const query of [{}, { q: "100 Ah" }, { kind: "equipment-class" }, { q: reference.name }])
    assert.ok(filterEquipment(catalog, query).every(product => product.id !== reference.id));
  assert.ok(filterEquipment(catalog, { q: "100 Ah" }).some(product => product.id === "renogy-mini-100"));
});

test("category artwork is shared, not a verified model photograph", () => {
  for (const id of ["renogy-mini-100", "renogy-mini-200"]) {
    const product = catalog.find(product => product.id === id)!;
    assert.equal(categoryImagePath(product.category), "/equipment/lifepo4-battery-studio.png");
    assert.equal(product.image, null);
  }
  assert.ok(catalog.filter(product => product.kind === "product").every(product => product.image === null));
});

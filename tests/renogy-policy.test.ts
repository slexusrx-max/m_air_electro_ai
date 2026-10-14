import test from "node:test";
import assert from "node:assert/strict";
import { renogyProgram, verifiedImpactLinks } from "../lib/affiliate/renogy-policy";
import { equipment } from "../lib/marketplace/catalog-data";
import { publicRoutes } from "../lib/marketplace/routes";
import { validSupplierUrl } from "../lib/affiliate/suppliers";

test("Renogy approval records owner evidence, not inferred tracking", () => {
  assert.equal(renogyProgram.programId, "14864");
  assert.equal(renogyProgram.advertiserId, "3086767");
  assert.equal(renogyProgram.approvedAt, "2026-10-14");
  assert.equal(renogyProgram.evidence, "owner-confirmed");
});
test("Renogy requires explicit exact verified origins and rejects unsafe candidates", () => {
  const source = "https://eu.renogy.com/products/test";
  // Reserved example origin is a unit-test fixture, never a production tracking link.
  const target = "https://tracking.example/issued";
  for (const config of [undefined, "bad", "{}", "null", "[]", '["https://tracking.example.evil"]', '["https://tracking.example/path"]']) {
    assert.deepEqual(verifiedImpactLinks({ [source]: target }, config), {});
  }
  const origins = '["https://tracking.example"]';
  assert.deepEqual(verifiedImpactLinks({ [source]: target }, origins), { [source]: target });
  for (const link of ["http://tracking.example/issued", "https://user:pass@tracking.example/issued", "https://tracking.example:444/issued", "https://tracking.example/issued#fragment", "https://unapproved.example/issued", source]) {
    assert.deepEqual(verifiedImpactLinks({ [source]: link }, origins), {});
  }
});
test("Renogy storefront uses the seven existing EU models with no fabricated commercial data", () => {
  const products = equipment.filter(p => p.provider === "renogy");
  assert.equal(products.length, 7);
  assert.ok(publicRoutes.includes("/renogy"));
  for (const p of products) {
    assert.equal(p.brand, "Renogy");
    assert.equal(p.merchant, "Renogy EU");
    assert.ok(validSupplierUrl(p.productUrl, "renogy"));
    assert.equal(p.price, null);
    assert.equal(p.image, null);
    assert.ok(p.bestFor.ro && p.compatibility.ro && p.limitations.ro);
    assert.ok(p.bestFor.en && p.compatibility.en && p.limitations.en);
  }
});

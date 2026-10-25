import test from "node:test";
import assert from "node:assert/strict";
import { equipment } from "../lib/marketplace/catalog-data";
import { validateCatalog, validateReviewedLinks } from "../scripts/validate-catalog";

test("published catalog and reviewed associations pass offline validation with unknown stock/prices", () => {
  assert.deepEqual(validateCatalog(equipment), []);
  assert.deepEqual(validateReviewedLinks(), []);
});
test("catalog validation detects corrupt identities, categories, provenance and photo references", () => {
  const source = equipment.find(row => row.kind === "product")!;
  const corrupt = { ...source, paths:["invented/category"], lastUpdated:"2026-02-30", sourceUrls:[] };
  const errors = validateCatalog([source, corrupt], { orphan:{src:"javascript:alert(1)",width:0,height:1} });
  for (const expected of ["duplicate canonical id", "duplicate canonical slug", "unknown category path", "invalid source timestamp", "missing product source association", "orphan photo association", "invalid photo metadata"]) assert.ok(errors.some(error => error.includes(expected)), expected);
});

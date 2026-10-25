import test from "node:test";
import assert from "node:assert/strict";
import { equipment } from "../lib/marketplace/catalog-data";
import { validateCatalog, validateReviewedLinks, validLocalPhoto } from "../scripts/validate-catalog";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("published catalog and reviewed associations pass offline validation with unknown stock/prices", () => {
  assert.deepEqual(validateCatalog(equipment), []);
  assert.deepEqual(validateReviewedLinks(), []);
});
test("local photos must be contained nonempty regular files with supported extensions", () => {
  const fixture = mkdtempSync(join(tmpdir(), "mair-photo-validation-"));
  try {
    const root = join(fixture, "product-photos"); mkdirSync(root);
    writeFileSync(join(root, "valid.png"), "fixture");
    writeFileSync(join(root, "empty.png"), "");
    writeFileSync(join(root, "unsupported.txt"), "fixture");
    writeFileSync(join(fixture, "outside.png"), "fixture");
    mkdirSync(join(root, "directory.png"));
    assert.equal(validLocalPhoto("/product-photos/valid.png", root), true);
    for (const path of [".", "..", "directory.png", "empty.png", "missing.png", "unsupported.txt", "../outside.png", "%2e%2e/outside.png", "./valid.png", "..\\outside.png"]) {
      assert.equal(validLocalPhoto(`/product-photos/${path}`, root), false, path);
    }
  } finally { rmSync(fixture, { recursive:true, force:true }); }
});
test("catalog validation detects corrupt identities, categories, provenance and photo references", () => {
  const source = equipment.find(row => row.kind === "product")!;
  const corrupt = { ...source, paths:["invented/category"], lastUpdated:"2026-02-30", sourceUrls:[] };
  const errors = validateCatalog([source, corrupt], { orphan:{src:"javascript:alert(1)",width:0,height:1} });
  for (const expected of ["duplicate canonical id", "duplicate canonical slug", "unknown category path", "invalid source timestamp", "missing product source association", "orphan photo association", "invalid photo metadata"]) assert.ok(errors.some(error => error.includes(expected)), expected);
});

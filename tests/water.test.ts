import test from "node:test";
import assert from "node:assert/strict";
import { waterCategories, waterContaminants, documentedWaterClaims, type WaterPerformanceClaim } from "../lib/marketplace/water";
import { waterSuppliers } from "../lib/affiliate/providers/water";
import { publicRoutes, legacyRedirects } from "../lib/marketplace/routes";
import { navigation } from "../lib/marketplace/navigation";
import { catalog } from "../lib/affiliate/catalog";
import { visualFamily } from "../lib/visual-system";

test("water categories are reachable in both marketplace menus", () => {
  assert.equal(waterCategories.length, 10);
  assert.equal(legacyRedirects["/water"], "/marketplace/water");
  for (const locale of ["ro", "en"] as const) {
    const root = navigation(locale)[0].children?.find(c => c.href === "/marketplace/water");
    assert.ok(root);
    for (const c of waterCategories) {
      const path = `/marketplace/water/${c.slug}`;
      assert.ok(publicRoutes.includes(path));
      assert.ok(root.children?.some(child => child.href === path));
      assert.ok(c.checks[locale].length > 80);
    }
  }
});
test("missing evidence never becomes a contaminant match", () => {
  assert.equal(waterContaminants.length, 9);
  for (const c of waterContaminants) {
    for (const product of catalog) assert.equal(documentedWaterClaims(product.id, product.waterPerformance ?? [], c.id).length, 0);
  }
  const claim: WaterPerformanceClaim = { productId: "fixture", model: "Fixture model", cartridge: "Fixture cartridge", contaminant: "lead", testedSubstance: "Lead", performance: "Synthetic test evidence, not a public claim", conditions: "Synthetic conditions", officialSpecificationUrl: "https://example.com/spec", independentEvidence: null, checkedAt: "2026-10-01" };
  assert.equal(documentedWaterClaims("fixture", [claim], "lead").length, 1);
  assert.equal(documentedWaterClaims("other", [claim], "lead").length, 0);
  assert.equal(documentedWaterClaims("fixture", [claim], "heavy-metals").length, 0);
  for (const field of ["model", "cartridge", "testedSubstance", "performance", "conditions", "officialSpecificationUrl", "checkedAt"] as const) {
    assert.equal(documentedWaterClaims("fixture", [{ ...claim, [field]: "" }], "lead").length, 0, field);
  }
});
test("supplier preparation has no approval or tracking and turquoise stays scoped", () => {
  for (const supplier of waterSuppliers) {
    assert.equal(supplier.affiliateApproved, false);
    if (supplier.phase === "initial") {
      const url = new URL(supplier.url!);
      assert.equal(url.protocol, "https:"); assert.equal(url.search, "");
    } else assert.equal(supplier.url, null);
  }
  assert.equal(visualFamily("/"), "brand");
  assert.equal(visualFamily("/marketplace"), "marketplace");
  assert.equal(visualFamily("/marketplace/water"), "water");
});

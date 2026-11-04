import test from "node:test";
import assert from "node:assert/strict";
import { guides } from "../lib/marketplace/guides";
import { publicRoutes } from "../lib/marketplace/routes";
import { catalog } from "../lib/affiliate/catalog";
import { comparableSelection } from "../lib/marketplace/comparison";
import { waterGuideSourceLabel, waterSelectionRoutes } from "../lib/marketplace/water-guide-content";

test("water selection guidance links to existing categories and real, same-format model comparisons", () => {
  const guide = guides.find(guide => guide.slug === "choosing-water-system")!;
  assert.equal(guides.filter(candidate => candidate.slug === guide.slug).length, 1);
  assert.equal(guide.category, "water");
  for (const route of waterSelectionRoutes) {
    assert.ok(publicRoutes.includes(route.href), route.href);
    assert.ok(route.title.ro && route.title.en && route.summary.ro && route.summary.en);
  }
  assert.equal(guide.equipmentGroups?.length, 2);
  for (const group of guide.equipmentGroups!) {
    const selection = comparableSelection(group.productIds.join(","), catalog);
    assert.equal(selection.invalid, false);
    assert.equal(selection.selected.length, 2);
    const formats = new Set(selection.selected.map(product => product.technicalSpecs.Installation));
    assert.equal(formats.size, 1, "Separate countertop and under-sink examples");
    for (const product of selection.selected) {
      assert.equal(product.kind, "product");
      assert.equal(product.category, "water");
      assert.notEqual(product.availability, "unavailable");
      assert.equal(product.waterPerformance, undefined, "Examples acquire no new contaminant claims");
      assert.ok(publicRoutes.includes(`/marketplace/products/${product.slug}`));
    }
  }
});

test("water source names identify the actual authorities and unknown sources never become Victron", () => {
  const guide = guides.find(guide => guide.slug === "choosing-water-system")!;
  assert.equal(guide.sources.length, 4);
  for (const source of guide.sources) {
    const label = waterGuideSourceLabel(source);
    assert.match(label, /^(CDC|NSF) · /);
    assert.doesNotMatch(label, /Victron|Wiring/);
  }
  const unknown = "https://example.org/unreviewed-source";
  assert.equal(waterGuideSourceLabel(unknown), unknown);
  assert.ok(guide.sources.includes("https://www.cdc.gov/water-emergency/about/"));
});

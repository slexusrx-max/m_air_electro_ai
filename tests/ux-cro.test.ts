import test from "node:test";
import assert from "node:assert/strict";
import feed from "../data/renogy-feed-variants.json";
import { catalog } from "../lib/affiliate/catalog";
import { productFeedIdentity, pricesBySkuFromSnapshots, type SupplierPriceSnapshot } from "../lib/affiliate/pricing";
import { discoverEquipment, supplierEntryPaths } from "../lib/marketplace/supplier-discovery";
import { comparableSelection } from "../lib/marketplace/comparison";
import { stationRecommendations } from "../lib/marketplace/selection-guidance";
import { estimateSystem } from "../lib/marketplace/recommendation";

test("every official Renogy SKU is discoverable exactly once in general search", () => {
  assert.equal(feed.products.length, 365);
  for (const entry of feed.products) {
    const result = discoverEquipment(catalog, { q: entry.sku });
    assert.equal(result.length, 1, entry.sku);
    assert.equal(result[0].type === "reviewed" ? productFeedIdentity(result[0].product)?.merchantSku : result[0].entry.sku, entry.sku);
  }
});
test("reviewed exact variants are deduplicated without collapsing other variants", () => {
  const result = discoverEquipment(catalog, { q: "core mini" });
  const skus = result.map(item => item.type === "reviewed" ? productFeedIdentity(item.product)?.merchantSku : item.entry.sku).filter(Boolean);
  assert.equal(new Set(skus).size, skus.length);
  assert.ok(result.some(item => item.type === "reviewed"));
  assert.ok(result.some(item => item.type === "supplier"));
});
test("technical filters never infer feed specifications; source and region remain exact", () => {
  assert.ok(discoverEquipment(catalog, { capacityAh: "100" }).every(item => item.type === "reviewed"));
  assert.ok(discoverEquipment(catalog, { brand: "Waterdrop" }).every(item => item.type === "reviewed" && item.product.category === "water"));
  assert.ok(discoverEquipment(catalog, { kind: "equipment-class" }).every(item => item.type === "reviewed" && item.product.kind === "equipment-class"));
  for (const item of discoverEquipment(catalog, { kind: "supplier-entry" })) {
    assert.equal(item.type, "supplier");
    if (item.type === "supplier") assert.equal(new URL(item.entry.url).origin, "https://eu.renogy.com");
  }
});
test("feed classification distinguishes accessories and services from equipment", () => {
  for (const entry of feed.products.filter(p => /worry-free|shippingcharge|price-difference/.test(p.url))) assert.deepEqual(supplierEntryPaths(entry), []);
  const bluetoothEntry = feed.products.find(p => p.name.endsWith(" - Bluetooth Module"))!;
  assert.deepEqual(supplierEntryPaths(bluetoothEntry), ["electrical-components"]);
  const panels = discoverEquipment(catalog, { kind: "supplier-entry" }, "/marketplace/solar/panels");
  assert.ok(panels.length > 0);
  assert.ok(panels.every(item => item.type === "supplier" && supplierEntryPaths(item.entry).includes("solar/panels")));
});
test("comparison rejects mixed roles and guides, keeps 2-4 exact models", () => {
  assert.equal(comparableSelection("renogy-mini-100,renogy-panel-200", catalog).invalid, true);
  assert.equal(comparableSelection("battery-lfp-100,renogy-mini-100", catalog).invalid, true);
  assert.equal(comparableSelection("renogy-mini-100,renogy-mini-200", catalog).selected.length, 2);
});
test("finder best match is smallest adequate capacity, reserve is factual, unknowns rejected", () => {
  const requirement = estimateSystem(200, 300, 4)!;
  const results = stationRecommendations(catalog, "EU", requirement);
  assert.equal(results[0].role, "best");
  assert.ok(results.some(item => item.role === "reserve"));
  for (const item of results) {
    assert.ok(item.reserveWh >= 0 && item.powerReserveW >= 0);
    assert.equal(item.reserveWh, Math.round(Number(item.product.facets.capacityWh) - requirement.batteryWh));
    assert.ok(Number(item.product.facets.power) >= requirement.surgeW);
  }
  assert.deepEqual(stationRecommendations(catalog, "US", requirement), []);
  assert.deepEqual(stationRecommendations(catalog.map(p => ({ ...p, facets: {} })), "EU", requirement), []);
});
test("price snapshots reject malformed and duplicate rows, newest invalid values do not resurrect old prices", () => {
  const now = Date.parse("2026-10-26T12:00:00Z");
  const snapshot: SupplierPriceSnapshot = { provider: "renogy", catalogId: "28907", retrievedAt: "2026-10-26T11:00:00Z", records: [{ merchantSku: "123", amount: 50, currency: "EUR" }] };
  const newer = { ...snapshot, retrievedAt: "2026-10-26T12:00:00Z", records: [{ merchantSku: "123", amount: NaN, currency: "EUR" }] };
  assert.deepEqual(pricesBySkuFromSnapshots([snapshot, newer], "renogy", now), {});
  assert.deepEqual(pricesBySkuFromSnapshots([snapshot, snapshot], "renogy", now), {});
  assert.deepEqual(pricesBySkuFromSnapshots([null, { ...snapshot, records: [null] }] as unknown as SupplierPriceSnapshot[], "renogy", now), {});
  assert.deepEqual(pricesBySkuFromSnapshots([snapshot], "waterdrop-eu", now), {});
  for (const amount of [1.234, 0, -1, Infinity, Number.MAX_VALUE]) {
    assert.deepEqual(pricesBySkuFromSnapshots([{ ...snapshot, records: [{ merchantSku: "123", amount, currency: "EUR" }] }], "renogy", now), {});
  }
});

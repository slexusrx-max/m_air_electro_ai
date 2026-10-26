import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "../lib/affiliate/catalog";
import {
  isFreshPriceTimestamp,
  pricesFromSnapshots,
  productFeedIdentity,
  type SupplierPriceSnapshot,
} from "../lib/affiliate/pricing";

const now = Date.parse("2026-10-26T12:00:00.000Z");
const freshAt = "2026-10-26T11:00:00.000Z";

function snapshot(overrides: Partial<SupplierPriceSnapshot> = {}): SupplierPriceSnapshot {
  return {
    provider: "renogy",
    catalogId: "28907",
    retrievedAt: freshAt,
    records: [{ merchantSku: "46545423761665", amount: 314.99, currency: "EUR" }],
    ...overrides,
  };
}

test("maps a fresh official-feed price only to the exact catalog variant", () => {
  const prices = pricesFromSnapshots(catalog, [snapshot()], now);
  assert.deepEqual(prices["renogy-mini-100"], {
    amount: 314.99,
    currency: "EUR",
    provider: "renogy",
    merchantSku: "46545423761665",
    retrievedAt: freshAt,
  });
  assert.equal(prices["renogy-mini-200"], undefined);
});

test("fails closed for stale, ambiguous, invalid-currency or wrong-catalog prices", () => {
  assert.deepEqual(pricesFromSnapshots(catalog, [snapshot({ retrievedAt: "2026-10-23T11:00:00.000Z" })], now), {});
  assert.deepEqual(pricesFromSnapshots(catalog, [snapshot({ catalogId: "wrong" })], now), {});
  assert.deepEqual(pricesFromSnapshots(catalog, [snapshot({ records: [
    { merchantSku: "46545423761665", amount: 314.99, currency: "EUR" },
    { merchantSku: "46545423761665", amount: 299, currency: "EUR" },
  ] })], now), {});
  assert.deepEqual(pricesFromSnapshots(catalog, [snapshot({ records: [
    { merchantSku: "46545423761665", amount: 314.99, currency: "USD" },
  ] })], now), {});
});

test("retains ordinary supplier fallback where no approved exact feed identity exists", () => {
  const pecron = catalog.find(product => product.id === "pecron-e1500lfp")!;
  const waterdrop = catalog.find(product => product.id === "waterdrop-g3p600")!;
  assert.equal(productFeedIdentity(pecron), null);
  assert.deepEqual(productFeedIdentity(waterdrop), {
    provider: "waterdrop-eu",
    merchantSku: "45120409829692",
  });
});

test("every cataloged Renogy and Waterdrop model has an exact documented feed identity", () => {
  const eligible = catalog.filter(product => product.provider === "renogy" || product.provider === "waterdrop-eu");
  assert.equal(eligible.length, 22);
  assert.deepEqual(eligible.filter(product => !productFeedIdentity(product)).map(product => product.id), []);
  assert.equal(new Set(eligible.map(product => productFeedIdentity(product)!.merchantSku)).size, eligible.length);
});

test("price freshness allows 48 hours, rejects future and invalid timestamps", () => {
  assert.equal(isFreshPriceTimestamp("2026-10-24T12:00:00.000Z", now), true);
  assert.equal(isFreshPriceTimestamp("2026-10-24T11:59:59.999Z", now), false);
  assert.equal(isFreshPriceTimestamp("2026-10-26T12:06:00.000Z", now), false);
  assert.equal(isFreshPriceTimestamp("not-a-date", now), false);
});

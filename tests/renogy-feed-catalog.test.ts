import test from "node:test";
import assert from "node:assert/strict";
import { renogyFeedProducts } from "../data/renogy-extra-feed-products";
import evidence from "./fixtures/renogy-extra-feed-evidence.json";
import { catalog } from "../lib/affiliate/catalog";
import { publicRoutes } from "../lib/marketplace/routes";
import { localizedPath, isLocalizedPublicPath } from "../lib/i18n/routing";
import variants from "../data/renogy-feed-variants.json";

test("full feed identity index retains all 365 exact SKU rows without prices or tracking URLs", () => {
  assert.equal(variants.catalogId, "28907");
  assert.equal(variants.products.length, 365);
  assert.equal(variants.products.filter(p => p.imageUrl).length, 364);
  assert.equal(new Set(variants.products.map(product => product.sku)).size, 365);
  assert.equal(new Set(variants.products.map(product => product.name)).size, 365);
  assert.equal(new Set(variants.products.map(product => product.url)).size, 101);
  for (const product of variants.products) {
    assert.match(product.sku, /^\d+$/);
    assert.ok(product.name);
    if (product.imageUrl) {
      const image = new URL(product.imageUrl);
      assert.equal(image.protocol, "https:");
      assert.ok(["cdn.shopify.com", "eu.renogy.com"].includes(image.hostname), image.hostname);
    } else {
      assert.equal(product.sku, "50175394414849", "Only the CSV promotion row has no supplied image");
    }
    assert.equal(new URL(product.url).origin, "https://eu.renogy.com");
    assert.doesNotMatch(product.url, /sjv\.io|prodsku|intsrc/i);
    assert.deepEqual(Object.keys(product).sort(), ["imageUrl", "kind", "name", "parentSku", "sku", "url"]);
  }
});

test("feed index retains distinct ordinary EU parent pages outside the reviewed selection", () => {
  const existing = new Set(catalog.filter(p => p.provider === "renogy").map(p => new URL(p.productUrl).pathname));
  assert.equal(existing.size, 19);
  assert.equal(renogyFeedProducts.length, 72);
  assert.equal(new Set(renogyFeedProducts.map(p => p.url)).size, renogyFeedProducts.length);
  for (const p of renogyFeedProducts) {
    const url = new URL(p.url);
    assert.equal(url.origin, "https://eu.renogy.com");
    assert.match(url.pathname, /^\/products\/[a-z0-9-]+$/);
    assert.equal(url.search, "");
    assert.equal(existing.has(url.pathname), false);
    assert.ok(Number.isInteger(p.skuCount) && p.skuCount > 0);
    const source = evidence.products.find(row => row.url === p.url)!;
    assert.ok(source, p.url);
    assert.equal(p.skuCount, source.skuIds.length);
    assert.equal(new Set(source.skuIds).size, source.skuIds.length);
    assert.equal(p.name, source.sourceName.replace(/^(Member Price\s+|Special offer\s+)/, ""));
    assert.doesNotMatch(p.name, /member price|special offer|shippingcharge|price difference|worry.free purchase/i);
    assert.deepEqual(Object.keys(p).sort(), ["category", "name", "skuCount", "url"]);
  }
});

test("kits, chargers, mounting parts and power stations have the correct equipment family", () => {
  for (const p of renogyFeedProducts) {
    if (/starter kit|premium kit|marine kit|bundle kits|power system|energy system|solution kit/i.test(p.name)) assert.equal(p.category, "Systems and kits", p.name);
    if (/DC.to.DC|AC to DC/i.test(p.name) && !/system/i.test(p.name)) assert.equal(p.category, "Chargers", p.name);
    if (/adaptor kit|mount|bracket|cable|connectors|shunt|pole mount/i.test(p.name)) {
      if (!/Flush Mount|Power Station/i.test(p.name)) assert.equal(p.category, "Components", p.name);
    }
    if (/Portable Power Station/i.test(p.name)) assert.equal(p.category, "Power stations");
  }
});

test("extended catalog participates in reciprocal localized routing and sitemap inventory", () => {
  assert.ok(publicRoutes.includes("/renogy/catalog"));
  assert.ok(isLocalizedPublicPath("/en/renogy/catalog"));
  assert.equal(localizedPath("/renogy/catalog", "en"), "/en/renogy/catalog");
  assert.equal(localizedPath("/en/renogy/catalog", "ro"), "/renogy/catalog");
});

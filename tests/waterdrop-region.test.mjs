import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "./helpers.mjs";

test("Waterdrop Germany affiliate CTAs stay disabled for the Romania/EU site", () => {
  const { SupplierLinksProvider, SupplierLink } = load("components/marketplace/supplier-link.tsx");
  for (const ro of [true, false]) for (const tracked of [true, false]) {
    const product = { id: "water-model", provider: "waterdrop-eu", category: "water", productUrl: "https://www.waterdropfilter.de/en/products/example" };
    const href = tracked ? "https://dewaterdropfilter.pxf.io/issued" : product.productUrl;
    const html = renderToStaticMarkup(createElement(SupplierLinksProvider, { links: { "water-model": { href, tracked } }, prices: {} }, createElement(SupplierLink, { product, ro })));
    assert.ok(!html.includes("href="));
    assert.ok(!html.includes("sponsored"));
    assert.ok(html.includes('data-market-status="blocked-romania"'));
    assert.ok(html.includes('data-tracking-status="disabled"'));
    assert.ok(html.includes(ro ? "nu este disponibilă pentru România" : "unavailable for Romania"));
  }
});

test("eligible supplier links keep their normal tracking semantics", () => {
  const { SupplierLinksProvider, SupplierLink } = load("components/marketplace/supplier-link.tsx");
  const product = { id: "renogy-model", provider: "renogy", category: "solar", productUrl: "https://eu.renogy.com/products/example" };
  const href = "https://renogy.sjv.io/issued";
  const html = renderToStaticMarkup(createElement(SupplierLinksProvider, { links: { "renogy-model": { href, tracked: true } }, prices: {} }, createElement(SupplierLink, { product, ro: true })));
  assert.ok(html.includes(`href="${href}"`));
  assert.ok(html.includes("sponsored"));
  assert.ok(!html.includes("blocked-romania"));
});

import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "./helpers.mjs";

test("merchant price CTA ignores even a supplied fresh price and preserves affiliate href", () => {
  const { SupplierLinksProvider, SupplierPrice } = load("components/marketplace/supplier-link.tsx");
  const product = { id: "test-model", provider: "renogy", category: "solar", merchant: "Renogy EU", productUrl: "https://eu.renogy.com/products/example" };
  for (const ro of [true, false]) {
    const html = renderToStaticMarkup(createElement(SupplierLinksProvider, {
      links: { "test-model": { href: "https://renogy.sjv.io/issued", tracked: true } },
      prices: { "test-model": { amount: 9876.54, currency: "EUR", retrievedAt: "2026-10-27T12:00:00Z", merchantSku: "123", provider: "renogy" } },
    }, createElement(SupplierPrice, { product, ro, prominent: true })));
    assert.ok(html.includes("https://renogy.sjv.io/issued"));
    assert.ok(html.includes('data-tracking-status="active"'));
    assert.ok(html.includes(ro ? "Vezi prețul actual" : "See current price"));
    assert.ok(!html.includes("9876") && !html.includes("€") && !html.includes("EUR"));
  }
});

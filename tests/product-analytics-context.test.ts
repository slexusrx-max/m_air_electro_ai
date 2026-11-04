import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "@/lib/affiliate/catalog";
import { productAnalyticsContext } from "@/lib/marketplace/product-analytics";

test("known feed SKU identifies the selected variant without claiming an MPN or price", () => {
  const panel = catalog.find(product => product.id === "renogy-panel-200")!;
  const context = productAnalyticsContext(panel);
  assert.deepEqual(context, { kind: "product", supplier: "renogy", category: "solar-panels", brand: "Renogy", sku: "46435567796481" });
  assert.equal("price" in context, false);
  assert.equal("mpn" in context, false);
  assert.equal("productUrl" in context, false);
});

test("models without an established feed identity retain their brand and omit SKU", () => {
  const models = catalog.filter(product => product.kind === "product" && ["PECRON", "BLUETTI"].includes(product.brand));
  assert.ok(models.length > 0);
  for (const product of models) {
    const context = productAnalyticsContext(product);
    assert.equal(context.brand, product.brand);
    assert.equal(Object.hasOwn(context, "sku"), false, product.id);
  }
});

test("equipment classes cannot acquire a manufacturer brand or SKU from a model identity", () => {
  const classes = catalog.filter(product => product.kind === "equipment-class");
  assert.ok(classes.length > 0);
  for (const product of classes) {
    const context = productAnalyticsContext(product);
    assert.equal(context.kind, "equipment-class");
    assert.equal(Object.hasOwn(context, "brand"), false, product.id);
    assert.equal(Object.hasOwn(context, "sku"), false, product.id);
  }
});

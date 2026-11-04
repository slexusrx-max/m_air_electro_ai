import { test } from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../lib/affiliate/catalog";
import { cardSpecifications } from "../lib/marketplace/card-specifications";

test("battery cards distinguish voltage, capacity and stored energy using exact documented values", () => {
  const product = catalog.find(item => item.id === "renogy-mini-100")!;
  assert.deepEqual(cardSpecifications(product), [
    ["Nominal voltage", "12.8 V"], ["Capacity", "100 Ah"], ["Stored energy", "1280 Wh (12.8 V × 100 Ah)"],
  ]);
});

test("limited records stay limited, with no energy or voltage inferred from the title", () => {
  const duoHeat = catalog.find(item => item.id === "renogy-duoheat-core-mini-100ah")!;
  assert.deepEqual(cardSpecifications(duoHeat), [["Capacity", "100 Ah"], ["Continuous discharge", "100 A"], ["Weight", "9.7 kg"]]);
  const expansion = catalog.find(item => item.id === "pecron-ep3800-48v")!;
  assert.deepEqual(cardSpecifications(expansion), [["Stored energy", "3840 Wh"]]);
});

test("water cards show technology and installation, not SKU identifiers as technical performance", () => {
  const product = catalog.find(item => item.id === "waterdrop-a1")!;
  assert.ok(product);
  assert.deepEqual(cardSpecifications(product).map(([key]) => key), ["Technology", "Installation"]);
});

test("card specifications preserve source values and exclude identifiers throughout the catalog", () => {
  for (const product of catalog) {
    const shown = cardSpecifications(product);
    assert.ok(shown.length <= 3);
    for (const [key, value] of shown) {
      assert.equal(value, product.technicalSpecs[key]);
      assert.ok(!["SKU", "Feed SKU", "Variant ID"].includes(key));
    }
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { supplierOutcome, validSupplierUrl } from "../scripts/audit-suppliers";

const euModel = "https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery";

test("supplier audit rejects malformed, non-EU and tracking URLs", () => {
  assert.equal(validSupplierUrl(euModel), true);
  for (const href of [
    "not a URL",
    euModel.replace("https:", "http:"),
    euModel.replace("eu.renogy.com", "www.renogy.com"),
    euModel.replace("eu.renogy.com", "eu.renogy.com.example.com"),
    euModel.replace("https://", "https://user:password@"),
    `${euModel}?affiliate=unapproved`,
    "https://eu.renogy.com/",
    `https://eu.renogy.com/${euModel}`,
    "https://eu.renogy.com/products/https%3A%2F%2Fexample.com",
  ]) assert.equal(validSupplierUrl(href), false, href);
});

test("supplier audit separates merchant access blocks from link defects", () => {
  assert.equal(supplierOutcome(200, euModel), "reachable");
  for (const status of [401, 403, 429])
    assert.equal(supplierOutcome(status, euModel), "automated-access-blocked");
  for (const status of [404, 410, 500])
    assert.equal(supplierOutcome(status, euModel), "http-needs-review");
  assert.equal(supplierOutcome(200, euModel.replace("eu.renogy.com", "www.renogy.com")), "destination-needs-review");
  assert.equal(supplierOutcome(200, "https://eu.renogy.com/"), "destination-needs-review");
});

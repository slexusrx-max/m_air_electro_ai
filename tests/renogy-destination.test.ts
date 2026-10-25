import test from "node:test";
import assert from "node:assert/strict";
import { verifiedImpactLinks } from "../lib/affiliate/renogy-policy";

test("explicit deep links preserve exact product variants and reject ambiguous destinations", () => {
  const source = "https://eu.renogy.com/products/example?variant=123";
  const base = "https://tracking.example/issued";
  const origins = JSON.stringify(["https://tracking.example"]);
  const exact = `${base}?u=${encodeURIComponent(source)}`;
  assert.deepEqual(verifiedImpactLinks({ [source]: exact }, origins), { [source]: exact });
  for (const target of [
    `${base}?u=${encodeURIComponent(source.replace("123", "456"))}`,
    `${base}?u=${encodeURIComponent(source.split("?")[0])}`,
    `${exact}&u=${encodeURIComponent(source)}`,
    `${base}?u=`,
  ]) assert.deepEqual(verifiedImpactLinks({ [source]: target }, origins), {});
  assert.deepEqual(verifiedImpactLinks({ [source]: base }, origins), { [source]: base });
});

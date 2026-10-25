import test from "node:test";
import assert from "node:assert/strict";
import { renogyParentLinks } from "../lib/affiliate/renogy-parent-links";
import { verifiedImpactLinks } from "../lib/affiliate/renogy-policy";
import { configuredSupplierLink } from "../lib/affiliate/configuration";

test("72 parent mappings preserve exact allowlisted destinations without choosing a SKU", () => {
  assert.equal(Object.keys(renogyParentLinks).length, 72);
  for (const [source, target] of Object.entries(renogyParentLinks)) {
    const url = new URL(target);
    assert.equal(url.pathname, "/c/7767803/3394229/14864");
    assert.equal(url.searchParams.get("u"), source);
    assert.deepEqual([...url.searchParams.keys()], ["u"]);
    const config = { provider: "renogy", network: "impact", programId: "14864", approved: true, affiliateDisclosureRequired: true, trackingEnabled: true, links: verifiedImpactLinks(renogyParentLinks, '["https://renogy.sjv.io"]') };
    assert.equal(configuredSupplierLink(config, source).href, target);
    assert.equal(configuredSupplierLink({ ...config, trackingEnabled: false }, source).tracked, false);
    assert.equal(configuredSupplierLink({ ...config, links: verifiedImpactLinks(renogyParentLinks, undefined) }, source).tracked, false);
    assert.equal(configuredSupplierLink(config, source + "?variant=unsupported").tracked, false);
  }
});

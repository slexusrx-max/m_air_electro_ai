import test from "node:test";
import assert from "node:assert/strict";
import reviewed from "../data/waterdrop-reviewed-expansion.json";
import { verifiedWaterdropLinks } from "../lib/affiliate/waterdrop-policy";
import { configuredSupplierLink } from "../lib/affiliate/configuration";

const source = "https://www.waterdropfilter.de/en/products/g3p600-waterdrop-umkehrosmose-wasserfilteranlage";
test("Waterdrop preserves every reviewed feed link and all three issued short formats", () => {
  const links = Object.fromEntries(reviewed.map(row => [row.url, row.issued]));
  assert.deepEqual(verifiedWaterdropLinks(links), links);
  for (const code of ["OYJAjQ", "vDrd7d", "4aYV19"]) {
    const target = `https://dewaterdropfilter.pxf.io/${code}`;
    assert.deepEqual(verifiedWaterdropLinks({ [source]: target }), { [source]: target });
  }
});
test("Waterdrop rejects untrusted origins, ambiguous destinations and undocumented link shapes", () => {
  const issued = reviewed[0].issued;
  for (const target of [
    "javascript:alert(1)", "https://example.org/OYJAjQ",
    "https://dewaterdropfilter.pxf.io.example.org/OYJAjQ",
    "https://user@dewaterdropfilter.pxf.io/OYJAjQ", "https://dewaterdropfilter.pxf.io:444/OYJAjQ",
    "http://dewaterdropfilter.pxf.io/OYJAjQ", "https://dewaterdropfilter.pxf.io/OYJAjQ#x",
    "https://dewaterdropfilter.pxf.io/OYJAjQ?u=https://example.org",
    issued, issued + "&u=" + encodeURIComponent(source),
    "https://dewaterdropfilter.pxf.io/c/7767803/2102187/99999?u=" + encodeURIComponent(source),
  ]) {
    const links = verifiedWaterdropLinks({ [source]: target });
    assert.deepEqual(links, {}, target);
    const result = configuredSupplierLink({ provider:"waterdrop-eu", network:"impact", programId:"19363", approved:true, trackingEnabled:true, affiliateDisclosureRequired:true, links }, source);
    assert.equal(result.href, source); assert.equal(result.tracked, false);
  }
  assert.deepEqual(verifiedWaterdropLinks({ "https://example.org/product": "https://dewaterdropfilter.pxf.io/OYJAjQ" }), {});
});

import test from "node:test";
import assert from "node:assert/strict";
import reviewed from "../data/renogy-reviewed-products.json";
import links from "../data/renogy-reviewed-links.json";
import { catalog } from "../lib/affiliate/catalog";
import { productPhoto } from "../lib/marketplace/product-photos";
import { validSupplierUrl } from "../lib/affiliate/suppliers";
import { configuredSupplierLink } from "../lib/affiliate/configuration";
import { verifiedImpactLinks } from "../lib/affiliate/renogy-policy";
import { stationCandidates, batteryCandidates } from "../lib/marketplace/selection-guidance";

test("reviewed exact variants have distinct photos, permitted URLs and publisher-preserving deep links", () => {
  assert.equal(reviewed.length, 12);
  assert.equal(new Set(reviewed.map(r => r.variantId)).size, 12);
  assert.equal(new Set(reviewed.map(r => r.imageSha256)).size, 12);
  assert.equal(new Set(reviewed.map(r => new URL(r.url).pathname)).size, 12);
  for (const r of reviewed) {
    const p = catalog.find(p => p.id === r.id)!;
    assert.equal(p.productUrl, r.url);
    assert.equal(p.technicalSpecs.SKU, r.manufacturerSku);
    assert.equal(validSupplierUrl(r.url, "renogy"), true);
    assert.equal(validSupplierUrl(r.url.replace(r.variantId, "99999999999999"), "renogy"), false);
    assert.equal(validSupplierUrl(r.url + "&ref=unknown", "renogy"), false);
    const photo = productPhoto(p)!;
    assert.equal(photo.src, r.imageUrl);
    assert.equal(new URL(photo.src).hostname, "cdn.shopify.com");
    assert.ok(photo.width > 300 && photo.height > 300);
    const tracking = new URL(links[r.url as keyof typeof links]);
    assert.equal(tracking.origin, "https://renogy.sjv.io");
    assert.equal(tracking.pathname, "/c/7767803/3394229/14864");
    assert.equal(tracking.searchParams.get("u"), r.url);
    assert.equal(p.price, null);
    assert.equal(p.originalPrice, null);
    assert.equal(p.availability, "partner-check");
    assert.doesNotMatch(p.name, /shipping charge|price difference|worry.free purchase|ireland|bulk buy/i);
  }
});

test("new reviewed tracking links still require origin verification and activation", () => {
  const source = reviewed[0].url;
  const origins = '["https://renogy.sjv.io"]';
  assert.deepEqual(verifiedImpactLinks(links, undefined), {});
  assert.deepEqual(verifiedImpactLinks(links, '["https://other.example"]'), {});
  const config = { provider: "renogy", network: "impact", programId: "14864",
    approved: true, trackingEnabled: false, affiliateDisclosureRequired: true,
    links: verifiedImpactLinks(links, origins) };
  assert.equal(configuredSupplierLink(config, source).href, source);
  config.trackingEnabled = true;
  assert.equal(configuredSupplierLink(config, source).href, links[source as keyof typeof links]);
  assert.equal(configuredSupplierLink(config, "https://eu.renogy.com/products/unreviewed").tracked, false);
  config.approved = false;
  assert.equal(configuredSupplierLink(config, source).tracked, false);
});

test("pack quantities, controller limits and energy stay explicit; kits never become complete stations", () => {
  const get = (id: string) => catalog.find(p => p.id === id)!;
  assert.equal(get("renogy-shadowflux-200w-2pack").technicalSpecs["Panel count"], "2");
  assert.equal(get("renogy-shadowflux-200w-2pack").facets.power, "400");
  assert.equal(get("renogy-rover-2-20a").technicalSpecs["PV power limit"], "300 W / 12 V; 600 W / 24 V");
  assert.match(productPhoto(get("renogy-rover-2-20a"))!.src, /Rover2_20A\.webp/);
  assert.equal(get("renogy-backup-400w-pro-200ah-2000w").facets.capacityWh, "2560");
  assert.equal(get("renogy-backup-800w-300ah-2000w").facets.capacityWh, "3840");
  assert.equal(get("renogy-duoheat-core-mini-100ah").facets.capacityWh, undefined);
  assert.ok(batteryCandidates(catalog, 1000, 12).every(p => p.category === "lithium-batteries"));
  assert.ok(stationCandidates(catalog, "EU", { batteryWh: 500, loadWh: 300, inverterW: 100, surgeW: 200 })
    .every(p => p.category === "backup-power" && p.provider !== "renogy"));
});

import test from "node:test";
import assert from "node:assert/strict";
import issued from "../data/renogy-issued-solar-links-2026-11-04.json";
import feed from "../data/renogy-feed-variants.json";
import reviewed from "../data/renogy-reviewed-products.json";
import { validSupplierUrl } from "../lib/affiliate/suppliers";
import { configuredSupplierLink } from "../lib/affiliate/configuration";
import { verifiedImpactLinks } from "../lib/affiliate/renogy-policy";

const expectedIssued = {
  "8827104461057": "6k6EV3", "46674258985217": "qWKyVO",
  "46674259017985": "en0NaZ", "46674264785153": "en0Na6",
  "8827108622593": "3kKERy", "49259071308033": "qWKy0q",
  "46435561603329": "PzQbAM", "46948494967041": "oNKOPe",
  "49394288787713": "zzK4Xx", "49394288820481": "WOeNJO",
  "8865886470401": "0G6PXY", "46563072180481": "E06yG9",
};

test("twelve authenticated Impact links bind the exact feed identity and merchant selection", () => {
  assert.equal(issued.length, 12);
  assert.equal(issued.filter(link => link.kind === "parent").length, 3);
  assert.equal(issued.filter(link => link.kind === "variant").length, 9);
  assert.equal(new Set(issued.map(link => link.source)).size, 12);
  assert.equal(new Set(issued.map(link => link.href)).size, 12);
  for (const link of issued) {
    const entry = feed.products.find(entry => entry.sku === link.feedSku)!;
    assert.ok(entry, link.feedSku);
    assert.equal(link.kind, entry.kind);
    assert.equal(link.programId, "14864");
    assert.match(link.generatedAt, /^2026-11-04T/);
    const source = new URL(link.source);
    assert.equal(source.origin + source.pathname, entry.url);
    assert.equal(source.search, entry.kind === "variant" ? `?variant=${entry.sku}` : "");
    assert.equal(link.href, `https://renogy.sjv.io/${expectedIssued[link.feedSku as keyof typeof expectedIssued]}`);
    assert.equal(validSupplierUrl(link.source, "renogy"), true);
    if (link.kind === "variant") assert.match(link.merchantSku!, /-EU$/);
    else assert.equal(link.merchantSku, null);
  }
});

test("new variant permission is exact and does not accept another SKU, tracking query or parent ID", () => {
  for (const link of issued) {
    assert.equal(validSupplierUrl(link.source + (link.source.includes("?") ? "&" : "?") + "ref=unreviewed", "renogy"), false);
    if (link.kind === "variant") {
      assert.equal(validSupplierUrl(link.source.replace(link.feedSku, "99999999999999"), "renogy"), false);
      assert.equal(validSupplierUrl(link.source + `&variant=${link.feedSku}`, "renogy"), false);
    } else assert.equal(validSupplierUrl(`${link.source}?variant=${link.feedSku}`, "renogy"), false);
  }
  for (const link of reviewed) assert.equal(validSupplierUrl(link.url, "renogy"), true);
});

test("issued short links remain behind approval, tracking, disclosure and exact-origin gates", () => {
  const links = Object.fromEntries(issued.map(link => [link.source, link.href]));
  const verified = verifiedImpactLinks(links, '["https://renogy.sjv.io"]');
  assert.equal(Object.keys(verified).length, 12);
  const configuration = { provider: "renogy", network: "impact", programId: "14864",
    approved: true, trackingEnabled: true, affiliateDisclosureRequired: true, links: verified };
  for (const link of issued) {
    assert.equal(configuredSupplierLink(configuration, link.source).href, link.href);
    for (const overrides of [{ approved: false }, { trackingEnabled: false }, { affiliateDisclosureRequired: false },
      { links: verifiedImpactLinks(links, undefined) }, { links: verifiedImpactLinks(links, '["https://unverified.example"]') }]) {
      const ordinary = configuredSupplierLink({ ...configuration, ...overrides }, link.source);
      assert.equal(ordinary.href, link.source);
      assert.equal(ordinary.tracked, false);
    }
  }
});

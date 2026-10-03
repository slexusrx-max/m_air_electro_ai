import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

const configuration = load("lib/affiliate/configuration.ts", { "./tracking": load("lib/affiliate/tracking.ts") });
const ordinary = "https://eu.renogy.com/products/example";
const approved = "https://tracking.example/issued-link";
test("configuration preserves ordinary links until approval, tracking and disclosure gates pass", () => {
  const base = { provider: "renogy", network: "impact", programId: null, approved: true, trackingEnabled: true, affiliateDisclosureRequired: true, links: { [ordinary]: approved } };
  for (const gate of ["approved", "trackingEnabled", "affiliateDisclosureRequired"]) {
    const result = configuration.configuredSupplierLink({ ...base, [gate]: false }, ordinary);
    assert.equal(result.href, ordinary);
    assert.equal(result.affiliateUrl, null);
    assert.equal(result.trackingStatus, "ordinary");
  }
  const active = configuration.configuredSupplierLink(base, ordinary);
  assert.equal(active.href, approved);
  assert.equal(active.network, "impact");
  assert.equal(active.programId, null);
  assert.equal(active.approvalStatus, "approved");
  for (const raw of ["null", "[]", "invalid", '{"x":3}']) assert.equal(Object.keys(configuration.parseApprovedLinks(raw)).length, 0);
  assert.equal(configuration.configuredSupplierLink({ ...base, links: Object.create({ [ordinary]: approved }) }, ordinary).tracked, false);
  assert.equal(configuration.configuredSupplierLink({ ...base, links: { [ordinary]: "http://tracking.example" } }, ordinary).tracked, false);
});

function analyticsHarness({ choice = "accepted", dnt = "0", webdriver = false, domain = "mairelectroai.com", path = "/compare" } = {}) {
  const sent = [];
  const api = load("lib/analytics.ts", {}, {
    localStorage: { getItem: () => JSON.stringify({ choice, at: Date.now() }) },
    window: { location: { hostname: "mairelectroai.com", origin: "https://mairelectroai.com", pathname: path } },
    navigator: { doNotTrack: dnt, webdriver },
    process: { env: { NEXT_PUBLIC_PLAUSIBLE_DOMAIN: domain } },
    fetch: (...args) => { sent.push(args); return Promise.resolve(); },
  });
  return { api, sent };
}
const product = { product: "renogy-mini-100", supplier: "renogy", category: "lithium-batteries", language: "ro" };
test("supplier measurement respects consent, DNT, automation, host and private-route exclusions", () => {
  for (const options of [{ choice: "unset" }, { choice: "rejected" }, { dnt: "1" }, { webdriver: true }, { domain: "" }, { domain: "other.example" }, { path: "/account" }]) {
    const { api, sent } = analyticsHarness(options);
    api.trackEvent("supplier_outbound_click", product);
    assert.equal(sent.length, 0);
  }
});
test("supplier events send only public identifiers and source path; invalid data fails closed", () => {
  const { api, sent } = analyticsHarness();
  api.trackEvent("supplier_outbound_click", { ...product, email: "private@example.org" });
  const payload = JSON.parse(sent[0][1].body);
  assert.deepEqual(payload, { name: "supplier_outbound_click", domain: "mairelectroai.com", url: "https://mairelectroai.com/compare", props: { ...product, source_page: "/compare" } });
  assert.equal(sent[0][1].credentials, "omit");
  assert.equal(sent[0][1].referrerPolicy, "no-referrer");
  const props = api.supplierClickProperties(product, "/compare?email=private@example.org#x");
  assert.equal(props.source_page, "/compare");
  api.trackEvent("supplier_outbound_click", { ...product, product: "private@example.org" });
  api.trackEvent("supplier_outbound_click");
  assert.equal(sent.length, 1);
});

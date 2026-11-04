import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

const product = { product: "renogy-mini-100", supplier: "renogy", category: "lithium-batteries", language: "en" };
const events = ["product_view", "product_compare_add", "product_compare_remove", "calculator_start", "calculator_complete", "finder_start", "finder_complete", "affiliate_click", "supplier_outbound"];
function harness(overrides = {}) {
  const sent = [];
  const options = { choice: "accepted", dnt: "0", gpc: false, webdriver: false, path: "/en/marketplace/products/renogy-core-mini-100ah", ...overrides };
  const api = load("lib/analytics.ts", {}, {
    localStorage: { getItem: () => JSON.stringify({ choice: options.choice, at: Date.now() - 1000, provider: "plausible" }) },
    window: { location: { hostname: "mairelectroai.com", origin: "https://mairelectroai.com", pathname: options.path } },
    navigator: { doNotTrack: options.dnt, globalPrivacyControl: options.gpc, webdriver: options.webdriver },
    process: { env: { NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "mairelectroai.com" } },
    fetch: (...args) => { sent.push(args); return Promise.resolve(); },
  });
  return { api, sent };
}

test("all canonical funnel events respect consent, privacy signals, automation and private routes", () => {
  for (const name of events) for (const options of [{ choice: "unset" }, { choice: "rejected" }, { dnt: "1" }, { gpc: true }, { webdriver: true }, { path: "/en/account/projects" }]) {
    const { api, sent } = harness(options);
    assert.equal(api.trackEvent(name, product), false);
    assert.equal(sent.length, 0);
  }
});

test("product events allowlist public context and strip query, fragment and extra input values", () => {
  const path = "/en/marketplace/products/renogy-core-mini-100ah?email=private@example.org#x";
  const { api, sent } = harness({ path });
  for (const name of ["product_view", "product_compare_add", "product_compare_remove", "affiliate_click", "supplier_outbound"]) {
    assert.equal(api.trackEvent(name, { ...product, email: "private@example.org", watts: 250, destination: "https://network.example/private" }), true);
  }
  for (const [, request] of sent) {
    const payload = JSON.parse(request.body);
    assert.equal(payload.url, "https://mairelectroai.com/en/marketplace/products/renogy-core-mini-100ah");
    assert.deepEqual(payload.props, { ...product, source_page: "/en/marketplace/products/renogy-core-mini-100ah" });
    assert.equal(request.credentials, "omit");
    assert.equal(request.referrerPolicy, "no-referrer");
  }
  assert.equal(api.trackEvent("product_view", { ...product, product: "private@example.org" }), false);
  assert.equal(api.trackEvent("product_view", { ...product, category: "https://supplier.example" }), false);
  assert.equal(api.trackEvent("product_compare_add", { product: product.product, language: "en" }), true);
  assert.equal(api.trackEvent("affiliate_click", { product: product.product, language: "en" }), false);
  assert.equal(api.trackEvent("supplier_outbound"), false);
});

test("finder and calculator events send locale and route without entered requirements", () => {
  const { api, sent } = harness({ path: "/en/marketplace/find-my-solution?load=400&budget=500" });
  for (const name of ["finder_start", "finder_complete", "calculator_start", "calculator_complete"]) api.trackEvent(name, { ...product, budget: 500 });
  for (const [, request] of sent) assert.deepEqual(JSON.parse(request.body).props, { language: "en", source_page: "/en/marketplace/find-my-solution" });
});

test("mounted product views can record consent given later without duplicate effects", () => {
  const listeners = new Map();
  const effects = [];
  const sent = [];
  let consented = false;
  const component = load("components/analytics-event.tsx", {
    react: { useEffect: effect => effects.push(effect), useRef: value => ({ current: value }) },
    "@/lib/analytics": { trackEvent: (...args) => { if (!consented) return false; sent.push(args); return true; } },
  }, { window: { addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name) } });
  component.AnalyticsEvent({ name: "product_view", eventKey: product.product, properties: product });
  const cleanup = effects[0]();
  assert.equal(sent.length, 0);
  consented = true;
  listeners.get("mair-analytics-consent")();
  listeners.get("mair-analytics-consent")();
  assert.equal(sent.length, 1);
  assert.equal(sent[0][0], "product_view");
  assert.deepEqual(JSON.parse(JSON.stringify(sent[0][1])), product);
  cleanup();
  assert.equal(listeners.size, 0);
});

test("supplier listener marks only active tracking as affiliate and ignores right-button auxiliary clicks", () => {
  const effects = [], sent = [], listeners = new Map();
  let link;
  class Target { closest() { return link; } }
  const component = load("components/analytics-consent.tsx", {
    react: { useEffect: effect => effects.push(effect), useState: value => [value, () => {}], useRef: value => ({ current: value }) },
    "next/navigation": { usePathname: () => "/en/marketplace" },
    "@/components/localized-link": () => null,
    "@/lib/analytics": { analyticsProvider: () => "plausible", trackEvent: (...args) => sent.push(args) },
  }, {
    Element: Target,
    window: { location: { origin: "https://mairelectroai.com" } },
    document: { addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name) },
  });
  component.AnalyticsConsent({ ro: false });
  const cleanup = effects[2]();
  const dataset = { supplierProduct: product.product, supplier: product.supplier, supplierCategory: product.category, supplierLanguage: "en", trackingStatus: "ordinary" };
  link = { protocol: "https:", origin: "https://eu.renogy.com", dataset };
  listeners.get("click")({ target: new Target(), type: "click", button: 0 });
  assert.deepEqual(sent.map(([name]) => name), ["supplier_outbound"]);
  sent.length = 0;
  dataset.trackingStatus = "active";
  listeners.get("auxclick")({ target: new Target(), type: "auxclick", button: 2 });
  assert.equal(sent.length, 0);
  listeners.get("auxclick")({ target: new Target(), type: "auxclick", button: 1 });
  assert.deepEqual(sent.map(([name]) => name), ["supplier_outbound", "affiliate_click"]);
  cleanup();
  assert.equal(listeners.size, 0);
});

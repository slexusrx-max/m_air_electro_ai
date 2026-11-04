import assert from "node:assert/strict";
import test from "node:test";
import { load } from "./helpers.mjs";

const id = "G-ABCD123456";
function harness({ path = "/", measurementId = id, choice = "accepted", provider = "ga4", origin = "https://mairelectroai.com", scriptFailure = false } = {}) {
  let saved = JSON.stringify({ choice, provider, at: Date.now() - 1000 });
  const scripts = [], requests = [];
  const window = { location: { pathname: path, hostname: new URL(origin).hostname, origin } };
  const navigator = { webdriver: false, doNotTrack: "0", globalPrivacyControl: false };
  const storage = { getItem: () => saved, setItem: (_key, value) => { saved = value; }, removeItem: () => { saved = null; } };
  const env = { NEXT_PUBLIC_GA_MEASUREMENT_ID: measurementId, NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "mairelectroai.com" };
  const api = load("lib/analytics.ts", {}, {
    window, navigator, localStorage: storage, process: { env }, fetch: (...args) => { requests.push(args); return Promise.resolve(); },
    document: { querySelector: () => scripts[0] ?? null, createElement: () => ({ dataset: {} }), head: { appendChild: script => { if (scriptFailure) throw Error("script blocked"); scripts.push(script); } } },
  });
  return { api, window, navigator, scripts, requests, env, storage,
    commands: () => Array.from(window.dataLayer ?? [], command => {
      assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
      return Array.from(command);
    }),
  };
}

test("GA4 has no script or request for missing/invalid ID, missing consent, privacy signals or a non-production origin", () => {
  for (const measurementId of ["", "AW-18541953196", "G-XXXXXXXXXX", "G-0000000000", "G-short", "G-ABCD123456?private=1"]) {
    const h = harness({ measurementId });
    assert.equal(h.api.gaMeasurementId(), null);
    assert.equal(h.api.syncGoogleMeasurement(), false);
    assert.equal(h.scripts.length, 0);
    assert.equal(h.window.dataLayer, undefined);
  }
  for (const options of [{ choice: "unset" }, { choice: "rejected" }, { provider: "plausible" }, { origin: "http://localhost:3100" }, { origin: "https://preview.vercel.app" }]) {
    const h = harness(options);
    assert.equal(h.api.trackEvent("pageview"), false);
    assert.equal(h.scripts.length, 0);
    assert.equal(h.requests.length, 0);
  }
  for (const signal of [{ doNotTrack: "1" }, { globalPrivacyControl: true }, { webdriver: true }]) {
    const h = harness(); Object.assign(h.navigator, signal);
    assert.equal(h.api.trackEvent("pageview"), false);
    assert.equal(h.scripts.length, 0);
  }
});

test("fresh GA4 acceptance loads one analytics-only script/config with no automatic pageview or advertising grant", () => {
  const h = harness({ choice: "unset" });
  assert.equal(h.api.syncGoogleMeasurement(), false);
  assert.equal(h.api.saveAnalyticsConsent("accepted"), "accepted");
  assert.equal(JSON.parse(h.storage.getItem()).provider, "ga4");
  h.api.syncGoogleMeasurement(); h.api.syncGoogleMeasurement();
  const commands = h.commands();
  assert.deepEqual(commands.map(command => command[0]), ["consent", "consent", "js", "config"]);
  assert.equal(commands[3][1], id);
  assert.equal(commands[3][2].send_page_view, false);
  assert.equal(commands[3][2].allow_google_signals, false);
  assert.equal(commands[3][2].allow_ad_personalization_signals, false);
  assert.equal(commands[3][2].cookie_expires, 180 * 86400);
  assert.equal(commands[3][2].cookie_update, false);
  for (const command of commands.filter(command => command[0] === "consent")) for (const field of ["ad_storage", "ad_user_data", "ad_personalization"]) assert.equal(command[2][field], "denied");
  assert.equal(commands[1][2].analytics_storage, "granted");
  assert.equal(h.scripts.length, 1);
  assert.equal(h.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${id}`);
  assert.equal(h.scripts[0].referrerPolicy, "no-referrer");
  assert.ok(!JSON.stringify(commands).includes("AW-"));
});

test("GA4 product mapping sends known public fields only and cannot turn an equipment class into an item or purchase", () => {
  const h = harness({ path: "/en/marketplace/products/renogy-core-mini-100ah?email=private@example.org#saved" });
  const product = { product: "renogy-mini-100", supplier: "renogy", category: "lithium-batteries", language: "en", kind: "product", brand: "Renogy", sku: "RBT100", tracking: "active", email: "private@example.org", price: 500, destination: "https://network.example/private" };
  assert.equal(h.api.trackEvent("product_view", product), true);
  const event = h.commands().find(command => command[0] === "event");
  assert.equal(event[1], "view_item");
  assert.deepEqual(JSON.parse(JSON.stringify(event[2].items)), [{ item_id: "renogy-mini-100", item_brand: "Renogy", item_category: "lithium-batteries", public_sku: "RBT100" }]);
  assert.equal(event[2].page_location, "https://mairelectroai.com/en/marketplace/products/renogy-core-mini-100ah");
  assert.equal(event[2].page_title, "/en/marketplace/products/renogy-core-mini-100ah");
  assert.equal(event[2].page_referrer, "");
  assert.equal(event[2].send_to, id);
  assert.equal(event[2].site_locale, "en");
  assert.equal(event[2].tracking_status, "active");
  assert.ok(!JSON.stringify(h.commands()).match(/private@example|network\.example|"price"|"value"|"currency"/));
  h.api.trackEvent("product_view", { product: "marine-class", supplier: "other", category: "marine-electrical", language: "en", kind: "equipment-class" });
  const classEvent = h.commands().at(-1);
  assert.equal(classEvent[1], "equipment_class_view");
  assert.equal(classEvent[2].items, undefined);
  assert.ok(!h.commands().some(command => command[1] === "purchase"));
  assert.equal(h.requests.length, 0, "GA4 preference must not duplicate into Plausible");
});

test("withdrawal discards pending events, disables the destination and permits only later explicit acceptance", () => {
  const h = harness();
  h.api.trackEvent("pageview"); h.api.trackEvent("calculator_start");
  assert.equal(h.commands().filter(command => command[0] === "event").length, 2);
  assert.equal(h.api.saveAnalyticsConsent("rejected"), "rejected");
  assert.equal(h.api.syncGoogleMeasurement(), false);
  assert.equal(h.window[`ga-disable-${id}`], true);
  assert.equal(h.commands().filter(command => command[0] === "event").length, 0);
  assert.equal(h.commands().at(-1)[2].analytics_storage, "denied");
  assert.equal(h.api.trackEvent("calculator_complete"), false);
  assert.equal(h.api.saveAnalyticsConsent("accepted"), "accepted");
  h.api.syncGoogleMeasurement();
  assert.equal(h.window[`ga-disable-${id}`], false);
  assert.equal(h.scripts.length, 1);
  assert.equal(h.commands().filter(command => command[0] === "config").length, 1);
});

test("private-route navigation revokes collection and public return restores one configured tag", () => {
  for (const path of ["/account", "/en/reset-password", "/ro/dashboard/client", "/auth/callback", "/documents", "/assistant", "/diagnostics", "/energy-ai", "/my-home"]) {
    const h = harness({ path });
    assert.equal(h.api.syncGoogleMeasurement(), false);
    assert.equal(h.scripts.length, 0, path);
  }
  const h = harness(); h.api.trackEvent("pageview");
  h.window.location.pathname = "/account";
  h.api.syncGoogleMeasurement();
  assert.equal(h.window[`ga-disable-${id}`], true);
  assert.equal(h.api.trackEvent("pageview"), false);
  h.window.location.pathname = "/en/experts";
  assert.equal(h.api.trackEvent("pageview"), true);
  assert.equal(h.window[`ga-disable-${id}`], false);
  assert.equal(h.commands().filter(command => command[0] === "config").length, 1);
});

test("v2 acceptance and another provider's acceptance cannot activate GA4", () => {
  const records = new Map([["mair-analytics-consent-v2", JSON.stringify({ choice: "accepted", at: Date.now() })]]);
  const api = load("lib/analytics.ts", {}, { localStorage: { getItem: key => records.get(key) }, process: { env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: id } } });
  assert.equal(api.consentKey, "mair-analytics-consent-v3");
  assert.equal(api.analyticsConsent(), "unset");
  records.set(api.consentKey, JSON.stringify({ choice: "accepted", at: Date.now(), provider: "plausible" }));
  assert.equal(api.analyticsConsent(), "unset");
});

test("acquisition keeps only recognized HTTPS origins and never includes private referrer details", () => {
  const { api } = harness();
  for (const input of ["https://www.google.ro/search?q=private@example.org#private", "https://www.facebook.com/private-user/posts/123?private=1", "https://www.bing.com/search?q=private"]) {
    assert.equal(api.safeAcquisitionReferrer(input), `${new URL(input).origin}/`);
  }
  for (const input of ["https://mairelectroai.com/account?email=private@example.org", "https://evil.example", "https://www.google.ro.evil.example/search", "https://private:password@www.google.ro/search", "https://www.google.ro:8443/search", "http://www.google.ro/search", "not-a-url"]) assert.equal(api.safeAcquisitionReferrer(input), "", input);
});

test("GA4 failures and later privacy signals do not send fallback duplicate events", () => {
  const blocked = harness({ scriptFailure: true });
  assert.equal(blocked.api.trackEvent("pageview"), false);
  assert.equal(blocked.requests.length, 0);
  assert.equal(blocked.commands().filter(command => command[0] === "event").length, 0);
  const h = harness();
  h.api.trackEvent("pageview");
  h.navigator.globalPrivacyControl = true;
  assert.equal(h.api.trackEvent("calculator_complete"), false);
  assert.equal(h.window[`ga-disable-${id}`], true);
  assert.equal(h.requests.length, 0);
});

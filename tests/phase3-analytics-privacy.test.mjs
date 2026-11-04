import assert from "node:assert/strict";
import test from "node:test";
import { load } from "./helpers.mjs";

function harness({ failWrite = false, failRemove = false } = {}) {
  let saved = JSON.stringify({ choice: "accepted", at: Date.now() - 1000 });
  let writeFails = failWrite;
  const sent = [];
  const storage = {
    getItem: () => saved,
    setItem: (_key, value) => { if (writeFails) throw Error("storage unavailable"); saved = value; },
    removeItem: () => { if (failRemove) throw Error("storage unavailable"); saved = null; },
  };
  const globals = {
    localStorage: storage,
    window: { location: { hostname: "mairelectroai.com", origin: "https://mairelectroai.com", pathname: "/marketplace" } },
    navigator: { doNotTrack: "0", globalPrivacyControl: false, webdriver: false },
    process: { env: { NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "mairelectroai.com" } },
    fetch: (...args) => { sent.push(args); return Promise.resolve(); },
  };
  return { api: load("lib/analytics.ts", {}, globals), sent, globals, allowWrites: () => { writeFails = false; }, saved: () => saved };
}

test("failed withdrawal blocks stale readable consent for the whole document", () => {
  const { api, sent, saved, allowWrites } = harness({ failWrite: true, failRemove: true });
  assert.equal(api.analyticsConsent(), "accepted");
  assert.equal(api.trackEvent("pageview"), true);
  assert.equal(api.saveAnalyticsConsent("rejected"), "rejected");
  assert.equal(JSON.parse(saved()).choice, "accepted");
  assert.equal(api.analyticsConsent(), "rejected");
  assert.equal(api.trackEvent("calculator_complete"), false);
  assert.equal(sent.length, 1);
  allowWrites();
  assert.equal(api.saveAnalyticsConsent("accepted"), "accepted");
  assert.equal(api.trackEvent("calculator_start"), true);
  assert.equal(sent.length, 2);
});

test("failed acceptance stays denied and successful stale-consent removal survives reload", () => {
  const first = harness({ failWrite: true, failRemove: true });
  assert.equal(first.api.saveAnalyticsConsent("accepted"), "rejected");
  assert.equal(first.api.trackEvent("pageview"), false);
  const second = harness({ failWrite: true });
  assert.equal(second.api.saveAnalyticsConsent("rejected"), "rejected");
  assert.equal(second.saved(), null);
  const reloaded = load("lib/analytics.ts", {}, second.globals);
  assert.equal(reloaded.analyticsConsent(), "unset");
  assert.equal(reloaded.trackEvent("pageview"), false);
});

test("document, AI and diagnostic workspaces are excluded without blocking public expert guidance", () => {
  const { api, globals, sent } = harness();
  for (const path of ["/documents", "/assistant", "/diagnostics", "/energy-ai", "/my-home", "/expert", "/account"]) {
    for (const prefix of ["", "/en", "/ro"]) {
      globals.window.location.pathname = prefix + path;
      assert.equal(api.isPublicMeasurementPath(prefix + path), false, prefix + path);
      assert.equal(api.trackEvent("pageview"), false, prefix + path);
    }
  }
  assert.equal(sent.length, 0);
  for (const path of ["/experts", "/en/experts", "/marketplace/find-my-solution", "/calculators/generator"]) {
    globals.window.location.pathname = path;
    assert.equal(api.isPublicMeasurementPath(path), true, path);
    assert.equal(api.trackEvent("pageview"), true, path);
  }
  assert.equal(sent.length, 4);
});

test("consent changes do not duplicate pageviews but actual route returns do", () => {
  const effects = [], sent = [];
  const ref = { current: { path: "", sent: false } };
  let choice = "unset", path = "/marketplace", stateIndex = 0;
  const { AnalyticsConsent } = load("components/analytics-consent.tsx", {
    "@/components/localized-link": () => null,
    "next/navigation": { usePathname: () => path },
    react: {
      useState: value => [stateIndex++ === 1 ? choice : value, () => {}],
      useEffect: effect => effects.push(effect), useRef: () => ref,
    },
    "@/lib/analytics": { trackEvent: name => { sent.push(name); return true; } },
  }, { document: { addEventListener() {}, removeEventListener() {} } });
  function render(nextChoice, nextPath = path) {
    choice = nextChoice; path = nextPath; stateIndex = 0; effects.length = 0;
    AnalyticsConsent({ ro: false });
    effects[2]();
  }
  render("unset");
  assert.equal(sent.length, 0);
  render("accepted"); render("accepted"); render("rejected"); render("accepted");
  assert.deepEqual(sent, ["pageview"]);
  render("accepted", "/calculators/generator");
  render("rejected", "/marketplace");
  render("accepted");
  assert.deepEqual(sent, ["pageview", "pageview", "pageview"]);
});

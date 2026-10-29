import assert from "node:assert/strict";
import test from "node:test";
import { load } from "./helpers.mjs";

function harness() {
  let choice = "unset";
  let saved = "unset";
  let stateIndex = 0;
  const effects = [];
  const scripts = [];
  const window = {};
  const navigator = {};
  const { AnalyticsConsent } = load("components/analytics-consent.tsx", {
    "@/components/localized-link": { default: () => null },
    "next/navigation": { usePathname: () => "/" },
    react: {
      useState: () => [stateIndex++ === 1 ? choice : false, () => {}],
      useEffect: (effect) => effects.push(effect),
    },
    "@/lib/analytics": { analyticsConsent: () => saved, trackEvent: () => {}, consentKey: "test" },
  }, {
    window, navigator,
    document: {
      querySelector: () => scripts[0] ?? null,
      createElement: (tag) => { assert.equal(tag, "script"); return { dataset: {} }; },
      head: { appendChild: (script) => scripts.push(script) },
    },
  });
  return {
    window, navigator, scripts,
    run(nextChoice, persisted = nextChoice) {
      choice = nextChoice; saved = persisted; stateIndex = 0; effects.length = 0;
      AnalyticsConsent({ ro: false });
      // Run the actual Google consent effect, without mounting unrelated UI effects.
      effects[1]();
    },
    commands() {
      return Array.from(window.dataLayer ?? [], command => {
        assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
        assert.equal(Array.isArray(command), false);
        return Array.from(command);
      });
    },
  };
}

test("no Google queue or script before persisted explicit consent", () => {
  const h = harness();
  for (const choice of ["unset", "rejected"]) h.run(choice);
  h.run("accepted", "unset");
  assert.equal(h.window.dataLayer, undefined);
  assert.equal(h.scripts.length, 0);
});

test("consent, js and config use the standard Arguments queue in order", () => {
  const h = harness();
  h.run("accepted");
  const commands = h.commands();
  assert.deepEqual(commands.map(c => c.slice(0, 2).map(v => typeof v === "string" ? v : Object.prototype.toString.call(v))), [
    ["consent", "default"], ["consent", "update"], ["js", "[object Date]"], ["config", "AW-18541953196"],
  ]);
  assert.deepEqual({ ...commands[0][2] }, { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
  assert.deepEqual({ ...commands[1][2] }, { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "granted" });
  assert.equal(h.scripts.length, 1);
  assert.equal(h.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=AW-18541953196");
  assert.equal(h.scripts[0].async, true);
  assert.equal(h.scripts[0].dataset.mairGoogleAds, "true");
});

test("repeat acceptance and withdrawal keep one script and one config", () => {
  const h = harness();
  h.run("accepted");
  h.run("accepted"); // Also covers effect replay/remount with an existing tag.
  h.run("rejected");
  let commands = h.commands();
  assert.deepEqual({ ...commands.at(-1)[2] }, { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
  h.run("accepted");
  commands = h.commands();
  assert.equal(commands.at(-1)[2].ad_storage, "granted");
  assert.equal(commands.filter(c => c[0] === "config").length, 1);
  assert.equal(commands.filter(c => c[0] === "js").length, 1);
  assert.equal(commands.length, 7);
  assert.equal(h.scripts.length, 1);
  assert.ok(commands.filter(c => c[0] === "consent").every(c => c[2].ad_personalization === "denied"));
});

test("privacy signals block initial loading; lost stored consent revokes", () => {
  for (const signal of [{ doNotTrack: "1" }, { globalPrivacyControl: true }, { webdriver: true }]) {
    const h = harness();
    Object.assign(h.navigator, signal);
    h.run("accepted");
    assert.equal(h.scripts.length, 0);
    assert.equal(h.window.dataLayer, undefined);
  }
  const h = harness();
  h.run("accepted");
  h.run("accepted", "unset");
  assert.equal(h.commands().at(-1)[2].ad_storage, "denied");
});

import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";
const { calculatePlan, calculateAppliances, requirementsUrl } = load(
  "lib/marketplace/planning.ts",
  {},
  { URLSearchParams },
);
test("planner uses stated efficiency, reserve, surge and solar assumptions", () => {
  const p = calculatePlan({
    load: 500,
    peak: 1000,
    hours: 4,
    solar: true,
    application: "rv",
  });
  assert.ok(Math.abs(p.nominalWh - 2000 / 0.8 / 0.92) < 1e-8);
  assert.equal(p.continuousW, 700);
  assert.equal(p.surgeW, 1100);
  assert.equal(p.solarW, 800);
  assert.ok(p.categories.includes("battery-chargers"));
  for (const load of [NaN, Infinity, 0, -1, 100001])
    assert.throws(() =>
      calculatePlan({
        load,
        peak: 1000,
        hours: 4,
        solar: false,
        application: "home",
      }),
    );
  assert.throws(() =>
    calculatePlan({
      load: 500,
      peak: 400,
      hours: 4,
      solar: false,
      application: "home",
    }),
  );
});
test("appliance energy honours run times, quantity, disabled loads, and global duration", () => {
  const device = {
    id: "a",
    name: "Test",
    watts: 100,
    quantity: 2,
    hours: 2,
    surge: 3,
    enabled: true,
  };
  let p = calculateAppliances(
    [device, { ...device, enabled: false, watts: NaN }],
    8,
    80,
    92,
  );
  assert.equal(p.energyWh, 400);
  assert.equal(p.continuousW, 200);
  assert.equal(p.peakW, 600);
  assert.ok(Math.abs(p.nominalWh - 400 / 0.8 / 0.92) < 1e-8);
  p = calculateAppliances([device], 1, 80, 92);
  assert.equal(p.energyWh, 200);
  for (const quantity of [0, 1.5, NaN, 101])
    assert.throws(() =>
      calculateAppliances([{ ...device, quantity }], 8, 80, 92),
    );
  assert.throws(() => calculateAppliances([], 8, 80, 92));
  assert.throws(() => calculateAppliances([device], 8, 100, 92));
  const url = new URL(
    requirementsUrl(2717.3, 700, 1100),
    "https://example.org",
  );
  assert.equal(url.searchParams.get("batteryKwh"), "2.72");
  assert.equal(url.searchParams.get("region"), "RO");
});
test("tracking is disabled unless enabled with a valid approved HTTPS URL", () => {
  const { resolveSupplierLink } = load("lib/affiliate/tracking.ts");
  const normal = "https://eu.renogy.com/";
  assert.equal(
    resolveSupplierLink(normal, "https://example.org/approved", false).href,
    normal,
  );
  for (const url of [
    "bad",
    "http://example.org",
    "javascript:alert(1)",
    "https://user:pass@example.org",
  ])
    assert.equal(resolveSupplierLink(normal, url, true).tracked, false);
  assert.equal(
    resolveSupplierLink(normal, "https://example.org/approved", true).tracked,
    true,
  );
});
test("Romanian runtime dictionary contains late-added English fallback keys", () => {
  const { getDictionary } = load("lib/i18n/dictionaries.ts");
  const ro = getDictionary("ro");
  for (const key of Object.keys(getDictionary("en")))
    assert.equal(typeof ro[key], "string", key);
  assert.equal(ro.locale, "ro");
});

test("Renogy activation requires both flags and a mapped catalog URL; disclosure follows the links", () => {
  const normal = "https://eu.renogy.com/products/test";
  const env = {
    RENOGY_AFFILIATE_APPROVED: "false",
    AFFILIATE_TRACKING_ENABLED: "false",
    RENOGY_IMPACT_LINKS_JSON: JSON.stringify({
      [normal]: "https://example.org/approved",
    }),
  };
  const api = load(
    "lib/affiliate/providers/renogy.ts",
    {
      "server-only": {},
      "@/lib/affiliate/catalog": {
        catalog: [{ provider: "renogy", productUrl: normal }],
      },
      "@/lib/affiliate/tracking": load("lib/affiliate/tracking.ts"),
    },
    { process: { env } },
  );
  assert.equal(api.affiliateTrackingActive(), false);
  env.RENOGY_AFFILIATE_APPROVED = "true";
  assert.equal(api.affiliateTrackingActive(), false);
  env.AFFILIATE_TRACKING_ENABLED = "true";
  assert.equal(api.affiliateTrackingActive(), true);
  assert.equal(
    api.renogyEu.buildAffiliateUrl(normal),
    "https://example.org/approved",
  );
  for (const value of [
    "null",
    "bad",
    JSON.stringify({ "https://unused.example/": "https://example.org/link" }),
  ]) {
    env.RENOGY_IMPACT_LINKS_JSON = value;
    assert.equal(api.affiliateTrackingActive(), false);
    assert.equal(api.renogyLink(normal).href, normal);
  }
});

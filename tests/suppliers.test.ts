import test from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../lib/affiliate/catalog";
import { suppliers, validSupplierUrl } from "../lib/affiliate/suppliers";
import { pendingSupplierLink } from "../lib/affiliate/providers/pending";
import { filterEquipment, parseComparison } from "../lib/marketplace/query";
import { supplierOutcome } from "../scripts/audit-suppliers";
import { commercialCopy } from "../lib/marketplace/copy";
import { getDictionary } from "../lib/i18n/dictionaries";
import { matchingSystemCandidates } from "../lib/marketplace/recommendation";

const models = [
  ["pecron-e300lfp", "pecron-eu", "288", "600"],
  ["pecron-e500lfp", "pecron-eu", "576", "600"],
  ["pecron-e600lfp", "pecron-eu", "614", "1200"],
  ["pecron-f1000lfp", "pecron-eu", "960", "1500"],
  ["pecron-e3800lfp", "pecron-eu", "3840", "4200"],
  ["bluetti-elite-30-v2", "bluetti-eu", "288", "600"],
  ["bluetti-elite-300", "bluetti-eu", "3014.4", "2400"],
  ["bluetti-elite-400", "bluetti-eu", "3840", "2600"],
  ["pecron-e1500lfp", "pecron-eu", "1536", "2200"],
  ["pecron-e2400lfp", "pecron-eu", "2048", "2400"],
  ["pecron-f3000lfp", "pecron-eu", "3072", "3600"],
  ["bluetti-elite-100-v2", "bluetti-eu", "1024", "1800"],
  ["bluetti-elite-200-v2", "bluetti-eu", "2073.6", "2600"],
  ["bluetti-apex-300", "bluetti-eu", "2764.8", "3840"],
] as const;

test("fourteen EU power stations have explicit supplier identities and source-backed capacity/output", () => {
  for (const [id, provider, wh, watts] of models) {
    const p = catalog.find(p => p.id === id)!;
    assert.ok(p, id);
    assert.equal(p.provider, provider);
    assert.equal(p.merchant, suppliers[provider].name);
    assert.equal(p.brand, suppliers[provider].brand);
    assert.equal(p.merchantRegion, "EU");
    assert.equal(p.facets.capacityWh, wh);
    assert.equal(p.facets.power, watts);
    assert.equal(p.technicalSpecs["Stored energy"], `${wh} Wh`);
    assert.equal(p.technicalSpecs["Rated AC output"], `${watts} W`);
    assert.equal(p.category, "backup-power");
    assert.equal(new URL(p.productUrl).origin, suppliers[provider].origin);
    assert.deepEqual(p.sourceUrls, [p.productUrl]);
    assert.doesNotMatch(JSON.stringify(p), /renogy/i);
  }
});

test("Waterdrop models stay in water families with bounded manufacturer ratings, not certification claims", () => {
  for (const [model, gpd, ratio] of [["g3p600", "600", "2:1"], ["g3p800", "800", "3:1"], ["x12", "1200", "3:1"]]) {
    const p = catalog.find(p => p.id === `waterdrop-${model}`)!;
    assert.ok(p);
    assert.equal(p.provider, "waterdrop-eu");
    assert.equal(p.merchant, "Waterdrop Germany");
    assert.equal(p.brand, "Waterdrop");
    assert.equal(p.category, "water");
    assert.deepEqual(p.paths, ["water", "water/home-purification", "water/reverse-osmosis", "water/under-sink"]);
    assert.equal(p.technicalSpecs["Nominal production"], `${gpd} GPD`);
    assert.equal(p.technicalSpecs["Purified water to drain"], ratio);
    assert.equal(p.waterPerformance, undefined);
    assert.deepEqual(p.sourceUrls, [p.productUrl]);
    assert.equal(new URL(p.productUrl).origin, suppliers["waterdrop-eu"].origin);
  }
});

test("pending suppliers remain ordinary regardless of global or guessed affiliate environment settings", () => {
  const old = process.env.AFFILIATE_TRACKING_ENABLED;
  process.env.AFFILIATE_TRACKING_ENABLED = "true";
  try {
    for (const p of catalog.filter(p => ["pecron-eu", "bluetti-eu"].includes(p.provider))) {
      const link = pendingSupplierLink(p.provider as "pecron-eu" | "bluetti-eu", p.productUrl);
      assert.equal(p.price, null); assert.equal(p.originalPrice, null); assert.equal(p.image, null);
      assert.equal(p.availability, "partner-check");
      assert.equal(p.affiliateUrl, p.productUrl);
      assert.equal(link.href, p.productUrl); assert.equal(link.tracked, false);
      assert.equal(link.approvalStatus, "unconfirmed"); assert.equal(link.affiliateUrl, null);
      assert.equal(link.network, "unconfirmed"); assert.equal(link.programId, null);
      assert.equal(validSupplierUrl(p.productUrl, p.provider), true);
    }
  } finally { if (old === undefined) delete process.env.AFFILIATE_TRACKING_ENABLED; else process.env.AFFILIATE_TRACKING_ENABLED = old; }
});

test("EU URL policy rejects cross-supplier, non-EU variants, tracking, encoded origins and credentials", () => {
  for (const [id, supplier] of Object.entries(suppliers)) {
    const url = `${supplier.origin}/products/example`;
    assert.equal(validSupplierUrl(url, id), true);
    for (const wrong of [
      url.replace("https:", "http:"), `${url}?ref=guessed`, `${url}#affiliate`,
      url.replace("https://", "https://name:secret@"), `${supplier.origin}:444/products/example`,
      `${supplier.origin}/products/https%253A%252F%252Fevil.com`, `${supplier.origin}/${url}`,
      `${url}-uk-plug`, `${url}-ukraine`, `${url}-us`, url.replace("/products/", "/en-us/products/"),
      url.replace("/products/", "/products/%2e%2e/"), `${supplier.origin}/products/example\\tracking`,
    ]) assert.equal(validSupplierUrl(wrong, id), false, wrong);
    for (const other of Object.keys(suppliers).filter(key => key !== id)) {
      assert.equal(validSupplierUrl(url, other), false);
      assert.equal(supplierOutcome(200, url, other), "destination-needs-review");
    }
  }
  for (const origin of ["https://www.pecron.com", "https://www.bluettipower.com", "https://ie.bluettipower.eu", "https://www.waterdropfilter.com", "https://www.waterdropfilter.eu", "https://eu.pecron.com.evil.com"]) assert.equal(validSupplierUrl(`${origin}/products/example`), false);
  assert.throws(() => pendingSupplierLink("pecron-eu", "https://www.bluettipower.eu/products/example"));
});

test("all supplier models are searchable and comparable without assumed prices", () => {
  const added = catalog.filter(p => ["waterdrop-eu", "pecron-eu", "bluetti-eu"].includes(p.provider));
  assert.equal(added.length, 30);
  for (const p of added) {
    assert.ok(filterEquipment(catalog, { q: p.name }).some(result => result.id === p.id), p.name);
    assert.equal(parseComparison(`${p.id},renogy-mini-100`, catalog)[0], p);
  }
  assert.equal(filterEquipment(catalog, { q: "PECRON 1536 Wh" })[0]?.id, "pecron-e1500lfp");
});

test("generic disclosure covers ordinary and activated links without Renogy-only labeling", () => {
  for (const locale of ["ro", "en"] as const) for (const active of ["false", "true"]) {
    const copy = commercialCopy({ ...getDictionary(locale), "affiliate.active": active });
    assert.doesNotMatch(copy.supplierNote, /Renogy/);
    assert.match(copy.supplierNote, locale === "ro" ? /nemarcate/ : /unmarked/);
    assert.match(copy.supplierNote, locale === "ro" ? /activ/ : /activated/);
  }
});

test("new backup stations never qualify by capacity alone or an invented surge rating", () => {
  const station = catalog.find(p => p.id === "bluetti-elite-100-v2")!;
  const requirements = { batteryWh: 500, loadWh: 400, inverterW: 2000, surgeW: 2200 };
  assert.equal(matchingSystemCandidates([station], ["backup-power"], "EU", requirements).length, 0);
  assert.equal(matchingSystemCandidates([station], ["backup-power"], "EU", { ...requirements, inverterW: 1000, surgeW: 2000 }).length, 0);
  assert.equal(matchingSystemCandidates([station], ["backup-power"], "EU", { ...requirements, inverterW: 1000, surgeW: 1500 }).length, 1);
});

test("BLUETTI images match exact base-station sources and never leak to PECRON", async () => {
  const { productPhoto } = await import("../lib/marketplace/product-photos");
  const records = (await import("../data/bluetti-reviewed-photos.json")).default;
  const stations = catalog.filter(p => p.provider === "bluetti-eu");
  assert.equal(stations.length, 6);
  assert.equal(new Set(records.map(r => r.imageUrl)).size, stations.length);
  for (const p of stations) {
    const source = records.find(r => r.id === p.id)!;
    assert.ok(source, p.id);
    assert.equal(source.sourceUrl, p.productUrl);
    assert.equal(new URL(source.imageUrl).hostname, "cdn.shopify.com");
    assert.equal(productPhoto(p)?.src, source.imageUrl);
  }
  for (const p of catalog.filter(p => p.provider === "pecron-eu")) assert.equal(productPhoto(p), undefined);
});

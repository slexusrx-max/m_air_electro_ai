import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect, type Page } from "@playwright/test";
import ts from "typescript";

const fixtureId = "G-TEST000001";
const adapterCode = ts.transpileModule(readFileSync(resolve(process.cwd(), "lib/analytics.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

type MockState = {
  api: {
    saveAnalyticsConsent(choice: "accepted" | "rejected"): string;
    syncGoogleMeasurement(path?: string, choice?: string): void;
    trackEvent(name: string, properties?: Record<string, unknown>): boolean;
  };
  runtimeWindow: { dataLayer?: unknown[]; location: { pathname: string }; [key: string]: unknown };
  runtimeNavigator: { webdriver: boolean; doNotTrack: string; globalPrivacyControl: boolean };
};
type FixtureWindow = Window & { __qaMeasurement: MockState };

async function installFixture(page: Page, baseURL: string, measurementId = fixtureId, referrer = "") {
  const origin = new URL(baseURL).origin;
  const host = new URL(baseURL).hostname;
  test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(host), "Isolated permitted-dispatch mocks run only on a local origin; Production automation is never bypassed.");
  const scripts: string[] = [];
  const unexpectedExternal: string[] = [];
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js") {
      scripts.push(url.href);
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "/* Isolated QA no-op: no Google code or analytics requests. */" });
    }
    if (url.origin === origin) return route.fulfill({
      status: 200, contentType: "text/html",
      body: "<!doctype html><html lang='en'><head><title>Isolated measurement fixture</title></head><body><main>Local-only measurement fixture</main></body></html>",
    });
    unexpectedExternal.push(url.href);
    return route.abort();
  });
  await page.goto(origin + "/__qa_measurement_fixture");
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
  await page.evaluate(({ code, id, referrer }) => {
    Object.defineProperty(document, "referrer", { configurable: true, value: referrer });
    const runtimeWindow = {
      location: {
        protocol: "https:", hostname: "mairelectroai.com", origin: "https://mairelectroai.com",
        pathname: "/marketplace", search: "?email=private-fixture@example.invalid", hash: "#private-fixture",
        href: "https://mairelectroai.com/marketplace?email=private-fixture@example.invalid#private-fixture",
      },
    };
    const runtimeNavigator = { webdriver: false, doNotTrack: "0", globalPrivacyControl: false };
    const compiledModule = { exports: {} };
    // The real browser navigator/location are never changed. Only this isolated
    // compiled module receives mock arguments, and every external request is intercepted.
    const evaluateAdapter = new Function("module", "exports", "window", "document", "navigator", "localStorage", "process", code);
    evaluateAdapter(compiledModule, compiledModule.exports, runtimeWindow, document, runtimeNavigator, localStorage, {
      env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: id },
    });
    (window as unknown as FixtureWindow).__qaMeasurement = { api: compiledModule.exports as MockState["api"], runtimeWindow, runtimeNavigator };
  }, { code: adapterCode, id: measurementId, referrer });
  return { scripts, unexpectedExternal };
}

async function commands(page: Page) {
  return page.evaluate(() => ((window as unknown as FixtureWindow).__qaMeasurement.runtimeWindow.dataLayer ?? []).map(command => Array.from(command as ArrayLike<unknown>)));
}

test("local mocked GA4 consent, navigation, payload minimization and withdrawal", async ({ page, baseURL }) => {
  const observed = await installFixture(page, baseURL!);
  await page.evaluate(() => (window as unknown as FixtureWindow).__qaMeasurement.api.syncGoogleMeasurement());
  await expect(page.locator("script[data-mair-ga4]")).toHaveCount(0);
  expect(observed.scripts).toEqual([]);
  await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.api.saveAnalyticsConsent("accepted");
    fixture.api.syncGoogleMeasurement();
    fixture.api.syncGoogleMeasurement();
  });
  await expect(page.locator("script[data-mair-ga4]")).toHaveCount(1);
  await expect(page.locator("script[data-mair-ga4]")).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect.poll(() => observed.scripts.length).toBe(1);
  const configured = (await commands(page)).filter(command => command[0] === "config");
  expect(configured).toHaveLength(1);
  expect(configured[0][1]).toBe(fixtureId);
  expect(configured[0][2]).toMatchObject({ send_page_view: false });
  expect(JSON.stringify(configured)).not.toContain("AW-");
  expect(JSON.stringify(configured)).not.toMatch(/private-fixture|\?email|#private/);
  const consentCommands = (await commands(page)).filter(command => command[0] === "consent");
  for (const command of consentCommands) expect(command[2]).toMatchObject({ ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  expect(consentCommands.at(-1)![2]).toMatchObject({ analytics_storage: "granted" });

  await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.api.trackEvent("pageview");
    fixture.api.trackEvent("product_view", {
      product: "renogy-mini-100", supplier: "renogy", category: "lithium-batteries", language: "ro", kind: "product",
      email: "private-fixture@example.invalid", budget: 999, destination: "https://merchant.invalid/private-fixture",
    });
    fixture.api.trackEvent("product_compare_add", { product: "renogy-mini-100", language: "ro" });
  });
  const events = (await commands(page)).filter(command => command[0] === "event");
  expect(events.map(command => command[1])).toEqual(["page_view", "view_item", "product_compare_add"]);
  for (const command of events) expect(command[2]).toMatchObject({ send_to: fixtureId });
  const serialized = JSON.stringify(events);
  expect(serialized).not.toMatch(/private-fixture|email=|budget|destination|merchant\.invalid|\?email|#private/);
  expect(serialized).toContain("renogy-mini-100");
  const state = await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.runtimeWindow.location.pathname = "/account/projects";
    fixture.api.syncGoogleMeasurement();
    return { sent: fixture.api.trackEvent("calculator_complete"), disabled: fixture.runtimeWindow["ga-disable-G-TEST000001"] };
  });
  expect(state).toEqual({ sent: false, disabled: true });
  await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.runtimeWindow.location.pathname = "/calculators/generator";
    fixture.api.syncGoogleMeasurement();
  });
  expect((await commands(page)).filter(command => command[0] === "config")).toHaveLength(1);
  expect(observed.scripts).toHaveLength(1);
  const withdrawn = await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.api.saveAnalyticsConsent("rejected");
    fixture.api.syncGoogleMeasurement();
    return { sent: fixture.api.trackEvent("calculator_complete"), disabled: fixture.runtimeWindow["ga-disable-G-TEST000001"] };
  });
  expect(withdrawn).toEqual({ sent: false, disabled: true });
  expect((await commands(page)).filter(command => command[0] === "event")).toHaveLength(0);
  expect((await commands(page)).filter(command => command[0] === "consent").at(-1)![2]).toMatchObject({ analytics_storage: "denied", ad_storage: "denied" });
  expect(observed.unexpectedExternal).toEqual([]);
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
});

for (const signal of ["dnt", "gpc", "automation"] as const) test(`local mocked ${signal} blocks GA4 initialization and events`, async ({ page, baseURL }) => {
  const observed = await installFixture(page, baseURL!);
  const sent = await page.evaluate(signal => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.api.saveAnalyticsConsent("accepted");
    if (signal === "dnt") fixture.runtimeNavigator.doNotTrack = "1";
    if (signal === "gpc") fixture.runtimeNavigator.globalPrivacyControl = true;
    if (signal === "automation") fixture.runtimeNavigator.webdriver = true;
    fixture.api.syncGoogleMeasurement();
    return fixture.api.trackEvent("pageview");
  }, signal);
  expect(sent).toBe(false);
  await expect(page.locator("script[data-mair-ga4]")).toHaveCount(0);
  expect(observed.scripts).toEqual([]);
  expect(observed.unexpectedExternal).toEqual([]);
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
});

test("local mocked accepted consent cannot initialize measurement on private routes", async ({ page, baseURL }) => {
  const observed = await installFixture(page, baseURL!);
  for (const path of ["/login", "/en/account/projects", "/documents", "/auth/callback", "/dashboard/client"]) {
    const result = await page.evaluate(path => {
      const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
      fixture.runtimeWindow.location.pathname = path;
      fixture.api.saveAnalyticsConsent("accepted");
      fixture.api.syncGoogleMeasurement();
      return fixture.api.trackEvent("pageview");
    }, path);
    expect(result, path).toBe(false);
    await expect(page.locator("script[data-mair-ga4]")).toHaveCount(0);
  }
  expect(observed.scripts).toEqual([]);
  expect(observed.unexpectedExternal).toEqual([]);
});

for (const id of ["", "AW-18541953196", "G-XXXXXXXXXX"]) test(`local mocked missing or invalid GA4 ID fails closed: ${id || "missing"}`, async ({ page, baseURL }) => {
  const observed = await installFixture(page, baseURL!, id);
  const result = await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.api.saveAnalyticsConsent("accepted");
    fixture.api.syncGoogleMeasurement();
    return fixture.api.trackEvent("pageview");
  });
  expect(result).toBe(false);
  await expect(page.locator("script[data-mair-ga4]")).toHaveCount(0);
  expect(observed.scripts).toEqual([]);
  expect(observed.unexpectedExternal).toEqual([]);
});

for (const [label, referrer, expected] of [
  ["Google search", "https://www.google.ro/search?q=private-fixture%40example.invalid#private", "https://www.google.ro/"],
  ["Bing search", "https://www.bing.com/search?q=private-fixture&form=fixture", "https://www.bing.com/"],
  ["unknown host", "https://unknown.example/private-fixture?email=private-fixture", ""],
  ["insecure search", "http://www.google.com/search?q=private-fixture", ""],
  ["nonstandard port", "https://www.google.com:444/search?q=private-fixture", ""],
  ["credentials", "https://user:private-fixture@www.google.com/search?q=private-fixture", ""],
] as const) test(`local mocked referrer minimization: ${label}`, async ({ page, baseURL }) => {
  const observed = await installFixture(page, baseURL!, fixtureId, referrer);
  await page.evaluate(() => {
    const fixture = (window as unknown as FixtureWindow).__qaMeasurement;
    fixture.api.saveAnalyticsConsent("accepted");
    fixture.api.syncGoogleMeasurement();
    fixture.api.trackEvent("pageview");
  });
  const queued = await commands(page);
  const config = queued.find(command => command[0] === "config")!;
  const event = queued.find(command => command[0] === "event")!;
  expect(config[2]).toMatchObject({ page_referrer: expected });
  expect(event[2]).toMatchObject({ page_referrer: expected });
  expect(JSON.stringify(queued)).not.toContain("private-fixture");
  expect(observed.unexpectedExternal).toEqual([]);
});

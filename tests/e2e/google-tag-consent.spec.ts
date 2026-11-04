import { test, expect } from "@playwright/test";

async function acceptConfiguredAnalyticsOrClose(page: import("@playwright/test").Page) {
  await expect(page.locator(".mobile-menu-toggle")).toBeEnabled();
  const settings = page.getByRole("complementary", { name: "Setări analiză" });
  const toggle = settings.getByRole("button", { name: "Setări analiză", exact: true });
  if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
  await expect(settings.locator(".content-panel")).toBeVisible();
  const accept = settings.getByRole("button", { name: "Accept", exact: true });
  if (await accept.count()) await accept.click();
  else {
    await expect(settings).toContainText("Analiza nu este configurată");
    await expect(accept).toHaveCount(0);
    await toggle.click();
  }
}

test("automated browsers retain the Google tag privacy guard before and after consent", async ({ page, context, baseURL }) => {
  const requests: string[] = [];
  const origin = new URL(baseURL!).origin;
  await context.addCookies([{ name: "mr-electro-locale", value: "ro", url: baseURL! }]);
  await context.route("**/*", route => {
    const url = route.request().url();
    if (new URL(url).origin === origin) return route.continue();
    requests.push(url);
    return route.abort();
  });
  await page.goto("/");
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
  const settings = page.getByRole("complementary", { name: "Setări analiză" });
  await expect(page.locator("script[data-mair-ga4],script[data-mair-google-ads]")).toHaveCount(0);
  await acceptConfiguredAnalyticsOrClose(page);
  await settings.getByRole("button", { name: "Setări analiză", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Refuz / retrag acordul", exact: true })).toBeVisible();
  await expect(page.locator("script[data-mair-ga4],script[data-mair-google-ads]")).toHaveCount(0);
  expect(await page.evaluate(() => (window as Window & { dataLayer?: unknown[] }).dataLayer)).toBeUndefined();
  expect(requests.filter(url => /googletagmanager|google-analytics|googleadservices|doubleclick/.test(url))).toEqual([]);
  await settings.getByRole("button", { name: "Refuz / retrag acordul", exact: true }).click();
  await expect(page.locator("script[data-mair-ga4],script[data-mair-google-ads]")).toHaveCount(0);
});

test("automated product, comparison, finder and calculator use sends no funnel telemetry", async ({ page, context, baseURL }) => {
  const requests: string[] = [];
  const origin = new URL(baseURL!).origin;
  await context.addCookies([{ name: "mr-electro-locale", value: "ro", url: baseURL! }]);
  await context.route("**/*", route => {
    const url = route.request().url();
    if (new URL(url).origin === origin) return route.continue();
    requests.push(url);
    return route.abort();
  });
  await page.goto("/marketplace/products/renogy-core-mini-100ah");
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
  await acceptConfiguredAnalyticsOrClose(page);
  await page.locator(".product-detail .compare-control button").click();
  await expect(page.locator(".product-detail .compare-control button")).toHaveAttribute("aria-pressed", "true");
  await page.locator(".product-detail .compare-control button").click();
  await expect(page.locator(".comparison-tray")).toHaveCount(0);
  await page.goto("/marketplace/find-my-solution?step=3");
  await page.getByRole("button", { name: "Calculează sistemul", exact: true }).click();
  await expect(page.locator(".finder-results")).toBeVisible();
  await page.goto("/calculators/solar");
  const input = page.locator('main input[type="number"]').first();
  await input.fill("1500");
  await expect(input).toHaveValue("1500");
  // Allow the existing live-result debounce to run; provider/network guards must still hold.
  await page.waitForTimeout(1400);
  await expect(page.locator("script[data-mair-ga4],script[data-mair-google-ads]")).toHaveCount(0);
  expect(requests.filter(url => /plausible\.io|googletagmanager|google-analytics|googleadservices|doubleclick/.test(url))).toEqual([]);
});

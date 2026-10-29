import { test, expect } from "@playwright/test";

test("automated browsers retain the Google tag privacy guard before and after consent", async ({ page, context, baseURL }) => {
  const requests: string[] = [];
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", route => {
    const url = route.request().url();
    if (new URL(url).origin === origin) return route.continue();
    requests.push(url);
    return route.abort();
  });
  await page.goto("/en");
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
  const settings = page.getByRole("complementary", { name: "Analytics settings" });
  await expect(settings.getByRole("button", { name: "Accept", exact: true })).toBeVisible();
  await expect(page.locator("script[data-mair-google-ads]")).toHaveCount(0);
  await settings.getByRole("button", { name: "Accept", exact: true }).click();
  await settings.getByRole("button", { name: "Analytics settings", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Reject / withdraw consent", exact: true })).toBeVisible();
  await expect(page.locator("script[data-mair-google-ads]")).toHaveCount(0);
  expect(await page.evaluate(() => (window as Window & { dataLayer?: unknown[] }).dataLayer)).toBeUndefined();
  expect(requests.filter(url => /googletagmanager|googleadservices|doubleclick/.test(url))).toEqual([]);
  await settings.getByRole("button", { name: "Reject / withdraw consent", exact: true }).click();
  await expect(page.locator("script[data-mair-google-ads]")).toHaveCount(0);
});

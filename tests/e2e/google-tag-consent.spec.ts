import { test, expect } from "@playwright/test";

test("Google tag is inserted once after consent and queues withdrawal as Arguments", async ({ page, context, baseURL }) => {
  const requests: string[] = [];
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", route => {
    const url = route.request().url();
    if (new URL(url).origin === origin) return route.continue();
    requests.push(url);
    // Do not load Google code or send real measurement events in this regression test.
    return route.fulfill({ contentType: "application/javascript", body: "/* intercepted */" });
  });
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
  await page.goto("/en");
  const settings = page.getByRole("complementary", { name: "Analytics settings" });
  await expect(settings.getByRole("button", { name: "Accept", exact: true })).toBeVisible();
  await expect(page.locator("script[data-mair-google-ads]")).toHaveCount(0);
  expect(requests.filter(url => /googletagmanager|googleadservices|doubleclick/.test(url))).toEqual([]);
  await settings.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(page.locator("script[data-mair-google-ads]")).toHaveCount(1);
  await expect(page.locator("script[data-mair-google-ads]")).toHaveAttribute("src", "https://www.googletagmanager.com/gtag/js?id=AW-18541953196");
  // Current site CSP blocks Google script loading. This test verifies the queue and DOM,
  // not a successful Google download or event receipt; CSP needs separate review.
  const commands = () => page.evaluate(() => ((window as Window & { dataLayer?: IArguments[] }).dataLayer ?? []).map(c => ({
    type: Object.prototype.toString.call(c), values: Array.from(c),
  })));
  expect((await commands()).map(c => c.values[0])).toEqual(["consent", "consent", "js", "config"]);
  await settings.getByRole("button", { name: "Analytics settings", exact: true }).click();
  await settings.getByRole("button", { name: "Accept", exact: true }).click();
  expect(await commands()).toHaveLength(4);
  for (const action of ["Reject / withdraw consent", "Accept"]) {
    await settings.getByRole("button", { name: "Analytics settings", exact: true }).click();
    await settings.getByRole("button", { name: action, exact: true }).click();
    await expect.poll(async () => (await commands()).at(-1)?.values[2]).toEqual({
      ad_storage: action === "Accept" ? "granted" : "denied",
      ad_user_data: action === "Accept" ? "granted" : "denied",
      analytics_storage: action === "Accept" ? "granted" : "denied",
      ad_personalization: "denied",
    });
  }
  const queued = await commands();
  expect(queued.every(c => c.type === "[object Arguments]")).toBe(true);
  expect(queued.filter(c => c.values[0] === "config")).toHaveLength(1);
  expect(queued.filter(c => c.values[0] === "js")).toHaveLength(1);
  await expect(page.locator("script[data-mair-google-ads]")).toHaveCount(1);
  expect(requests.filter(url => url.includes("googletagmanager.com")).length).toBeLessThanOrEqual(1);
});

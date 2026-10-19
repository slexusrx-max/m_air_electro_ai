import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("English navigation, filters, schema and language links retain their public URLs", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/en/search?q=Renogy");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByLabel("Record type").selectOption("product");
  await page.getByRole("button", { name: "Apply filters", exact: true }).click();
  expect(new URL(page.url()).pathname).toBe("/en/search");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator('.equipment-card h3 a').first().click();
  await expect(page).toHaveURL(/\/en\/marketplace\/products\//);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).pathname).toBe(new URL(page.url()).pathname);
  const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
  const productPage = schema.map(s => JSON.parse(s)).find(s => s["@type"] === "WebPage");
  expect(productPage.url).toBe(canonical);
  await page.locator('a[href="#specifications"]').click();
  await page.getByRole("link", { name: "RO", exact: true }).click();
  expect(new URL(page.url()).pathname).not.toMatch(/^\/en/);
  expect(new URL(page.url()).hash).toBe("#specifications");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  expect(errors).toEqual([]);
});

test("language links work without JavaScript and English private routes remain unavailable", async ({ browser, request, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/learn/battery-runtime-calculation", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(new URL(page.url()).pathname).toBe("/en/learn/battery-runtime-calculation");
  await context.close();
  expect((await request.get("/en/expert")).status()).toBe(404);
  expect((await request.get("/en/learn/no-such-guide")).status()).toBe(404);
  const legacy = await request.get("/en/marketplace/products/lfp-battery-12v-100ah?source=example", { maxRedirects: 0 });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("/en/marketplace/products/renogy-core-mini-100ah?source=example");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /expert$");
  expect(robots).toContain("Disallow: /expert/");
  expect(robots).not.toMatch(/Disallow: \/expert\s*$/m);
});

for (const width of [320, 390, 768, 1440]) test(`homepage and energy examples remain usable at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/en");
  expect((await page.locator("h1").boundingBox())!.y).toBeLessThan(600);
  await expect(page.locator("main .catalog-filters")).toHaveCount(0);
  await expect(page.locator("main .equipment-card")).toHaveCount(3);
  await page.screenshot({ path: info.outputPath(`home-${width}.png`) });
  await page.goto("/en/solutions/rv-caravan");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator(".energy-example")).toContainText("788.3 Wh");
  await expect(page.locator(".energy-example tr").filter({ hasText: "DC water pump" })).toContainText("0.25");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect((await new AxeBuilder({ page }).include(".energy-example").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  await page.locator(".energy-example").screenshot({ path: info.outputPath(`example-${width}.png`) });
});

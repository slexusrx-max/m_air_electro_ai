import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Read-only on Production: never navigate to merchants or measurement endpoints.
test.beforeEach(async ({ context, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.origin === origin || (url.hostname === "cdn.shopify.com" && route.request().resourceType() === "image" && route.request().method() === "GET")) return route.continue();
    return route.abort();
  });
});

for (const locale of ["ro", "en"]) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`catalog discovery layout ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 950 });
    const prefix = locale === "en" ? "/en" : "";
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${prefix}/`);
    expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
    const placeholders = page.locator(".hero-model-tile .product-photo-pending");
    await expect(placeholders).toHaveCount(2);
    for (const placeholder of await placeholders.all()) {
      const label = await placeholder.locator("span").boundingBox();
      const visual = await placeholder.boundingBox();
      const title = await placeholder.locator("..").locator(":scope > span").boundingBox();
      expect(label).not.toBeNull();
      expect(visual).not.toBeNull();
      expect(title).not.toBeNull();
      expect(label!.y + label!.height).toBeLessThanOrEqual(visual!.y + visual!.height + 1);
      expect(label!.y + label!.height).toBeLessThanOrEqual(title!.y);
    }
    await page.screenshot({ path: info.outputPath("home.png") });
    await page.goto(`${prefix}/marketplace`);
    const filters = page.locator(".catalog-extra-filters");
    await expect(filters).not.toHaveAttribute("open", "");
    await expect(page.locator('.catalog-filters input[name="q"]')).toBeVisible();
    const layout = await page.locator(".catalog-layout").boundingBox();
    const firstProduct = await page.locator(".catalog-layout .equipment-card").first().boundingBox();
    const filterBox = await page.locator(".catalog-filters").boundingBox();
    if (width <= 768) expect(firstProduct!.y - layout!.y).toBeLessThan(660);
    await info.attach("discovery-layout", { body: JSON.stringify({ width, locale, filterHeight: filterBox!.height, firstProductOffset: firstProduct!.y - layout!.y }), contentType: "application/json" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath("marketplace.png") });
    await filters.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('.catalog-filters select[name="brand"]')).toBeVisible();
    const a11y = await new AxeBuilder({ page }).include(".catalog-filters").withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(a11y.violations).toEqual([]);
    await page.keyboard.press("Enter");
    await expect(page.locator('.catalog-filters select[name="brand"]')).not.toBeVisible();
    expect(errors).toEqual([]);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
  });
}

for (const locale of ["ro", "en"]) test(`Renogy search filter compare supplier journey ${locale}`, async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
  await page.setViewportSize({ width: 390, height: 950 });
  const prefix = locale === "en" ? "/en" : "";
  await page.goto(`${prefix}/marketplace`);
  await page.locator('.catalog-filters input[name="q"]').fill("100Ah");
  await page.locator('.catalog-filters button[type="submit"]').click();
  await expect(page.locator(".equipment-card")).toHaveCount(2);
  await page.locator(".catalog-extra-filters > summary").click();
  await page.locator('select[name="brand"]').selectOption("Renogy");
  await page.locator('select[name="kind"]').selectOption("product");
  await page.locator('.catalog-filters button[type="submit"]').click();
  await expect(page).toHaveURL(/brand=Renogy/);
  await expect(page.locator('select[name="brand"]')).toHaveValue("Renogy");
  await expect(page.locator('input[name="q"]').first()).toHaveValue("100Ah");
  await page.reload();
  await expect(page.locator('select[name="kind"]')).toHaveValue("product");
  const cards = page.locator(".equipment-card");
  await expect(cards).toHaveCount(2);
  for (const card of await cards.all()) {
    await card.locator("button[data-compare-product]").click();
    // Inspect the actual navigation contract without following an affiliate redirect.
    await expect(card.locator("a[data-supplier-product]")).toHaveAttribute("href", /^https:\/\//);
  }
  await expect(page.locator(".comparison-tray")).toHaveAttribute("data-count", "2");
  await expect(page.locator(".comparison-tray")).toHaveAttribute("data-expanded", "false");
  await page.locator(".comparison-tray-heading > a").click();
  await expect(page.locator("table thead th")).toHaveCount(3);
  await page.goBack();
  await page.locator(".active-filters").getByRole("link", { name: locale === "ro" ? "Șterge toate" : "Clear all", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/marketplace$`));
  await expect(page.locator(".catalog-extra-filters")).not.toHaveAttribute("open", "");
  await expect(page.locator('.catalog-filters input[name="q"]')).toHaveValue("");
});

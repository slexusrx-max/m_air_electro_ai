import { localizedPath } from "../../lib/i18n/routing";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waterCategories } from "../../lib/marketplace/water";
import { catalog } from "../../lib/affiliate/catalog";

for (const locale of ["ro", "en"] as const) {
  test(`water routes, evidence and finder work in ${locale}`, async ({ page, context, baseURL }) => {
    test.setTimeout(120000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.goto(locale === "en" ? "/en/water" : "/water");
    await expect(page).toHaveURL(/\/marketplace\/water$/);
    if (process.env.EXPECTED_DEPLOYMENT_SHA) {
      await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute('content', process.env.EXPECTED_DEPLOYMENT_SHA);
    }
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator('.water-hero-art img')).toHaveAttribute("src", /crystal-hero/);
    expect(await page.locator('.water-hero-art img').evaluate(async (img: HTMLImageElement) => { await img.decode(); return img.naturalWidth > 0; })).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "ro" ? "Apă pură.Un viitor mai luminos." : "Pure Water.Brighter Tomorrow.");
    await expect(page.locator('.product-grid > article')).toHaveCount(3);
    expect(await page.locator('#water-models').evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('#water-categories')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await page.getByRole("button", { name: "PFAS", exact: true }).click();
    await expect(page.getByRole("button", { name: "PFAS", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".water-evidence")).toContainText(locale === "ro" ? "Capacitate necunoscută" : "Capability unknown");
    await page.locator("#water-source").selectOption("well");
    await expect(page.locator(".water-plan")).toContainText(locale === "ro" ? "analiză de laborator" : "laboratory analysis");
    await page.locator("#water-setting").selectOption("gravity");
    await page.locator(".water-plan a").click();
    await expect(page).toHaveURL(/\/marketplace\/water\/gravity$/);
    for (const category of waterCategories) {
      const response = await page.goto(localizedPath(`/marketplace/water/${category.slug}`, locale));
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(category.title[locale]);
      await expect(page.locator('#water-categories, .water-category-grid, a[href="#water-categories"]')).toHaveCount(0);
      await expect(page.locator('.water-back-link')).toHaveAttribute('href', localizedPath('/marketplace/water', locale));
      const count = catalog.filter(p => p.kind === 'product' && p.category === 'water' && p.paths.includes(`water/${category.slug}`)).length;
      await expect(page.locator('.product-grid > article')).toHaveCount(count);
      await expect(page.locator('.water-empty-state')).toHaveCount(count === 0 ? 1 : 0);
      if (count === 0) {
        await expect(page.locator('.water-empty-state a').first()).toHaveAttribute('href', localizedPath('/learn/choosing-water-system', locale));
        await expect(page.locator('.water-empty-state a').filter({ hasText: 'Waterdrop' })).toHaveAttribute('href', localizedPath('/waterdrop', locale));
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${localizedPath(`/marketplace/water/${category.slug}`, locale)}`);
    }
    await page.goto(localizedPath("/learn/choosing-water-system", locale));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.locator("main").innerText()).not.toContain("undefined");
  });
}

for (const locale of ['ro', 'en'] as const) {
  for (const width of [390, 1440]) {
    test(`water category click and return ${locale} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(localizedPath('/marketplace/water', locale));
      await page.locator(`.water-category-grid a[href="${localizedPath('/marketplace/water/gravity', locale)}"]`).click();
      await expect(page.locator('.water-empty-state')).toBeVisible();
      await expect(page.locator('.water-category-grid')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath('water-empty-category.png'), fullPage: true });
      await page.locator('.water-back-link').click();
      await expect(page).toHaveURL(new RegExp(`${localizedPath('/marketplace/water', locale)}$`));
      await expect(page.locator('.water-category-grid > a')).toHaveCount(waterCategories.length);
      await page.screenshot({ path: testInfo.outputPath('water-hub.png'), fullPage: true });
    });
  }
}

test("water is responsive and accessible; original homepage artwork is retained", async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [320, 390, 430, 768, 1366, 1440]) {
    // Resize a blank page so the old responsive image request is not started
    // and immediately cancelled by navigation to the next viewport sample.
    await page.goto("about:blank");
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/marketplace/water");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.goto("/");
  await expect(page.locator('.hero-equipment-heading img')).toHaveAttribute("src", /m-air-electro-ai-turquoise/);
  await expect(page.getByTestId("water-home-promo")).toBeVisible();
  // Equipment and application discovery precede partner promotions; Waterdrop remains secondary.
  expect(await page.locator("#equipment-categories").evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('[data-testid="renogy-feature"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  expect(await page.getByTestId("renogy-feature").evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('[data-testid="water-home-promo"]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await page.getByTestId("water-home-promo").locator('a[href="/marketplace/water"]').click();
  await expect(page).toHaveURL(/\/marketplace\/water$/);
  await page.goto("/");
  await page.getByRole("button", { name: "Marketplace menu", exact: true }).click();
  await expect(page.locator('#mega-menu a[href="/marketplace/water"]')).toBeVisible();
});

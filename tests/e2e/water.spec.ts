import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waterCategories } from "../../lib/marketplace/water";

for (const locale of ["ro", "en"] as const) {
  test(`water routes, evidence and finder work in ${locale}`, async ({ page, context, baseURL }) => {
    test.setTimeout(120000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.goto("/water");
    await expect(page).toHaveURL(/\/marketplace\/water$/);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator('.water-hero-art img')).toHaveAttribute("src", /crystal-hero/);
    expect(await page.locator('.water-hero-art img').evaluate(async (img: HTMLImageElement) => { await img.decode(); return img.naturalWidth > 0; })).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "ro" ? "Apă pură.Un viitor mai luminos." : "Pure Water.Brighter Tomorrow.");
    await page.getByRole("button", { name: "PFAS", exact: true }).click();
    await expect(page.getByRole("button", { name: "PFAS", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".water-evidence")).toContainText(locale === "ro" ? "Capacitate necunoscută" : "Capability unknown");
    await page.locator("#water-source").selectOption("well");
    await expect(page.locator(".water-plan")).toContainText(locale === "ro" ? "analiză de laborator" : "laboratory analysis");
    await page.locator("#water-setting").selectOption("gravity");
    await page.locator(".water-plan a").click();
    await expect(page).toHaveURL(/\/marketplace\/water\/gravity$/);
    for (const category of waterCategories) {
      const response = await page.goto(`/marketplace/water/${category.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(category.title[locale]);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com/marketplace/water/${category.slug}`);
    }
    await page.goto("/learn/choosing-water-system");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.locator("main").innerText()).not.toContain("undefined");
  });
}

test("water is responsive and accessible; original homepage artwork is retained", async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [320, 390, 430, 768, 1366, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/marketplace/water");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.goto("/");
  await expect(page.locator('.brand-hero img')).toHaveAttribute("src", /hero\.png|hero%2Epng/);
  await expect(page.getByTestId("water-home-promo")).toBeVisible();
  expect(await page.locator(".brand-hero").evaluate(el => el.nextElementSibling?.getAttribute("data-testid"))).toBe("water-home-promo");
  await page.getByTestId("water-home-promo").locator('a[href="/marketplace/water"]').click();
  await expect(page).toHaveURL(/\/marketplace\/water$/);
  await page.goto("/");
  await page.getByRole("button", { name: "Marketplace menu", exact: true }).click();
  await expect(page.locator('#mega-menu a[href="/marketplace/water"]')).toBeVisible();
});

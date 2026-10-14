import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../lib/affiliate/catalog";
import { expectSupplierCta } from "../supplier-link-expectations";

const renogy = catalog.filter(p => p.provider === "renogy");

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`Renogy storefront disclosure, products, accessibility and layout ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    expect((await page.goto("/renogy"))?.status()).toBe(200);
    if (process.env.EXPECTED_DEPLOYMENT_SHA) await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute("content", process.env.EXPECTED_DEPLOYMENT_SHA);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "ro" ? "Energie bine gândită. Libertate de construit." : "Considered energy. Freedom to build.");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mairelectroai.com/renogy");
    const disclosure = page.getByTestId("affiliate-disclosure-before-content");
    await expect(disclosure).toBeVisible();
    expect(await disclosure.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector("main")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await expect(page.getByTestId("renogy-tracking-status")).toContainText(locale === "ro" ? "fără urmărire afiliată" : "without affiliate tracking");
    await expect(page.locator(".equipment-card")).toHaveCount(7);
    for (const product of renogy) {
      const card = page.locator(".equipment-card").filter({ has: page.locator(`a[data-supplier-product="${product.id}"]`) });
      await expect(card.locator(".product-context")).toContainText(locale === "ro" ? "Compatibilitate" : "Compatibility");
      await expectSupplierCta(card.locator(`a[data-supplier-product="${product.id}"]`), product, new URL(baseURL!).hostname === "mairelectroai.com");
    }
    const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
    expect(schemas.find(s => s["@type"] === "ItemList")?.itemListElement).toHaveLength(7);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`renogy-${locale}-${width}.png`), fullPage: true });
    await page.screenshot({ path: info.outputPath(`renogy-${locale}-${width}-viewport.png`) });
    expect(errors).toEqual([]);
  });
}

test("all Renogy model pages preserve source URLs, disclosure and ordinary links", async ({ page, context, baseURL }) => {
  test.setTimeout(180000);
  await context.addCookies([{ name: "mr-electro-locale", value: "en", url: baseURL! }]);
  for (const product of renogy) {
    expect((await page.goto(`/marketplace/products/${product.slug}`))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(product.name);
    await expectSupplierCta(page.locator(`.product-detail a[data-supplier-product="${product.id}"]`), product, false);
    await expect(page.getByTestId("affiliate-disclosure-before-content")).toBeVisible();
    await expect(page.locator('main a[href="/renogy"]')).toBeVisible();
    await expect(page.getByRole("link", { name: "Renogy EU · official model page ↗", exact: true })).toHaveAttribute("href", product.productUrl);
  }
});

test("commercial journey preserves homepage artwork, search, comparison, calculators and Waterdrop", async ({ page, context, baseURL }, info) => {
  test.setTimeout(180000);
  await context.addCookies([{ name: "mr-electro-locale", value: "en", url: baseURL! }]);
  await page.goto("/");
  await expect(page.locator('.brand-hero-art img')).toHaveAttribute("src", /hero\.png|hero%2Epng/);
  await expect(page.getByRole("heading", { name: "Considered energy. Freedom to build." })).toBeVisible();
  await expect(page.getByTestId("water-home-promo")).toBeVisible();
  await page.screenshot({ path: info.outputPath("homepage-commercial.png"), fullPage: true });
  await page.getByRole("link", { name: "Explore Renogy", exact: false }).click();
  await expect(page).toHaveURL(/\/renogy$/);
  await page.goto("/search?q=Renogy");
  await expect(page.locator(".equipment-card")).toHaveCount(7);
  await page.goto("/compare?ids=renogy-mini-100,renogy-mini-200");
  for (const id of ["renogy-mini-100", "renogy-mini-200"]) await expectSupplierCta(page.locator(`table a[data-supplier-product="${id}"]`), renogy.find(p => p.id === id)!, false);
  for (const route of ["/calculators/solar", "/calculators/battery", "/backup-calculator"]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("affiliate-disclosure-before-content")).toBeVisible();
  }
  expect((await page.goto("/waterdrop"))?.status()).toBe(200);
  for (const product of catalog.filter(p => p.provider === "waterdrop-eu")) await expectSupplierCta(page.locator(`.equipment-card a[data-supplier-product="${product.id}"]`), product, new URL(baseURL!).hostname === "mairelectroai.com");
  expect((await page.request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await page.request.get("/sitemap.xml")).text()).toContain("https://mairelectroai.com/renogy");
});

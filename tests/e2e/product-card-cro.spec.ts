import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../lib/affiliate/catalog";
import { rootCategories } from "../../lib/marketplace/content";
import { localizedPath } from "../../lib/i18n/routing";
import { expectSupplierCta } from "../supplier-link-expectations";

for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`recognizable product cards and consistent category badges ${locale} ${width}`, async ({ page, baseURL }, info) => {
    test.setTimeout(120000);
    const ro = locale === "ro";
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(localizedPath("/marketplace/batteries", locale));
    const product = catalog.find(item => item.id === "renogy-mini-100")!;
    const card = page.locator('[data-product-card="renogy-mini-100"]');
    await expect(card).toHaveAttribute("data-card-tone", "energy");
    await expect(card.locator(".eyebrow")).toHaveText("Renogy");
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(ro ? product.title.ro : product.name);
    const specs = card.getByLabel(ro ? "Specificații principale documentate" : "Documented key specifications");
    await expect(specs.locator("dd")).toHaveText(["12.8 V", "100 Ah", "1280 Wh (12.8 V × 100 Ah)"]);
    await expect(card.locator(".product-purpose strong")).toHaveText(ro ? "Potrivit pentru" : "Suitable for");
    await expect(card.locator(".product-purpose")).toContainText(ro ? product.bestFor.ro : product.bestFor.en);
    const image = card.locator(".product-model-photo img");
    await expect(image).toHaveAttribute("alt", product.name);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveCSS("object-fit", "contain");
    const compare = card.locator(".compare-control button");
    const supplier = card.locator("a[data-supplier-product]");
    await expectSupplierCta(supplier, product, new URL(baseURL!).hostname === "mairelectroai.com");
    await expect(supplier).toContainText(ro ? "Vezi prețul actual la Renogy EU" : "See current price at Renogy EU");
    for (const control of [compare, supplier]) {
      await expect(control).toBeVisible();
      expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await card.evaluate(element => {
      const compare = element.querySelector(".compare-control button")!;
      const supplier = element.querySelector("a[data-supplier-product]")!;
      return Boolean(compare.compareDocumentPosition(supplier) & Node.DOCUMENT_POSITION_FOLLOWING);
    })).toBe(true);
    expect((await new AxeBuilder({ page }).include('[data-product-card="renogy-mini-100"]').withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await card.screenshot({ path: info.outputPath(`product-card-${locale}-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

    await page.goto(localizedPath("/marketplace", locale));
    const categories = page.locator("#equipment-categories .category-tiles>a");
    await expect(categories).toHaveCount(rootCategories.length);
    for (const category of rootCategories) {
      const tile = categories.filter({ has: page.locator(`[data-category-photo="${category.path}"]`) });
      await expect(tile).toContainText(category.title[locale]);
      const badge = tile.locator("[data-category-identifier]");
      await expect(badge).toHaveCount(1);
      await expect(badge).toHaveAttribute("data-tone", category.path === "water" ? "water" : "energy");
      await expect(badge).toHaveAttribute("aria-hidden", "true");
      await expect(badge).toHaveCSS("width", "36px");
      await expect(badge.locator("svg")).toHaveCSS("width", "28px");
      const photo = tile.locator("img");
      await expect(photo).toHaveCount(1);
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), {
        message: `${category.path} category photograph must load before visual evidence`,
      }).toBe(true);
      await photo.evaluate((image: HTMLImageElement) => image.decode());
    }
    await page.locator("#equipment-categories").screenshot({ path: info.outputPath(`category-identifiers-${locale}-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test("water cards keep the regional supplier restriction and show a distinct aqua category badge", async ({ page }) => {
  await page.goto("/en/marketplace/water");
  const card = page.locator('[data-product-card="waterdrop-g3p800"]');
  await expect(card).toHaveAttribute("data-card-tone", "water");
  await expect(card.locator('[data-category-identifier="water"]')).toHaveAttribute("data-tone", "water");
  await expect(card.locator('[data-market-status="blocked-romania"]')).toBeVisible();
  await expect(card.locator("a[data-supplier-product]")).toHaveCount(0);
  await expect(card.getByRole("link", { name: /Details & compatibility/ })).toBeVisible();
});

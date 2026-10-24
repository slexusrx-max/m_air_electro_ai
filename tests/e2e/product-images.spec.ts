import { localizedPath } from "../../lib/i18n/routing";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../lib/affiliate/catalog";
import { productPhoto } from "../../lib/marketplace/product-photos";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`verified model photos and honest fallback ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    const label = locale === "ro" ? "Fotografie în curs de confirmare" : "Photo pending verification";
    await page.goto(localizedPath("/search?kind=product", locale));
    const models = catalog.filter(product => product.kind === "product");
    await expect(page.locator(".equipment-card")).toHaveCount(models.length);
    await expect(page.locator(".equipment-card img")).toHaveCount(models.filter(product => productPhoto(product)).length);
    await expect(page.locator(".equipment-card a[data-supplier-product]")).toHaveCount(models.length);
    for (const product of catalog.filter(product => product.kind === "product")) {
      const visual = page.locator(`[data-product-photo="${product.id}"]`);
      const photo = productPhoto(product);
      if (!photo) { await expect(visual).toHaveText(label); continue; }
      const img = visual.locator("img");
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute("alt", product.name);
      expect(decodeURIComponent((await img.getAttribute("src"))!)).toContain(photo.src);
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      await expect(visual).toHaveCSS("background-color", ["renogy-mini-100", "renogy-mini-200", "renogy-panel-200", "renogy-inverter-1000"].includes(product.id) ? "rgba(0, 0, 0, 0)" : "rgb(255, 255, 255)");
      await expect(img).toHaveCSS("object-fit", "contain");
    }
    await expect(page.getByTestId("product-photo-views-note")).toHaveText(locale === "ro"
      ? "Vedere din fata si din spate a unui singur panou." : "Front and rear views of one panel.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`catalog-${locale}-${width}.png`), fullPage: true });
    for (const id of ["renogy-mini-100", "renogy-mini-200", "renogy-panel-200", "dc-dc-charger-20a", "waterdrop-g3p800"]) {
      const product = catalog.find(product => product.id === id)!;
      await page.goto(localizedPath(`/marketplace/products/${product.slug}`, locale));
      const img = page.locator(`.product-illustration [data-product-photo="${id}"] img`);
      await expect(img).toBeVisible();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      await expect(img).toHaveAttribute("alt", product.name);
      expect((await img.boundingBox())!.height).toBeLessThanOrEqual(productPhoto(product)!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: info.outputPath(`${id}-${locale}-${width}.png`) });
    }
    for (const path of ["/search?q=100+Ah", "/marketplace/batteries"]) {
      await page.goto(localizedPath(path, locale));
      await expect(page.locator(`.equipment-card a[href="${localizedPath("/marketplace/products/lfp-battery-12v-100ah-class", locale)}"]`)).toHaveCount(0);
    }
    expect((await page.goto(localizedPath("/marketplace/products/lfp-battery-12v-100ah-class", locale)))?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(locale === "ro" ? "Clasă baterie" : "battery class");
    await expect(page.locator(".product-detail a[data-supplier-product]")).toHaveCount(0);
  });
}

import { localizedPath } from "../../lib/i18n/routing";
import { test, expect } from "@playwright/test";
import { catalog } from "../../lib/affiliate/catalog";
import { expectSupplierCta } from "../supplier-link-expectations";

const additions = catalog.filter(p => ["waterdrop-eu", "pecron-eu", "bluetti-eu"].includes(p.provider));
for (const locale of ["ro", "en"] as const) for (const width of [390, 1440]) {
  test(`nine supplier models, sources, schema and ordinary CTAs in ${locale} at ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const product of additions) {
      expect((await page.goto(localizedPath(`/marketplace/products/${product.slug}`, locale)))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(product.name);
      const cta = page.locator(`.product-detail a[data-supplier-product="${product.id}"]`);
      await expectSupplierCta(cta, product, new URL(baseURL!).hostname === "mairelectroai.com");
      await expect(cta).toContainText(product.merchant);
      const source = page.getByRole("link", { name: `${product.merchant} · ${locale === "ro" ? "pagina oficială a modelului" : "official model page"} ↗`, exact: true });
      await expect(source).toHaveAttribute("href", product.productUrl);
      await expect(page.locator("main")).not.toContainText("Renogy EU");
      for (const value of Object.values(product.technicalSpecs)) await expect(page.locator(".spec-grid")).toContainText(value);
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      const schema = schemas.map(text => JSON.parse(text)).find(data => data["@type"] === "Product");
      expect(schema?.brand.name).toBe(product.brand);
      expect(schema?.name).toBe(product.name);
      for (const field of ["offers", "aggregateRating", "review"]) expect(schema?.[field]).toBeUndefined();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (locale === "en" && ["waterdrop-g3p600", "pecron-e1500lfp", "bluetti-elite-200-v2"].includes(product.id))
        await page.screenshot({ path: info.outputPath(`${product.id}-${width}.png`), fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test("new models can be found, compared and browsed in the correct Water subcategories", async ({ page, context, baseURL }) => {
  test.setTimeout(180000);
  await context.addCookies([{ name: "mr-electro-locale", value: "en", url: baseURL! }]);
  for (const brand of ["Waterdrop", "PECRON", "BLUETTI"]) {
    await page.goto(localizedPath(`/search?q=${brand}`, "en"));
    const cards = page.locator(".equipment-card");
    await expect(cards).toHaveCount(3);
    for (const product of additions.filter(p => p.brand === brand))
      await expect(cards.locator(`h3 a[href="/en/marketplace/products/${product.slug}"]`)).toBeVisible();
  }
  for (const product of additions) {
    await page.goto(localizedPath(`/search?q=${encodeURIComponent(product.name)}`, "en"));
    await expect(page.locator(`main h3 a[href="/en/marketplace/products/${product.slug}"]`)).toBeVisible();
  }
  for (const path of ["water", "water/reverse-osmosis", "water/under-sink", "water/home-purification"]) {
    await page.goto(localizedPath(`/marketplace/${path}`, "en"));
    for (const product of additions.filter(p => p.category === "water"))
      await expect(page.locator(`main h3 a[href="/en/marketplace/products/${product.slug}"]`)).toBeVisible();
  }
  await page.goto(localizedPath("/marketplace/water/gravity", "en"));
  await expect(page.locator(".equipment-card")).toHaveCount(0);
  for (const ids of [["pecron-e1500lfp", "bluetti-elite-100-v2", "bluetti-apex-300"], ["waterdrop-g3p600", "waterdrop-g3p800", "waterdrop-x12"]]) {
    await page.goto(localizedPath(`/compare?ids=${ids.join(",")}`, "en"));
    for (const id of ids) {
      const product = catalog.find(p => p.id === id)!;
      const link = page.locator(`table a[data-supplier-product="${id}"]`);
      await expect(link).toContainText(product.merchant);
      await expectSupplierCta(link, product, new URL(baseURL!).hostname === "mairelectroai.com");
    }
  }
});

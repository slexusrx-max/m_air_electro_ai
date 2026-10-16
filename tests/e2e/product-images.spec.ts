import { test, expect } from "@playwright/test";
import { catalog } from "../../lib/affiliate/catalog";

for (const locale of ["ro", "en"]) test(`model photos fail closed and reference battery stays out of listings ${locale}`, async ({ page, context, baseURL }, info) => {
  test.setTimeout(180000);
  await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
  const label = locale === "ro" ? "Fotografie în curs de confirmare" : "Photo pending verification";
  await page.goto("/search?kind=product");
  await expect(page.locator(".equipment-card")).toHaveCount(catalog.filter(product => product.kind === "product").length);
  await expect(page.locator(".equipment-card img, .equipment-card svg")).toHaveCount(0);
  for (const product of catalog.filter(product => product.kind === "product"))
    await expect(page.locator(`[data-product-photo="${product.id}"]`)).toHaveText(label);
  for (const path of ["/search?q=100+Ah", "/marketplace/batteries"]) {
    await page.goto(path);
    await expect(page.locator('.equipment-card a[href="/marketplace/products/lfp-battery-12v-100ah-class"]')).toHaveCount(0);
  }
  for (const slug of ["renogy-core-mini-100ah", "renogy-core-mini-200ah"]) {
    await page.goto(`/marketplace/products/${slug}`);
    await expect(page.locator(".product-illustration img, .product-illustration svg")).toHaveCount(0);
    await expect(page.locator(".product-illustration")).toHaveText(label);
    if (process.env.EXPECTED_DEPLOYMENT_SHA) await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute("content", process.env.EXPECTED_DEPLOYMENT_SHA);
    if (process.env.IMAGE_RELEASE_SCREENSHOTS === "1") {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: info.outputPath(`${slug}-${locale}.png`) });
    }
  }
  expect((await page.goto("/marketplace/products/lfp-battery-12v-100ah-class"))?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText(locale === "ro" ? "Clasă baterie" : "battery class");
});

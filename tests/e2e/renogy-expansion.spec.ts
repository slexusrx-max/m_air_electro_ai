import { test, expect } from "@playwright/test";
import reviewed from "../../data/renogy-reviewed-products.json";
import { catalog } from "../../lib/affiliate/catalog";
import { expectSupplierCta } from "../supplier-link-expectations";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 768, 1440]) test(`exact Renogy photos, grouped navigation and clear glass at ${width}px`, async ({ page, baseURL }, info) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("/renogy");
  if (process.env.EXPECTED_DEPLOYMENT_SHA) await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute("content", process.env.EXPECTED_DEPLOYMENT_SHA);
  await expect(page.locator(".equipment-card")).toHaveCount(19);
  await expect(page.locator('#renogy-products nav a')).toHaveCount(7);
  for (const record of reviewed) {
    const photo = page.locator(`[data-product-photo="${record.id}"] img`);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("src", record.imageUrl);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { timeout: 30000 }).toBe(true);
    await expect(photo).toHaveCSS("filter", "none");
    await expect(photo).toHaveCSS("mix-blend-mode", "normal");
    const card = page.locator(".equipment-card").filter({ has: photo });
    await expect(card.locator("h3")).not.toBeEmpty();
    await expectSupplierCta(card.locator("[data-supplier-product]"), catalog.find(p => p.id === record.id)!, new URL(baseURL!).hostname === "mairelectroai.com");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const card = page.locator(".equipment-card").first();
  expect(await card.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  await expect(card.locator("[data-supplier-product]")).toHaveCSS("color", "rgb(23, 59, 80)");
  await page.locator('#renogy-products nav a[href="#renogy-panels"]').click();
  await expect(page.locator("#renogy-panels-title")).toBeInViewport();
  await page.locator("#renogy-panels").screenshot({ path: info.outputPath(`renogy-panels-${width}.png`) });
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.locator("#renogy-kits").screenshot({ path: info.outputPath(`renogy-kits-${width}.png`) });
});

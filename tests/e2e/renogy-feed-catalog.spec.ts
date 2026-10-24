import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renogyFeedProducts } from "../../data/renogy-extra-feed-products";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`extended Renogy catalog ${locale} ${width}`, async ({ page }) => {
    const prefix = locale === "en" ? "/en" : "";
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${prefix}/renogy`, { waitUntil: "domcontentloaded" });
    await page.locator(`a[href="${prefix}/renogy/catalog"]`).click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/renogy/catalog$`));
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${prefix}/renogy/catalog`);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", "https://mairelectroai.com/en/renogy/catalog");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(renogyFeedProducts.length);
    for (const product of renogyFeedProducts) {
      const card = cards.filter({ has: page.getByRole("heading", { name: product.name, exact: true }) });
      await expect(card.locator("a")).toHaveAttribute("href", product.url);
      await expect(card.locator("a")).toHaveAttribute("rel", "noopener noreferrer");
    }
    await page.locator('main nav a[href="#systems-and-kits"]').click();
    await expect(page).toHaveURL(/#systems-and-kits$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
    await page.screenshot({ path: `test-results/renogy-feed-${locale}-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import variants from "../../data/renogy-feed-variants.json";

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
    const cards = page.locator("main article[data-feed-sku]");
    await expect(cards).toHaveCount(48);
    await expect(page.getByText(locale === "ro" ? "365 poziții găsite" : "365 entries found")).toBeVisible();
    const first = variants.products[0];
    const firstCard = cards.filter({ has: page.getByRole("heading", { name: first.name, exact: true }) });
    await expect(firstCard).toHaveAttribute("data-feed-sku", first.sku);
    await expect(firstCard).toHaveAttribute("data-price-status", /fresh|unavailable/);
    await expect(firstCard.locator("a")).toHaveAttribute("href", first.url);
    await expect(firstCard.locator("a")).toHaveAttribute("rel", "noopener noreferrer");
    await page.getByLabel(locale === "ro" ? "Caută după model, variantă sau SKU" : "Search by model, variant or SKU").fill(variants.products[364].sku);
    await page.getByRole("button", { name: locale === "ro" ? "Caută" : "Search" }).click();
    await expect(page.locator("main article[data-feed-sku]")).toHaveCount(1);
    await expect(page.locator("main article[data-feed-sku]")).toHaveAttribute("data-feed-sku", variants.products[364].sku);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
    await page.screenshot({ path: `test-results/renogy-feed-${locale}-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { guides } from "../../lib/marketplace/guides";
import { catalog } from "../../lib/affiliate/catalog";
import { waterSelectionRoutes } from "../../lib/marketplace/water-guide-content";
import { localizedPath } from "../../lib/i18n/routing";

const guide = guides.find(guide => guide.slug === "choosing-water-system")!;
for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`water source to model comparison ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(120000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(localizedPath(`/learn/${guide.slug}`, locale));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(guide.title[locale]);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", `${guide.title[locale]}. ${guide.intro[locale]}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${localizedPath(`/learn/${guide.slug}`, locale)}`);
    const brief = page.getByTestId("water-selection-brief");
    await expect(brief).toContainText("12 ÷ 4 = 3");
    await expect(brief).toContainText(locale === "ro" ? "nu sunt valori atribuite unui produs" : "not product specifications", { ignoreCase: true });
    await expect(page.locator(".article-body")).not.toContainText(locale === "ro" ? "Notează consumatorii incluși și excluși" : "Record included and excluded loads");
    await expect(page.locator(".article-body")).not.toContainText("Victron Energy");
    for (const route of waterSelectionRoutes) await expect(brief.locator(`a[href="${localizedPath(route.href, locale)}"]`)).toHaveCount(1);
    await expect(page.getByRole("link", { name: "CDC · About Choosing Home Water Filters ↗", exact: true })).toHaveAttribute("href", guide.sources[0]);
    await expect(page.locator("#equipment-paths .equipment-card")).toHaveCount(4);
    for (const id of guide.equipmentGroups!.flatMap(group => group.productIds)) {
      const product = catalog.find(product => product.id === id)!;
      const image = page.locator(`#equipment-paths [data-product-photo="${id}"] img`);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("alt", product.name);
      await expect.poll(() => image.evaluate(async (element: HTMLImageElement) => {
        try { await element.decode(); } catch { return false; }
        return element.complete && element.naturalWidth > 0;
      })).toBe(true);
    }
    await expect(page.locator('#equipment-paths [data-market-status="blocked-romania"]')).toHaveCount(4);
    await expect(page.locator('#equipment-paths a[data-supplier="waterdrop-eu"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect((await new AxeBuilder({ page }).include('[data-testid="water-selection-brief"]').withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`water-guide-${locale}-${width}.png`), fullPage: true });

    const comparison = page.locator('#equipment-paths a[href*="/compare?ids="]').first();
    await comparison.click();
    await expect(page.locator('tr[data-comparison-spec="production"] td')).toHaveText(["600 GPD", "800 GPD"]);
    await expect(page.locator('table [data-market-status="blocked-romania"]')).toHaveCount(2);
    await expect(page.locator('table a[data-supplier="waterdrop-eu"]')).toHaveCount(0);

    await page.goto(localizedPath("/marketplace/water", locale));
    await expect(page.locator(".water-hero-art img")).toHaveAttribute("src", /crystal-hero-v2/);
    await expect(page.locator(".water-suppliers").locator("..")).toContainText(locale === "ro" ? "blocate pentru România" : "blocked for Romania");
    await page.locator("#water-source").selectOption("well");
    await expect(page.locator(".water-plan")).toContainText(locale === "ro" ? "analiză de laborator" : "laboratory analysis");
    await expect(page.locator(`.water-plan a[href="${localizedPath(`/learn/${guide.slug}#water-selection-brief`, locale)}"]`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

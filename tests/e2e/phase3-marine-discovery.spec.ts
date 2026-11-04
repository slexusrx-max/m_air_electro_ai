import { test, expect } from "@playwright/test";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`marine search landing connects sizing and documented equipment ${locale} ${width}`, async ({ page }, info) => {
    const ro = locale === "ro";
    await page.setViewportSize({ width, height: 900 });
    await page.goto(localizedPath("/marketplace/marine", locale));
    await expect(page).toHaveTitle(ro ? /Baterii la bord: capacitate, încărcare și panouri solare/ : /Marine battery systems: capacity, charging and solar/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${localizedPath("/marketplace/marine", locale)}`);
    await expect(page.locator("h1")).toHaveText(ro ? "Sisteme electrice navale" : "Marine electrical");
    await expect(page.locator("main")).toContainText(ro ? "Listarea nu confirmă compatibilitatea cu nava ta" : "A listing does not establish suitability for your vessel");
    const components = page.getByTestId("marine-component-paths");
    await expect(components).toContainText(ro ? "nu confirmă o certificare navală" : "do not establish marine certification");
    for (const path of ["batteries/lifepo4", "chargers/dc-dc", "solar/panels/flexible"]) {
      await expect(components.locator(`a[href="${localizedPath(`/marketplace/${path}`, locale)}"]`)).toBeVisible();
    }
    await components.locator(`a[href="${localizedPath("/marketplace/batteries/lifepo4", locale)}"]`).click();
    await expect(page.locator('.equipment-card[data-product-card="renogy-mini-100"]')).toBeVisible();
    await page.goto(localizedPath("/marketplace/marine", locale));
    await expect(page.locator("main")).toContainText(ro ? "Compară Ah numai la aceeași tensiune nominală" : "Compare Ah only at the same nominal voltage");
    const calculator = page.locator(`main a[href="${localizedPath("/calculators/battery", locale)}"]`);
    await expect(calculator).toBeVisible();
    await expect(page.locator(`main a[href="${localizedPath("/learn/marine-battery-system", locale)}"]`)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`marine-${locale}-${width}.png`) });
    await calculator.click();
    await expect(page.locator('[data-testid="battery-sizing-explainer"]')).toBeVisible();
    const compare = page.getByTestId("battery-sizing-explainer").getByRole("link", { name: /Renogy Core Mini 100/ });
    await expect(compare).toBeVisible();
    const destination = new URL((await compare.getAttribute("href"))!, page.url());
    expect(destination.pathname).toBe(localizedPath("/compare", locale));
    expect(destination.searchParams.get("ids")).toBe("renogy-mini-100,renogy-mini-200");
    await compare.click();
    await expect(page.locator('tr[data-comparison-spec="nominal-voltage"] td').first()).toHaveText("12.8 V");
    await expect(page.locator('tr[data-comparison-spec="capacity"] td')).toHaveText(["100 Ah", "200 Ah"]);
    await expect(page.locator('table a[data-supplier="renogy"]')).toHaveCount(2);
  });
}

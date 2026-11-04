import { test, expect } from "@playwright/test";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`relevant comparison measurements ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(120000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    const unknown = locale === "ro" ? "Nedocumentat" : "Not documented";
    const row = (id: string) => page.locator(`tr[data-comparison-spec="${id}"]`);

    await page.goto(localizedPath("/compare?ids=renogy-mini-100,renogy-mini-200", locale));
    await expect(row("nominal-voltage").locator("td").first()).toHaveText("12.8 V");
    await expect(row("voltage-class").locator("td").first()).toHaveText("12 V");
    await expect(row("energy")).toHaveCount(1);
    await expect(row("cycle-life").locator("td")).toHaveText([unknown, unknown]);
    await expect(page.locator("tbody tr").first()).toHaveAttribute("data-comparison-spec", "nominal-voltage");

    await page.goto(localizedPath("/compare?ids=pecron-e1500lfp,bluetti-elite-100-v2", locale));
    await expect(row("continuous-output").locator("td")).toHaveText(["2200 W", "1800 W"]);
    await expect(row("surge-output").locator("td")).toHaveText([unknown, unknown]);
    await expect(row("source-Rated AC output")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

    await page.goto(localizedPath("/compare?ids=renogy-panel-200,renogy-flexible-175w", locale));
    await expect(row("panel-power").locator("td")).toHaveText(["200 W (STC)", "175 W (STC)"]);
    await expect(row("efficiency").locator("td")).toHaveText([unknown, unknown]);

    await page.goto(localizedPath("/compare?ids=waterdrop-g3p600,waterdrop-g3p800", locale));
    await expect(row("production").locator("td")).toHaveText(["600 GPD", "800 GPD"]);
    await expect(row("contaminant-reduction").locator("td")).toHaveText([unknown, unknown]);
    await expect(row("energy")).toHaveCount(0);
    await expect(page.locator('table [data-market-status="blocked-romania"]')).toHaveCount(2);
    await expect(page.locator('table a[data-supplier="waterdrop-eu"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`comparison-${locale}-${width}.png`), fullPage: true });

    await page.goto(localizedPath("/compare?ids=pecron-d77,pecron-e600lfp", locale));
    await expect(page.locator("table")).toHaveCount(0);
    await expect(page.locator("[role=status]").filter({ hasText: locale === "ro" ? "roluri diferite" : "equipment roles" })).toBeVisible();
  });
}

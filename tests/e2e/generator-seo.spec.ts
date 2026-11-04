import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`generator search journey, calculations and limits ${locale} ${width}`, async ({ page }, info) => {
    const ro = locale === "ro";
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto(localizedPath("/calculators/generator", locale));
    expect(response?.status()).toBe(200);
    const serverHtml = await response!.text();
    expect(serverHtml).toContain('data-testid="generator-worked-examples"');
    expect(serverHtml).toContain(ro ? "Două exemple de dimensionare" : "Two generator sizing examples");
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page).toHaveTitle(ro ? /^Calculator dimensionare generator: kW, kVA și pornire/ : /^Generator sizing calculator: kW, kVA & motor starts/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(ro ? "Calculator dimensionare generator" : "Generator sizing calculator");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${localizedPath("/calculators/generator", locale)}`);
    await expect(page.getByTestId("generator-worked-examples")).toContainText(ro ? "Nu sunt rapoarte universale" : "not universal starting-current ratios");
    const load = page.getByLabel(ro ? /Sarcina în funcționare/ : /Running load/);
    const motor = page.getByLabel(ro ? /Puterea electrică a motorului cel mai mare/ : /Largest motor electrical input/);
    const pf = page.getByLabel(ro ? "Factor de putere" : "Power factor", { exact: true });
    const reserve = page.getByLabel(ro ? "Rezervă de funcționare (%)" : "Operating reserve (%)", { exact: true });
    await motor.fill("0");
    await load.fill("2");
    await pf.fill("1");
    await reserve.fill("25");
    await expect(page.getByTestId("generator-apparent-power")).toContainText("2.5 kVA");
    await expect(page.getByTestId("generator-real-power")).toContainText("2.5 kW");
    await motor.fill("3");
    await expect(page.getByRole("alert").filter({ hasText: ro ? "trebuie inclusă" : "must be included" })).toBeVisible();
    await load.fill("6");
    await motor.fill("1");
    await pf.fill("0.8");
    await reserve.fill("20");
    await expect(page.getByTestId("generator-apparent-power")).toContainText("12 kVA");
    await expect(page.getByTestId("generator-real-power")).toContainText("7.2 kW");
    await expect(page.getByTestId("generator-apparent-power")).toContainText(ro ? "nu o mărime comercială" : "not an available generator size");
    const compare = page.getByRole("link", { name: ro ? /Compară alternativele cu baterii/ : /Compare battery alternatives:/ });
    await expect(compare).toHaveAttribute("href", localizedPath("/compare?ids=pecron-e1000lfp,pecron-e1500lfp", locale));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`generator-${locale}-${width}.png`), fullPage: true });
    await compare.click();
    await expect(page.locator(".comparison-scroll table")).toBeVisible();
    await expect(page.locator(".comparison-scroll thead")).toContainText("PECRON E1000LFP");
    await expect(page.locator(".comparison-scroll thead")).toContainText("PECRON E1500LFP");
  });
}

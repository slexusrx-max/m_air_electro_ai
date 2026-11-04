import { test, expect } from "@playwright/test";
import { consentKey } from "../../lib/analytics";
import { localizedPath } from "../../lib/i18n/routing";

const measurementHost = /(?:googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|plausible\.io)/;

// This suite is safe against Production: automation remains detectable and every
// third-party request is intercepted rather than generating a measurement hit.
for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`automated consent and withdrawal preserve comparison and calculator privacy ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    const ro = locale === "ro";
    const origin = new URL(baseURL!).origin;
    const external: string[] = [];
    await page.setViewportSize({ width, height: 1000 });
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await context.route("**/*", route => {
      const url = route.request().url();
      if (new URL(url).origin === origin) return route.continue();
      external.push(url);
      return route.abort();
    });
    await page.goto(localizedPath("/marketplace/products/renogy-core-mini-100ah", locale));
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
    await expect(page.locator(".mobile-menu-toggle")).toBeEnabled();
    const settings = page.getByRole("complementary", { name: ro ? "Setări analiză" : "Analytics settings" });
    const toggleSettings = settings.getByRole("button", { name: ro ? "Setări analiză" : "Analytics settings", exact: true });
    if (await toggleSettings.getAttribute("aria-expanded") !== "true") await toggleSettings.click();
    await expect(settings.locator(".content-panel")).toBeVisible();
    await expect(settings).toHaveAttribute("data-analytics-provider", /^(ga4|plausible|none)$/);
    const accept = settings.getByRole("button", { name: "Accept", exact: true });
    const configured = await settings.getAttribute("data-analytics-provider") !== "none";
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
    if (configured) {
      await expect(accept).toBeVisible();
      await accept.click();
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).choice, consentKey)).toBe("accepted");
    } else {
      await expect(settings).toContainText(ro ? "Analiza nu este configurată" : "Analytics is not configured");
      await expect(accept).toHaveCount(0);
      expect(await page.evaluate(key => localStorage.getItem(key), consentKey)).toBeNull();
      await toggleSettings.click();
    }
    const compare = page.locator(".product-detail .compare-control button");
    await compare.click();
    await expect(compare).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".comparison-tray")).toHaveAttribute("data-expanded", "false");
    await compare.click();
    await expect(compare).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".comparison-tray")).toHaveCount(0);
    await page.goto(localizedPath("/calculators/generator", locale));
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    const motor = page.getByLabel(ro ? /Puterea electrică a motorului cel mai mare/ : /Largest motor electrical input/);
    const load = page.getByLabel(ro ? /Sarcina în funcționare/ : /Running load/);
    await motor.fill("0");
    await load.fill("2");
    await page.getByLabel(ro ? "Factor de putere" : "Power factor", { exact: true }).fill("1");
    await page.getByLabel(ro ? "Rezervă de funcționare (%)" : "Operating reserve (%)", { exact: true }).fill("25");
    await expect(page.getByTestId("generator-apparent-power")).toContainText("2.5 kVA");
    // Observe the documented 1.2-second calculator debounce without dispatching
    // anything ourselves; automated use must remain excluded after it settles.
    await page.waitForTimeout(1400);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
    await settings.getByRole("button", { name: ro ? "Setări analiză" : "Analytics settings", exact: true }).click();
    const withdraw = settings.getByRole("button", { name: ro ? "Refuz / retrag acordul" : "Reject / withdraw consent", exact: true });
    await expect(withdraw).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await settings.screenshot({ path: info.outputPath(`consent-controls-${locale}-${width}.png`) });
    await withdraw.click();
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).choice, consentKey)).toBe("rejected");
    await page.goto("/login?next=%2Faccount");
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
    expect(await page.evaluate(() => navigator.webdriver)).toBe(true);
    await page.goto(localizedPath("/marketplace", locale));
    await expect(page.locator(".catalog-filters")).toBeVisible();
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
    expect(external.filter(url => measurementHost.test(new URL(url).hostname))).toEqual([]);
  });
}

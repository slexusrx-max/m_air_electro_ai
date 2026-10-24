import { test, expect } from "@playwright/test";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"] as const) for (const width of [320, 390, 768, 1440]) {
  test(`commercial navigation and footer ${locale} ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(localizedPath("/", locale));
    const waterName = locale === "ro" ? "Apă și reziliență" : "Water & Resilience";
    const mobile = width <= 1300;
    if (mobile) await page.locator(".mobile-menu-toggle").click();
    const nav = page.locator(mobile ? "#mobile-menu" : ".desktop-nav");
    const water = nav.getByRole("link", { name: waterName, exact: true });
    await expect(water).toHaveCount(1);
    await expect(water).toHaveAttribute("href", localizedPath("/marketplace/water", locale));
    await expect(page.getByText("Pure water filters", { exact: true })).toHaveCount(0);
    if (mobile) {
      await nav.locator('summary[data-primary-section="/marketplace"]').click();
      await expect(nav.locator(`a[href="${localizedPath("/marketplace/water", locale)}"]`)).toHaveCount(1);
    }
    const footer = page.locator(".deep-footer");
    await expect(footer.locator(`h2 a[href="${localizedPath("/learn", locale)}"]`)).toHaveCount(1);
    await expect(footer.locator(`a[href="${localizedPath("/marketplace/water", locale)}"]`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator(".commerce-header").screenshot({ path: info.outputPath("navigation.png") });
    await water.click();
    await expect(page).toHaveURL(new RegExp(`${localizedPath("/marketplace/water", locale)}$`));
    await expect(page.locator("h1")).toContainText(locale === "ro" ? "Apă pură" : "Pure Water");
    await footer.locator(`h2 a[href="${localizedPath("/learn", locale)}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${localizedPath("/learn", locale)}$`));
    await expect(page.locator("h1")).toBeVisible();
  });
}

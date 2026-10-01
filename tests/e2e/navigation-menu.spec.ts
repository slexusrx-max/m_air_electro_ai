import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { navigation } from "../../lib/marketplace/navigation";

for (const locale of ["ro", "en"] as const) for (const width of [390, 430, 768, 1366, 1440]) {
  test(`compact navigation ${locale} at ${width}px`, async ({ page, context, baseURL }, info) => {
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const desktop = width > 1300;
    const trigger = page.getByRole("button", { name: desktop ? "Marketplace menu" : locale === "ro" ? "Meniu" : "Menu", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.locator(desktop ? "#mega-menu" : "#mobile-menu");
    await expect(menu).toBeVisible();
    if (desktop) {
      await expect(menu.locator(".mega-section")).toHaveCount(4);
      await expect(menu.locator(".mega-water")).toBeVisible();
      await expect(menu).toContainText(locale === "ro" ? "Generatoare electrice" : "Power generators");
      await expect(menu).toContainText(locale === "ro" ? "Alimentare de rezervă pentru apartament" : "Apartment backup power");
    } else {
      await menu.locator(":scope > details > summary").filter({ hasText: /^Marketplace$/ }).click();
      const water = menu.locator("details details").filter({ has: page.locator('a[href="/marketplace/water"]') });
      await water.locator(":scope > summary").click();
    }
    const bounds = await menu.boundingBox();
    expect(bounds!.height).toBeLessThanOrEqual(900 * .6);
    expect(bounds!.y + bounds!.height).toBeLessThan(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include(desktop ? "#mega-menu" : "#mobile-menu").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`menu-${locale}-${width}.png`) });
    const waterLink = menu.locator('a[href="/marketplace/water"]');
    await waterLink.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(waterLink).toBeFocused();
    expect(await waterLink.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    if (!desktop) {
      await menu.locator(":scope > details > summary").filter({ hasText: /^Marketplace$/ }).click();
      await menu.locator("details details").filter({ has: page.locator('a[href="/marketplace/water"]') }).locator(":scope > summary").click();
    }
    await waterLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/marketplace\/water$/);
    await expect(menu).toHaveCount(0);
  });
}

test("all navigation destinations respond successfully", async ({ request }) => {
  test.setTimeout(180000);
  const paths = new Set<string>();
  const collect = (items: ReturnType<typeof navigation>[number]["children"]) => {
    for (const item of items) { paths.add(item.href); if (item.children) collect(item.children); }
  };
  collect(navigation("en"));
  for (const path of paths) expect((await request.get(path)).status(), path).toBe(200);
});

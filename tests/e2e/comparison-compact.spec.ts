import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../lib/affiliate/catalog";
import { comparisonGroup } from "../../lib/marketplace/comparison";
import { localizedPath } from "../../lib/i18n/routing";

const batteries = catalog.filter(product => product.kind === "product" && comparisonGroup(product) === "lithium-batteries").slice(0, 4);

test("clearing a saved comparison on another route preserves keyboard focus", async ({ page }) => {
  await page.addInitScript(id => localStorage.setItem("mair-compare", id), batteries[0].id);
  await page.goto("/contact");
  const tray = page.locator(".comparison-tray");
  await tray.locator(".comparison-tray-toggle").click();
  await tray.locator(".comparison-tray-clear").click();
  await expect(tray).toHaveCount(0);
  await expect(page.locator("#main-content")).toBeFocused();
});

for (const locale of ["ro", "en"] as const) {
  test(`comparison starts hidden, stays compact on add and supports remove/clear ${locale}`, async ({ page }) => {
    await page.goto(localizedPath("/marketplace/batteries", locale));
    const tray = page.locator(".comparison-tray");
    const controls = page.locator(".equipment-card .compare-control button");
    await expect(tray).toHaveCount(0);
    await controls.nth(0).click();
    await expect(tray).toHaveAttribute("data-count", "1");
    await expect(tray.locator(".comparison-tray-toggle")).toHaveAttribute("aria-expanded", "false");
    await expect(tray.locator(".comparison-tray-panel")).toBeHidden();
    await expect(tray.locator(".comparison-tray-heading>a")).toHaveCount(0);
    expect((await tray.boundingBox())!.height).toBeLessThanOrEqual(96);
    await controls.nth(1).click();
    await expect(tray).toHaveAttribute("data-count", "2");
    await expect(tray.locator(".comparison-tray-panel")).toBeHidden();
    await expect(tray.locator(".comparison-tray-heading>a")).toBeVisible();
    await tray.locator(".comparison-tray-toggle").click();
    await expect(tray.locator(".comparison-tray-panel")).toBeVisible();
    await expect(tray.locator("li")).toHaveCount(2);
    await tray.locator("li button").first().click();
    await expect(tray).toHaveAttribute("data-count", "1");
    await tray.locator("li button").click();
    await expect(tray).toHaveCount(0);
    await expect(controls.nth(1)).toBeFocused();
    await controls.nth(0).click();
    await tray.locator(".comparison-tray-toggle").click();
    await tray.locator(".comparison-tray-clear").click();
    await expect(tray).toHaveCount(0);
    await expect(controls.nth(0)).toBeFocused();
    expect(await page.evaluate(() => localStorage.getItem("mair-compare"))).toBe("");
  });
}

for (const count of [1, 2, 4]) {
  test(`saved ${count}-product comparison is compact on arrival and reload`, async ({ page }) => {
    expect(batteries.length).toBe(4);
    const ids = batteries.slice(0, count).map(product => product.id).join(",");
    await page.addInitScript(value => {
      if (localStorage.getItem("mair-compare") === null) localStorage.setItem("mair-compare", value);
    }, ids);
    await page.goto("/marketplace/batteries");
    const tray = page.locator(".comparison-tray");
    const toggle = tray.locator(".comparison-tray-toggle");
    await expect(tray).toHaveAttribute("data-count", String(count));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(tray.locator(".comparison-tray-panel")).toBeHidden();
    await toggle.click();
    await expect(tray.locator(".comparison-tray-panel")).toBeVisible();
    await expect(tray.locator("li")).toHaveCount(count);
    await toggle.click();
    await expect(tray.locator(".comparison-tray-panel")).toBeHidden();
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await page.reload();
    await expect(tray).toHaveAttribute("data-count", String(count));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => localStorage.getItem("mair-compare"))).toBe(ids);
  });
}

for (const width of [390, 430, 768, 1366, 1440]) {
  test(`comparison glass drawer and navigation remain usable at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(ids => localStorage.setItem("mair-compare", ids), batteries.map(product => product.id).join(","));
    await page.goto("/marketplace/batteries");
    const tray = page.locator(".comparison-tray");
    const toggle = tray.locator(".comparison-tray-toggle");
    await expect(tray).toHaveAttribute("data-count", "4");
    await expect(tray.locator(".comparison-tray-panel")).toBeHidden();
    expect((await tray.boundingBox())!.height).toBeLessThanOrEqual(96);
    await page.screenshot({ path: info.outputPath(`comparison-compact-${width}.png`) });
    await toggle.click();
    await expect(tray.locator("li")).toHaveCount(4);
    expect((await tray.boundingBox())!.height).toBeLessThanOrEqual(300);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect((await new AxeBuilder({ page }).include(".comparison-tray").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`comparison-expanded-${width}.png`) });
    if (width < 1100) {
      await page.getByRole("button", { name: /Meniu/ }).click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
      await expect(tray).toBeHidden();
      await page.getByRole("button", { name: /Meniu/ }).click();
      await expect(tray).toBeVisible();
    }
    await tray.locator(".comparison-tray-heading>a").click();
    await expect(page.locator(".comparison-scroll table")).toBeVisible();
    await expect(page.locator(".comparison-scroll thead th")).toHaveCount(5);
    await expect(tray).toHaveCount(0);
  });
}

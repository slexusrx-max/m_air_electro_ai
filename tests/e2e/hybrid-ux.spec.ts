import { localizedPath } from "../../lib/i18n/routing";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["ro", "en"] as const) {
  test(`hybrid discovery, filter chips and comparison persist across language ${locale}`, async ({ page, context, baseURL }) => {
    test.setTimeout(180000);
    const ro = locale === "ro";
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(localizedPath("/", locale));
    const browse = page.locator(".discovery-hero").getByRole("link", { name: ro ? /Alege echipamente/ : /Browse Equipment/ });
    await expect(browse).toBeVisible();
    expect((await browse.boundingBox())!.y).toBeLessThan(900);
    await expect(page.locator(".application-grid>a")).toHaveCount(3);
    await page.locator('.application-grid>a[href*="rv-caravan"]').click();
    await expect(page.getByRole("combobox", { name: ro ? "Aplicație" : "Application", exact: true })).toHaveValue("rv-caravan");
    await page.goto(localizedPath("/search?q=Renogy&kind=product&capacityAh=100", locale));
    await expect(page.locator(".active-filters>a")).toHaveCount(4);
    await page.locator('.active-filters>a').filter({ hasText: "100" }).click();
    await expect(page).toHaveURL(/q=Renogy&kind=product$/);
    await expect(page.locator(".equipment-card")).toHaveCount(7);
    await page.locator(".filter-options summary").click();
    await expect(page.locator('.catalog-filters select[name="capacityAh"]')).toBeVisible();
    await page.locator(".filter-options summary").click();
    const cards = page.locator(".equipment-card");
    await cards.nth(0).locator(".compare-control button").click();
    await cards.nth(1).locator(".compare-control button").click();
    const tray = page.locator(".comparison-tray");
    await expect(tray.locator("li")).toHaveCount(2);
    const names = await tray.locator("li>span").allTextContents();
    expect(names.every(name => name.includes("Renogy"))).toBe(true);
    await page.getByRole("link", { name: ro ? "EN" : "RO", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", ro ? "en" : "ro");
    await expect(page).toHaveURL(/q=Renogy&kind=product$/);
    await expect(tray.locator("li")).toHaveCount(2);
    expect((await new AxeBuilder({ page }).include(".comparison-tray").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await tray.locator(".comparison-tray-heading>a").click();
    await expect(page.locator(".comparison-scroll table")).toBeVisible();
    await page.goto(localizedPath("/renogy", locale));
    await tray.locator("button").first().click();
    await expect(tray.locator("li")).toHaveCount(1);
    await tray.locator("button").click();
    await expect(tray).toHaveCount(0);
  });
  test(`finder retains draft inputs and step on language switch ${locale}`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.goto(localizedPath("/marketplace/find-my-solution?application=marine&load=750&peak=1200&hours=6&region=EU&solar=yes&step=2", locale));
    await expect(page.locator('input[type="number"]').first()).toHaveValue("750");
    await page.getByRole("link", { name: locale === "ro" ? "EN" : "RO", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "ro" ? "en" : "ro");
    await expect(page.locator('input[type="number"]').first()).toHaveValue("750");
    await expect(page).toHaveURL(/application=marine/);
    await expect(page).toHaveURL(/step=2/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
}

test("public language links are available before hydration", async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve; });
  await page.route("**/_next/static/**/*.js", async route => {
    await scriptsReady;
    await route.continue();
  });
  try {
    await page.goto("/search?q=100+Ah", { waitUntil: "commit" });
    await expect(page.getByRole("link", { name: "EN", exact: true })).toHaveAttribute("href", "/en/search?q=100+Ah");
  } finally {
    releaseScripts();
  }
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(new URL(page.url()).searchParams.get("q")).toBe("100 Ah");
});

for (const width of [320, 360, 390, 768, 1024, 1440]) test(`Renogy clean categories and accessibility at ${width}`, async ({ page }, info) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/renogy");
  const tiles = page.getByTestId("renogy-category-tiles");
  await expect(tiles.locator("a")).toHaveCount(6);
  expect(await tiles.innerText()).not.toMatch(/\b0[1-9]\b/);
  await expect(tiles.locator('a[href="/compare"]')).toHaveCount(0);
  await tiles.screenshot({ path: info.outputPath(`renogy-categories-${width}.png`) });
  expect(await page.locator("main").innerText()).not.toMatch(/\b0[1-9]\s*\//);
  const details = page.locator(".equipment-card details").first();
  await expect(details.locator("p").first()).toBeHidden();
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details.locator("p").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath(`renogy-${width}.png`) });
});

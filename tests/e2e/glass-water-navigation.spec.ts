import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"] as const) for (const width of [320, 390, 768, 1366, 1440, 1920]) {
  test(`clear glass and direct water navigation ${locale} ${width}`, async ({ page }, info) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(localizedPath("/", locale));
    await page.evaluate(async () => { await document.fonts.ready; });
    const header = page.locator(".commerce-header");
    const desktop = width > 1300;
    if (!desktop) await page.getByRole("button", { name: locale === "ro" ? "Meniu" : "Menu", exact: true }).click();
    const navigation = page.locator(desktop ? ".desktop-nav" : "#mobile-menu");
    const water = navigation.locator(".water-nav-link");
    await expect(water).toBeVisible();
    await expect(water).toHaveAttribute("href", localizedPath("/marketplace/water", locale));
    await expect(water).toHaveCSS("text-transform", "uppercase");
    for (const label of await navigation.locator(desktop ? ".nav-pair>a" : ":scope>details>summary,:scope>.mobile-primary-link").all()) {
      await expect(label).toHaveCSS("text-transform", "uppercase");
    }
    if (desktop) {
      const nav = (await navigation.boundingBox())!;
      const actions = (await page.locator(".header-actions").boundingBox())!;
      expect(nav.x + nav.width <= actions.x + 1 || nav.y >= actions.y + actions.height - 1).toBe(true);
    }
    expect((await new AxeBuilder({ page }).include(".commerce-header").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await header.screenshot({ path: info.outputPath(`header-${locale}-${width}.png`) });
    await water.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${localizedPath("/marketplace/water", locale)}$`));
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#mobile-menu")).toHaveCount(0);

    for (const route of ["/", "/marketplace"]) {
      await page.goto(localizedPath(route, locale));
      const wrappers = page.locator(".hero-model-tile .product-model-photo,.category-preview,.category-preview .equipment-visual");
      for (const wrapper of await wrappers.all()) await expect(wrapper).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      for (const card of await page.locator(".hero-model-tile,.category-tiles>a").all()) {
        await expect(card).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(card).toHaveCSS("opacity", "1");
      }
      for (const card of [page.locator(".hero-model-tile").first(), page.locator(".category-tiles>a").first()]) {
        await card.hover();
        await expect.poll(() => card.evaluate(el => Number(getComputedStyle(el).backgroundColor.match(/,\s*([.\d]+)\)$/)?.[1] ?? 1))).toBeLessThan(.3);
        await page.mouse.move(0, 0);
      }
      const photos = page.locator(".hero-model-tile img,.category-preview img");
      for (const photo of await photos.all()) {
        await photo.scrollIntoViewIfNeeded();
        await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        await expect(photo).toHaveCSS("filter", "none");
        await expect(photo).toHaveCSS("mix-blend-mode", "normal");
        await expect(photo).toHaveCSS("opacity", "1");
        await expect(photo).toHaveCSS("padding", "0px");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const name = route === "/" ? "home" : "marketplace";
      await page.locator(".discovery-hero").screenshot({ path: info.outputPath(`${name}-hero-${locale}-${width}.png`) });
      await page.locator("#equipment-categories").screenshot({ path: info.outputPath(`${name}-categories-${locale}-${width}.png`) });
    }
  });
}

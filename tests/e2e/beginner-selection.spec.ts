import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`beginner selection, comparison and calculated candidates ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    const noOverflow = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.goto(localizedPath("/", locale));
    const primary = page.locator(".discovery-hero .button-primary");
    await expect(primary).toHaveAttribute("href", localizedPath("/marketplace/find-my-solution", locale));
    expect((await primary.boundingBox())!.y).toBeLessThan(900);
    await expect(page.locator(".hero-model-tile img")).toHaveCount(4);
    for (const img of await page.locator(".hero-model-tile img").all()) {
      await expect(img).toHaveCSS("object-fit", "contain");
      await expect(img).toHaveCSS("filter", "none");
    }
    await noOverflow();
    await page.screenshot({ path: info.outputPath(`home-${locale}-${width}.png`) });
    await primary.focus(); await page.keyboard.press("Enter");
    await page.locator('[data-scenario="essentials"]').click();
    await expect(page.locator('input[type="number"]').first()).toHaveValue("75");
    await page.locator("main>.content-panel>.action-row>button.button-primary").click();
    await page.locator("main>.content-panel>.action-row>button.button-primary").click();
    await expect(page.locator(".finder-results")).toContainText("500 Wh");
    await expect(page.locator(".finder-results .equipment-card")).toHaveCount(4);
    const suppliers = page.locator(".finder-results [data-supplier-product]");
    expect(new Set(await suppliers.evaluateAll(nodes => nodes.map(n => n.getAttribute("data-supplier")))).size).toBe(2);
    for (const link of await suppliers.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener noreferrer/);
      expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
    }
    await noOverflow();
    expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`finder-${locale}-${width}.png`), fullPage: true });
    await page.locator('.finder-results a[href*="/compare?ids="]').click();
    await expect(page.locator(".comparison-scroll thead th")).toHaveCount(5);
    await expect(page.locator(".comparison-scroll [data-supplier-product]")).toHaveCount(4);
    // Verify the actual browser handoff without requesting a merchant page or placing an order.
    const merchant = page.locator(".comparison-scroll [data-supplier-product]").first();
    const destination = (await merchant.getAttribute("href"))!;
    await context.route(destination, route => route.fulfill({ contentType: "text/html", body: "<title>Merchant handoff test</title>" }));
    const opened = context.waitForEvent("page"); await merchant.click();
    const popup = await opened; await expect(popup).toHaveURL(destination); await popup.close();
    await context.unroute(destination);
    await noOverflow();
    await page.screenshot({ path: info.outputPath(`comparison-${locale}-${width}.png`) });
    // A battery result must not recommend 12 V components for a 24 V bank.
    await page.goto(localizedPath("/calculators/battery", locale));
    await expect(page.locator(".battery-candidates [data-supplier-product]")).toHaveCount(0);
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill("100"); await inputs.nth(2).fill("12");
    await expect(page.locator(".battery-candidates [data-supplier-product]")).toHaveCount(2);
    await inputs.nth(0).fill("300");
    await expect(page.locator(".battery-candidates [data-supplier-product]")).toHaveCount(1);
    await expect(page.locator(".battery-candidates [data-supplier-product]")).toHaveAttribute("data-supplier-product", "renogy-mini-200");
    await noOverflow();
    expect(errors).toEqual([]);
  });
}

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localizedPath } from "../../lib/i18n/routing";

const routes = [
  ["home", "/"], ["marketplace", "/marketplace"],
  ["calculator", "/backup-calculator"],
  ["product", "/marketplace/products/renogy-core-mini-100ah"],
  ["renogy", "/renogy"], ["water", "/marketplace/water"],
] as const;

for (const locale of ["ro", "en"] as const) for (const width of [390, 1440]) {
  test(`airy sky palette ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    for (const [name, path] of routes) {
      expect((await page.goto(localizedPath(path, locale)))?.status()).toBe(200);
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(243, 251, 255)");
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f3fbff");
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      // Inspect rendered decorative UI paint, not image pixels or semantic status badges.
      const swampPaint = await page.locator(".marketing-page-background,.background-veil,.commerce-header,.discovery-hero,.equipment-card,.button-primary,.button-outline,.catalog-filters,.page-intro,.glass-panel,.deep-footer").evaluateAll(nodes => {
        const found: string[] = [];
        for (const node of nodes) {
          const css = getComputedStyle(node);
          for (const prop of ["color", "background-color", "background-image", "border-top-color", "box-shadow"]) {
            for (const match of css.getPropertyValue(prop).matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g)) {
              const [,rs,gs,bs,alpha] = match; if (alpha && Number(alpha) < .05) continue;
              const [r,g,b] = [rs,gs,bs].map(Number);
              // Old olive/forest paints have green dominance and visibly less blue.
              if (g > b + 10 && g > r + 5) found.push(`${node.className}: ${prop} ${match[0]}`);
            }
          }
        }
        return found;
      });
      expect(swampPaint, path).toEqual([]);
      for (const img of await page.locator(".product-model-photo img").all()) {
        await expect(img).toHaveCSS("filter", "none"); await expect(img).toHaveCSS("opacity", "1");
      }
      const violations = (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations;
      expect(violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), path).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${name}-${locale}-${width}.png`) });
    }
    expect(errors).toEqual([]);
  });
}

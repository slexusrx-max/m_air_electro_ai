import { localizedPath } from "../../lib/i18n/routing";
import { test, expect } from "@playwright/test";
import { catalog } from "../../lib/affiliate/catalog";
import { expectSupplierCta } from "../supplier-link-expectations";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`supplier links and disclosure stay honest in ${locale} at ${width}px`, async ({ page, context, baseURL }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    const errors: string[] = [], analytics: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("request", r => { if (r.url().includes("plausible.io/api/event")) analytics.push(r.url()); });
    for (const path of ["/marketplace", "/marketplace/products/renogy-core-mini-100ah", "/compare?ids=renogy-mini-100,renogy-mini-200"]) {
      await page.goto(localizedPath(path, locale));
      const links = page.locator("a[data-supplier-product]");
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) {
        const id = await link.getAttribute("data-supplier-product");
        const product = catalog.find(item => item.id === id);
        expect(product, `Known catalog product for supplier link ${id}`).toBeDefined();
        await expectSupplierCta(link, product!, new URL(baseURL!).hostname === "mairelectroai.com");
        await expect(link).toHaveAttribute("data-supplier-language", locale);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    }
    await page.goto(localizedPath("/affiliate-disclosure", locale));
    await expect(page.locator("main")).toContainText(locale === "ro" ? "nu garantează și nu implică recomandarea" : "does not guarantee or imply product endorsement");
    await page.screenshot({ path: info.outputPath(`disclosure-${locale}-${width}.png`), fullPage: true });
    expect(analytics).toEqual([]);
    expect(errors).toEqual([]);
  });
}

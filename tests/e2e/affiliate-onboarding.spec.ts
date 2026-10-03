import { test, expect } from "@playwright/test";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`supplier links and disclosure stay honest in ${locale} at ${width}px`, async ({ page, context }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: page.url() }]);
    const errors: string[] = [], analytics: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("request", r => { if (r.url().includes("plausible.io/api/event")) analytics.push(r.url()); });
    for (const path of ["/marketplace", "/marketplace/products/renogy-core-mini-100ah", "/compare?ids=renogy-mini-100,renogy-mini-200"]) {
      await page.goto(path);
      const links = page.locator("a[data-supplier-product]");
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) {
        expect(await link.getAttribute("href")).toMatch(/^https:\/\/eu\.renogy\.com\//);
        await expect(link).toHaveAttribute("data-tracking-status", "ordinary");
        await expect(link).toHaveAttribute("data-supplier-language", locale);
        expect(await link.getAttribute("rel")).not.toContain("sponsored");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    }
    await page.goto("/affiliate-disclosure");
    await expect(page.locator("main")).toContainText(locale === "ro" ? "nu garantează și nu implică recomandarea" : "does not guarantee or imply product endorsement");
    await page.screenshot({ path: info.outputPath(`disclosure-${locale}-${width}.png`), fullPage: true });
    expect(analytics).toEqual([]);
    expect(errors).toEqual([]);
  });
}

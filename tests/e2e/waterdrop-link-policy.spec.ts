import { test, expect } from "@playwright/test";
import associations from "../fixtures/waterdrop-link-associations.json";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`Waterdrop issued destinations remain intact ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto(`${locale === "en" ? "/en" : ""}/marketplace/water`);
    const links = page.locator('article a[data-supplier-product^="waterdrop-"]');
    await expect(links).toHaveCount(16);
    expect((await links.evaluateAll(nodes => nodes.map(node => node.getAttribute("data-supplier-product")))).sort()).toEqual(associations.entries.map(entry => entry.id).sort());
    let active = 0;
    for (const link of await links.all()) {
      const id = await link.getAttribute("data-supplier-product");
      const expected = associations.entries.find(entry => entry.id === id)!;
      expect(expected, `documented association for ${id}`).toBeDefined();
      const url = new URL((await link.getAttribute("href"))!);
      const tracked = await link.getAttribute("data-tracking-status") === "active";
      if (process.env.TEST_EXPECT_WATERDROP_ACTIVE === "true") {
        await expect(link).toHaveAttribute("data-tracking-status", expected.status);
        await expect(link).toHaveAttribute("href", expected.href);
      } else {
        await expect(link).toHaveAttribute("data-tracking-status", tracked ? "active" : "ordinary");
        await expect(link).toHaveAttribute("href", tracked ? expected.href : expected.ordinary);
      }
      if (id === "waterdrop-k19h") expect(tracked).toBe(false);
      if (tracked) {
        active++;
        expect(url.origin).toBe("https://dewaterdropfilter.pxf.io");
        expect(await link.getAttribute("rel")).toContain("sponsored");
        if (url.searchParams.has("u")) expect(new URL(url.searchParams.get("u")!).origin).toBe("https://www.waterdropfilter.de");
      } else expect(url.origin).toBe("https://www.waterdropfilter.de");
    }
    if (process.env.TEST_EXPECT_WATERDROP_ACTIVE === "true") expect(active).toBe(15);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    // Deliberately never click a merchant or tracking link.
  });
}

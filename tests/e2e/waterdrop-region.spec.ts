import { test, expect } from '@playwright/test';
for (const locale of ['ro','en']) for (const width of [390,1440]) {
  test(`Waterdrop delivery scope ${locale} ${width}`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.route(/https:\/\/(?:[^/]*pxf\.io|www\.waterdropfilter\.de)\//, route => route.abort());
    await page.goto(`${locale === 'en' ? '/en' : ''}/waterdrop`);
    await expect(page.locator('[data-waterdrop-region-notice]')).toContainText(locale === 'ro' ? 'doar pentru Germania' : 'for Germany only');
    const links = page.locator('a[data-supplier="waterdrop-eu"]');
    expect(await links.count()).toBeGreaterThan(15);
    for (const link of await links.all()) {
      await expect(link).toContainText(locale === 'ro' ? 'Magazin DE — doar Germania' : 'DE store — Germany only');
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

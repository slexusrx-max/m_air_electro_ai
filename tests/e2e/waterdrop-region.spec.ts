import { test, expect } from '@playwright/test';
for (const locale of ['ro','en']) for (const width of [390,1440]) {
  test(`Waterdrop delivery scope ${locale} ${width}`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.route(/https:\/\/(?:[^/]*pxf\.io|www\.waterdropfilter\.de)\//, route => route.abort());
    await page.goto(`${locale === 'en' ? '/en' : ''}/waterdrop`);
    await expect(page.locator('[data-waterdrop-region-notice]')).toContainText(locale === 'ro' ? 'doar pentru Germania' : 'for Germany only');
    await expect(page.locator('a[data-supplier="waterdrop-eu"]')).toHaveCount(0);
    const notices = page.locator('[data-supplier="waterdrop-eu"][data-market-status="blocked-romania"]');
    expect(await notices.count()).toBeGreaterThan(15);
    expect(new Set(await notices.evaluateAll(elements => elements.map(element => element.getAttribute('data-supplier-product')))).size).toBe(16);
    for (const notice of await notices.all()) {
      await expect(notice).toHaveAttribute('role', 'note');
      await expect(notice).toHaveAttribute('data-tracking-status', 'disabled');
      expect(await notice.getAttribute('href')).toBeNull();
      await expect(notice).toContainText(locale === 'ro' ? 'nu este disponibilă pentru România' : 'unavailable for Romania');
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

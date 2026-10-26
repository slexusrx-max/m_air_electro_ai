import {test,expect} from '@playwright/test';
for(const width of [390,1440])test(`water comparison repeated selection ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:900}); await page.goto('/en/marketplace/water');
 const cards=page.locator('.product-grid > article');const first=cards.nth(0).locator('.compare-control button');
 await first.click();await expect(first).toHaveAttribute('aria-pressed','true');await first.click();await expect(first).toHaveAttribute('aria-pressed','false');
 await first.click();await cards.nth(3).locator('.compare-control button').click();
 const tray=page.getByRole('complementary',{name:'Products to compare'});await expect(tray.locator('ul')).toBeHidden();
 await tray.getByRole('button',{name:'Show selection'}).click();await expect(tray.locator('li')).toHaveCount(2);
 await tray.getByRole('link',{name:/Compare/}).click();await expect(page).toHaveURL(/\/en\/compare\?ids=/);
 await expect(page.locator('main')).not.toContainText('undefined');await page.goBack();await expect(tray).toBeVisible();
 await page.screenshot({path:info.outputPath('comparison.png'),fullPage:true});
});
for (const width of [390, 1440]) test(`Waterdrop full assortment ${width}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/en/waterdrop');
  await expect(page.locator('.product-grid > article')).toHaveCount(16);
  await page.getByRole('link', { name: 'Compare 16 models' }).click();
  await expect(page).toHaveURL(/#waterdrop-models$/);
  await expect(page.locator('main')).not.toContainText('Compare the 3 models');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const photo of await page.locator('.product-grid article img').all()) {
    await photo.scrollIntoViewIfNeeded();
    expect(await photo.evaluate(async (img: HTMLImageElement) => { await img.decode(); return img.naturalWidth > 0; })).toBe(true);
  }
  await page.screenshot({ path: info.outputPath('waterdrop.png'), fullPage: true });
});
import records from '../../data/waterdrop-reviewed-expansion.json';
import { catalog } from '../../lib/affiliate/catalog';
import { expectSupplierCta } from '../supplier-link-expectations';
test('new Waterdrop model pages preserve exact issued links and ordinary fallbacks', async ({ page, baseURL }) => {
  for (const record of records) {
    await page.goto('/en/marketplace/products/' + record.id);
    await expect(page.locator('h1')).toContainText(record.model);
    const product = catalog.find(item => item.id === record.id)!;
    expect(product.productUrl).toBe(record.url);
    const link = page.locator(`.product-detail [data-supplier-product="${record.id}"]`);
    await expectSupplierCta(link, product, new URL(baseURL!).hostname === 'mairelectroai.com');
    const destination = new URL((await link.getAttribute('href'))!);
    if (destination.searchParams.has('u')) {
      expect(destination.searchParams.get('u')).toBe(record.url);
      expect(destination.searchParams.get('prodsku')).toBe(record.sku);
    }
  }
});

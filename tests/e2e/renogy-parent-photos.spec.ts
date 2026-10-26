import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['ro','en'])for(const width of [360,390,1440])test(`exact feed variants do not inherit unverified parent photos ${locale} ${width}`,async({page},info)=>{
 test.setTimeout(120000);
 const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:800});
 await page.goto(prefix+'/renogy/catalog');await expect(page.locator('main article')).toHaveCount(48);
 await expect(page.locator('[data-parent-photo],main article img')).toHaveCount(0);
 const skus=await page.locator('main article').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-feed-sku')));
 expect(new Set(skus).size).toBe(48);
 await expect(page.locator('main article').first()).toHaveAttribute('data-price-status',/fresh|unavailable/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).include('main').analyze()).violations).toEqual([]);
 await page.locator('main article').first().scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('feed-variant-identities.png')});
});

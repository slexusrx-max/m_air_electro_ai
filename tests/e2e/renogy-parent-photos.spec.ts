import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import photos from '../../data/renogy-parent-photos.json';
for(const locale of ['ro','en'])for(const width of [360,390,1440])test(`parent photographs ${locale} ${width}`,async({page},info)=>{
 test.setTimeout(120000);
 const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:800});
 await page.goto(prefix+'/renogy/catalog');await expect(page.locator('main article')).toHaveCount(72);
 const figures=page.locator('[data-parent-photo]');await expect(figures).toHaveCount(66);
 for(const [url,photo] of Object.entries(photos.entries)){const figure=page.locator(`[data-parent-photo="${url}"]`);if('src' in photo){await expect(figure).toHaveAttribute('data-parent-photo',url);await expect(figure.locator('img')).toHaveAttribute('src',photo.src);await expect(figure.locator('figcaption')).toContainText(locale==='en'?'Representative image':'Imagine de prezentare');}}
 // Scroll each row into view to exercise native lazy loading, without clicking merchant links.
 for(let i=0;i<await figures.count();i++){const img=figures.nth(i).locator('img');await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).include('main').analyze()).violations).toEqual([]);
 await figures.first().scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('parent-photos.png')});
});

import {catalog} from '../../lib/affiliate/catalog';
import {test,expect} from '@playwright/test';
const models=['renogy-mini-100','renogy-mini-200','renogy-panel-200','renogy-inverter-1000'];
for(const width of [390,1440]) for(const locale of ['ro','en']) test(`approved transparent photos ${locale} ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:1000});const prefix=locale==='en'?'/en':'';
 await page.goto(prefix+'/renogy');
 if(process.env.EXPECTED_DEPLOYMENT_SHA)await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute('content',process.env.EXPECTED_DEPLOYMENT_SHA);
 await expect(page.locator('.equipment-card')).toHaveCount(19);
 if(process.env.EXPECTED_DEPLOYMENT_SHA)await expect(page.getByTestId('renogy-tracking-status')).toContainText(locale==='ro'?'18 linkuri Renogy':'18 marked Renogy');
 for(const id of models){const photo=page.locator(`[data-product-photo="${id}"]`);const img=photo.locator('img');await img.scrollIntoViewIfNeeded();expect(decodeURIComponent((await img.getAttribute('src'))!)).toContain(`/product-photos/${id}.png`);await expect.poll(()=>img.evaluate((im:HTMLImageElement)=>im.complete&&im.naturalWidth>0)).toBe(true);await expect(photo).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(img).toHaveCSS('object-fit','contain');await expect(img).toHaveCSS('filter','none');await expect(img).toHaveCSS('mix-blend-mode','normal');await photo.screenshot({path:info.outputPath(`${id}.png`)});}
 await expect(page.getByTestId('product-photo-views-note')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.goto(prefix||'/');for(const id of ['renogy-mini-100','renogy-panel-200','renogy-inverter-1000']){const img=page.locator(`.hero-model-tile [data-product-photo="${id}"] img`);if(await img.count()){await expect(img).toHaveCSS('background-color','rgba(0, 0, 0, 0)');expect(decodeURIComponent((await img.getAttribute('src'))!)).toContain('.png');}}
 await page.screenshot({path:info.outputPath('homepage.png'),fullPage:true});
 for(const id of models){await page.goto(prefix+'/marketplace/products/'+catalog.find(p=>p.id===id)!.slug);const img=page.locator(`.product-illustration [data-product-photo="${id}"] img`);await expect(img).toBeVisible();await expect.poll(()=>img.evaluate((im:HTMLImageElement)=>im.complete&&im.naturalWidth>0)).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
});


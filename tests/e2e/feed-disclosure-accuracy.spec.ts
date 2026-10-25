import {test,expect} from '@playwright/test';
for(const locale of ['ro','en'])for(const width of [360,1440])test(`commercial facts ${locale} ${width}`,async({page},info)=>{
 const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:900});await page.goto(prefix+'/affiliate-disclosure');
 const sections=page.locator('main section.content-panel');await expect(sections.nth(0)).toContainText('Renogy');await expect(sections.nth(0)).toContainText('Waterdrop');await expect(sections.nth(0)).toContainText('PECRON');expect(await sections.nth(0).innerText()).not.toBe(await sections.nth(1).innerText());
 await page.goto(prefix+'/renogy/catalog');await expect(page.locator('main article')).toHaveCount(72);await expect(page.locator('main')).toContainText('155');const card=page.locator('main article').filter({has:page.getByRole('heading',{name:'Solar Adaptor Kit Between Solar Panel And Charge Controller (One Pair)',exact:true})});await expect(card).toContainText(locale==='en'?'10 options / 11 rows':'10 opțiuni / 11 rânduri');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('catalog.png'),fullPage:true});
 await page.goto(prefix+'/marketplace/products/waterdrop-k19h');await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content','M Air Electro AI - independent equipment discovery');
});

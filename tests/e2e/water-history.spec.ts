import { test, expect } from "@playwright/test";
for (const locale of ['ro','en']) for (const width of [390,1440]) {
 test(`water history ${locale} ${width}`,async({page},info)=>{
 const root=(locale==='en'?'/en':'')+'/marketplace/water';
 await page.setViewportSize({width,height:900}); await page.goto(root);
 await expect(page.locator('.product-grid > article')).toHaveCount(16);
 await page.locator(`.water-category-grid a[href="${root}/countertop"]`).click();
 await expect(page.locator('.product-grid > article')).toHaveCount(7);
 await expect(page.locator('#finder')).toHaveCount(0);
 await page.goBack();await expect(page).toHaveURL(new RegExp(root+'$'));
 await page.goForward();await expect(page).toHaveURL(new RegExp(root+'/countertop$'));
 await page.locator('.water-hero a').filter({hasText:locale==='en'?'Find Your':'Găsește'}).click();
 await expect(page).toHaveURL(new RegExp(root+'#finder$'));
 await page.goto(root+'/emergency-off-grid'); await expect(page.locator('.product-grid > article')).toHaveCount(0);
 await expect(page.locator('.water-hero a[href$="/waterdrop"]')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('emergency.png'),fullPage:true});
 });
}

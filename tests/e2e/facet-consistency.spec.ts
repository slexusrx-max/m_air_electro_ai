import {test,expect} from '@playwright/test';
for(const locale of ['ro','en'])for(const width of [390,1440])test(`search facet Apply ${locale} ${width}`,async({page},info)=>{
 const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:900});await page.goto(prefix+'/search?kind=product');
 await page.locator('.filter-options summary').click();
 await expect(page.locator('select[name=format] option[value=portable]')).toHaveCount(1);
 await expect(page.locator('select[name=format] option[value=Portable]')).toHaveCount(0);
 await page.locator('select[name=format]').selectOption('portable');await page.locator('.catalog-filters button[type=submit]').click();
 await expect(page).toHaveURL(/format=portable/);await expect(page.locator('.equipment-card')).toHaveCount(2);
 await page.goto(prefix+'/search?kind=product&format=Portable');await expect(page.locator('.equipment-card')).toHaveCount(2);
 await page.goto(prefix+'/search?kind=product&brand=Waterdrop');await page.locator('.filter-options summary').click();
 await expect(page.locator('select[name=format]')).toHaveCount(0);await expect(page.locator('select[name=voltage]')).toHaveCount(0);
 await page.locator('select[name=technology]').selectOption('UF');await page.locator('.catalog-filters button[type=submit]').click();
 await expect(page.locator('.equipment-card')).toHaveCount(1);await expect(page.locator('.equipment-card h3')).toContainText('UA-UF');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('water-search.png'),fullPage:true});
});

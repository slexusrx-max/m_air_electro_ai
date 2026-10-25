import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['ro','en'])for(const width of [360,390,1440])test(`representative journey ${locale} ${width}`,async({page},info)=>{
 test.setTimeout(120000);const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:747});await page.goto(prefix+'/');
 const mobile=width<1301;const trigger=page.getByRole('button',{name:mobile?(locale==='en'?'Menu':'Meniu'):'Marketplace menu',exact:true});
 await trigger.focus();await page.keyboard.press('Enter');const menu=page.locator(mobile?'#mobile-menu':'#mega-menu');await expect(menu).toBeVisible();
 const water=menu.locator(mobile?':scope > a[href$="/marketplace/water"]':'.mega-water');await water.focus();await expect(water).toBeFocused();expect(await water.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
 await page.keyboard.press('Escape');await expect(menu).toHaveCount(0);await expect(trigger).toBeFocused();await page.keyboard.press('Enter');await water.click();await expect(page).toHaveURL(new RegExp(prefix+'/marketplace/water$'));await expect(menu).toHaveCount(0);
 const root=prefix+'/marketplace/water';await page.locator(`.water-category-grid a[href="${root}/countertop"]`).click();await expect(page.locator('.product-grid > article')).toHaveCount(7);await page.goBack();await expect(page).toHaveURL(new RegExp(root+'$'));await page.goForward();await expect(page).toHaveURL(new RegExp(root+'/countertop$'));
 await page.goto(root);await page.locator('.compare-control button').first().click();const tray=page.locator('.comparison-tray');await expect(tray).toBeVisible();await tray.locator('button[aria-expanded]').click();await tray.locator('li button').click();await expect(tray).toHaveCount(0);
 await page.locator('.compare-control button').nth(0).click();await page.locator('.compare-control button').nth(1).click();await tray.locator('a').click();await expect(page).toHaveURL(/\/compare\?ids=/);await expect(page.locator('.comparison-tray')).toHaveCount(0);await expect(page.locator('main')).toContainText('G3P600');await expect(page.locator('main')).toContainText('G3P800');
 await page.goto(prefix+'/search?kind=product&brand=Waterdrop');await page.locator('.filter-options summary').click();await page.locator('select[name=technology]').selectOption('UF');await page.locator('.catalog-filters button[type=submit]').click();await expect(page.locator('.equipment-card')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);await page.screenshot({path:info.outputPath('journey.png')});
});

import {test,expect} from '@playwright/test';
for(const locale of ['ro','en'])for(const width of [390,1165])test(`reset sync ${locale} ${width}`,async({page})=>{
 const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:747});
 await page.goto(prefix+'/search?kind=product&format=portable&q=Renogy&sort=name');await expect(page.locator('.equipment-card')).toHaveCount(2);
 const form=page.locator('.catalog-filters');await form.locator('> a').click();await expect(page).toHaveURL(new RegExp(prefix+'/search$'));
 await expect(form.locator('select[name=kind]')).toHaveValue('');await expect(form.locator('select[name=format]')).toHaveValue('');await expect(form.locator('input[name=q]')).toHaveValue('');await expect(form.locator('select[name=sort]')).toHaveValue('');
 const resetCount=await page.locator('.equipment-card,.supplier-entry-card').count();expect(resetCount).toBe(24);await expect(page.locator('.catalog-source-summary')).toContainText('365');
 await form.locator('button[type=submit]').click();await expect(page.locator('.equipment-card')).toHaveCount(resetCount);await expect(form.locator('select[name=format]')).toHaveValue('');
 await page.goto(prefix+'/search?kind=product&brand=Waterdrop');await expect(page.locator('.equipment-card')).toHaveCount(16);await form.locator('> a').click();await expect(page).toHaveURL(new RegExp(prefix+'/search$'));await expect(form.locator('select[name=brand]')).toHaveValue('');
 await page.goBack();await expect(page).toHaveURL(/brand=Waterdrop/);await expect(form.locator('select[name=brand]')).toHaveValue('Waterdrop');await expect(page.locator('.equipment-card')).toHaveCount(16);
 await page.goForward();await expect(page).toHaveURL(new RegExp(prefix+'/search$'));await expect(form.locator('select[name=brand]')).toHaveValue('');await expect(form.locator('select[name=kind]')).toHaveValue('');await form.locator('button[type=submit]').click();await expect(page.locator('.equipment-card')).toHaveCount(resetCount);
});

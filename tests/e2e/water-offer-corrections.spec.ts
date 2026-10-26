import { test, expect } from '@playwright/test';
for (const locale of ['ro','en']) for (const width of [390,1440]) test(`water offer and comparison corrections ${locale} ${width}`, async ({page}) => {
 const prefix=locale==='en'?'/en':'';await page.setViewportSize({width,height:900});
 await page.goto(prefix+'/marketplace/water');
 const card=page.locator('article').filter({has:page.getByRole('heading',{name:'Waterdrop K19H',exact:true})});
 await expect(card.locator('dl')).not.toContainText('Feed SKU');
 const finder=page.locator('.water-actions a[href="#finder"]');await expect(finder).toContainText(locale==='ro'?'Găsește':'Find');await finder.click();await expect(page.locator('#finder')).toBeInViewport();
 await page.goto(prefix+'/marketplace/products/waterdrop-k19h');const cta=page.locator('.product-detail [data-supplier-product="waterdrop-k19h"]');await expect(cta).toHaveAttribute('data-tracking-status','ordinary');await expect(cta).toContainText(locale==='ro'?'retras':'Discontinued');
 await expect(page.locator('.product-grid [data-supplier-product]')).toHaveCount(3);
 for (const id of ['waterdrop-a1','waterdrop-c1h','waterdrop-a2']) await expect(page.locator('.product-grid [data-supplier-product="'+id+'"]')).toHaveCount(1);
 await page.goto(prefix+'/compare?ids=waterdrop-k19h,waterdrop-g3p600');
 const row=page.locator('tr').filter({has:page.getByRole('rowheader',{name:locale==='ro'?'Tehnologie':'Technology',exact:true})});await expect(row).toHaveCount(1);await expect(row.locator('td')).toHaveText(['RO','RO']);
 await expect(page.getByRole('rowheader',{name:/Nominal energy|Energie nominala/})).toHaveCount(0);
});

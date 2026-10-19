import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localizedPath } from "../../lib/i18n/routing";
import { brandArtwork } from "../../lib/brand";

for (const locale of ["ro", "en"] as const) for (const [width, height] of [[320,568],[390,844],[430,932],[390,568]]) {
  test(`logo leads mobile home ${locale} ${width}x${height}`, async ({ page }, info) => {
    await page.setViewportSize({width,height});
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    await page.addInitScript(() => {
      Object.assign(window,{brandCls:0});
      new PerformanceObserver(list => { for(const entry of list.getEntries()) {
        const e=entry as PerformanceEntry & {value:number;hadRecentInput:boolean};
        if(!e.hadRecentInput) (window as unknown as {brandCls:number}).brandCls+=e.value;
      }}).observe({type:"layout-shift",buffered:true});
    });
    await page.goto(localizedPath("/",locale));
    const intro=page.locator("[data-mobile-brand-intro]"); const image=intro.locator("img");
    await expect(intro).toBeVisible();
    await expect.poll(()=>image.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
    expect(decodeURIComponent((await image.getAttribute("src"))!)).toContain(brandArtwork.src);
    await expect(image).toHaveCSS("object-fit","contain"); await expect(image).toHaveCSS("filter","none");
    const box=(await image.boundingBox())!; const header=(await page.locator("header").boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(280); expect(Math.abs(box.height-box.width)).toBeLessThan(1);
    expect(box.y).toBeGreaterThanOrEqual(header.y+header.height); expect(box.y+box.height).toBeLessThan(height);
    expect(await page.locator("[data-brand-artwork]:visible").count()).toBe(1);
    await expect(page.locator("footer [data-brand-artwork]")).toBeHidden();
    const notice=page.getByTestId("affiliate-disclosure-before-content"); await expect(notice).toBeVisible();
    expect((await notice.boundingBox())!.y).toBeGreaterThanOrEqual(box.y+box.height);
    expect(await page.evaluate(()=>{
      const notice=document.querySelector('[data-testid="affiliate-disclosure-before-content"]')!;
      return [...document.querySelectorAll('[data-supplier-product]')].every(link=>Boolean(notice.compareDocumentPosition(link)&Node.DOCUMENT_POSITION_FOLLOWING));
    })).toBe(true);
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));});
    expect(await page.evaluate(()=>(window as unknown as {brandCls:number}).brandCls)).toBeLessThan(.1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.screenshot({path:info.outputPath(`opening-${locale}-${width}x${height}.png`)});
    const menu=page.getByRole("button",{name:locale==='ro'?'Meniu':'Menu',exact:true});
    await menu.click(); await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape'); await expect(menu).toBeFocused();
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
    // The change is homepage-only: Marketplace retains its normal footer artwork.
    await page.goto(localizedPath('/marketplace',locale));
    await expect(page.locator('[data-mobile-brand-intro]')).toHaveCount(0);
    await expect(page.locator('footer [data-brand-artwork]')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

import { localizedPath } from "../../lib/i18n/routing";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../lib/affiliate/catalog";
import { productPhoto } from "../../lib/marketplace/product-photos";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`verified model photos and honest fallback ${locale} ${width}`, async ({ page, context, baseURL }, info) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    const label = locale === "ro" ? "Imaginea produsului așteaptă verificarea" : "Product image awaiting verification";
    await page.goto(localizedPath("/search?kind=product", locale));
    const models = catalog.filter(product => product.kind === "product");
    const seen = new Set<string>();
    const pageEvidence: { page: number; models: number; photos: number; supplierAnchors: number; blockedNotices: number }[] = [];
    let catalogPage = 1;
    while (true) {
      const ids = await page.locator('.equipment-card [data-product-photo]').evaluateAll(elements => elements.map(element => element.getAttribute('data-product-photo')!));
      expect(ids.length).toBeGreaterThan(0);
      const pageModels = ids.map(id => {
        const model = models.find(product => product.id === id);
        expect(model, `Unknown model ${id}`).toBeDefined();
        expect(seen.has(id), `Repeated model on pagination: ${id}`).toBe(false);
        seen.add(id);
        return model!;
      });
      const photos = pageModels.filter(product => productPhoto(product)).length;
      const supplierAnchors = pageModels.filter(product => product.provider !== "waterdrop-eu").length;
      const blockedNotices = pageModels.length - supplierAnchors;
      await expect(page.locator(".equipment-card")).toHaveCount(pageModels.length);
      await expect(page.locator(".equipment-card img")).toHaveCount(photos);
      await expect(page.locator(".equipment-card [data-supplier-product]")).toHaveCount(pageModels.length);
      await expect(page.locator(".equipment-card a[data-supplier-product]")).toHaveCount(supplierAnchors);
      await expect(page.locator('.equipment-card [data-supplier="waterdrop-eu"][data-market-status="blocked-romania"]')).toHaveCount(blockedNotices);
      for (const product of pageModels) {
      const visual = page.locator(`[data-product-photo="${product.id}"]`);
      const photo = productPhoto(product);
      if (!photo) {
        await expect(visual).toHaveText(label);
        await expect(visual.locator("img")).toHaveCount(0);
        continue;
      }
      const img = visual.locator("img");
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute("alt", product.name);
      expect(decodeURIComponent((await img.getAttribute("src"))!)).toContain(photo.src);
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      // Current glass wrappers are transparent; the official image bytes stay unchanged.
      await expect(visual).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(img).toHaveCSS("object-fit", "contain");
      }
      if (pageModels.some(product => product.id === 'renogy-panel-200')) await expect(page.getByTestId("product-photo-views-note")).toHaveText(locale === "ro"
        ? "Vedere din fata si din spate a unui singur panou." : "Front and rear views of one panel.");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
      await page.screenshot({ path: info.outputPath(`catalog-${locale}-${width}-${catalogPage}.png`), fullPage: true });
      pageEvidence.push({ page: catalogPage, models: pageModels.length, photos, supplierAnchors, blockedNotices });
      const next = page.locator('.catalog-pagination').getByRole('link', { name: locale === 'ro' ? 'Următor →' : 'Next →', exact: true });
      if (!await next.count()) break;
      const href = await next.getAttribute('href');
      expect(href).toBeTruthy();
      await next.click();
      await expect(page).toHaveURL(new URL(href!, page.url()).href);
      catalogPage++;
      expect(catalogPage).toBeLessThanOrEqual(models.length);
    }
    expect([...seen].sort()).toEqual(models.map(product => product.id).sort());
    expect(pageEvidence.reduce((total, entry) => total + entry.photos, 0)).toBe(models.filter(product => productPhoto(product)).length);
    expect(pageEvidence.reduce((total, entry) => total + entry.supplierAnchors, 0)).toBe(models.filter(product => product.provider !== 'waterdrop-eu').length);
    await info.attach('catalog-photo-pagination.json', { contentType: 'application/json', body: JSON.stringify(pageEvidence, null, 2) });
    for (const id of ["renogy-mini-100", "renogy-mini-200", "renogy-panel-200", "dc-dc-charger-20a", "waterdrop-g3p800"]) {
      const product = catalog.find(product => product.id === id)!;
      await page.goto(localizedPath(`/marketplace/products/${product.slug}`, locale));
      const img = page.locator(`.product-illustration [data-product-photo="${id}"] img`);
      await expect(img).toBeVisible();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      await expect(img).toHaveAttribute("alt", product.name);
      expect((await img.boundingBox())!.height).toBeLessThanOrEqual(productPhoto(product)!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: info.outputPath(`${id}-${locale}-${width}.png`) });
    }
    for (const path of ["/search?q=100+Ah", "/marketplace/batteries"]) {
      await page.goto(localizedPath(path, locale));
      await expect(page.locator(`.equipment-card a[href="${localizedPath("/marketplace/products/lfp-battery-12v-100ah-class", locale)}"]`)).toHaveCount(0);
    }
    expect((await page.goto(localizedPath("/marketplace/products/lfp-battery-12v-100ah-class", locale)))?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(locale === "ro" ? "Clasă baterie" : "battery class");
    await expect(page.locator(".product-detail a[data-supplier-product]")).toHaveCount(0);
  });
}

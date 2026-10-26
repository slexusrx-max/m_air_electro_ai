import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localizedPath } from "../../lib/i18n/routing";
import feed from "../../data/renogy-feed-variants.json";

for (const locale of ["ro", "en"] as const) for (const [width, height] of [[320,568],[360,800],[390,844],[768,1024],[1024,768],[1440,900]]) {
  test(`buyer first viewport and catalogue ${locale} ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await page.goto(localizedPath("/", locale));
    await expect(page.locator("h1")).toBeInViewport({ ratio: 1 });
    await expect(page.locator(".discovery-hero .hero-promise")).toBeInViewport({ ratio: 1 });
    await expect(page.locator(".discovery-hero .button-primary")).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId("affiliate-disclosure-before-content")).toBeInViewport({ ratio: 1 });
    expect(await page.locator('.discovery-hero .button-primary').evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    await expect(page.locator('[data-mobile-brand-intro]')).toHaveCount(0);
    expect(await page.evaluate(() => document.querySelector('.equipment-card')!.compareDocumentPosition(document.querySelector('#equipment-categories')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect((await new AxeBuilder({ page }).include(".discovery-hero").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`home-${width}.png`) });
    await page.goto(localizedPath("/marketplace", locale));
    await expect(page.locator('.discovery-hero')).toHaveCount(0);
    await expect(page.locator('.catalog-filters input[name=q]')).toBeVisible();
    expect(await page.evaluate(() => document.querySelector('.catalog-layout')!.compareDocumentPosition(document.querySelector('#equipment-categories')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`marketplace-${width}.png`) });
  });
}

for (const locale of ["ro", "en"] as const) test(`exact SKU search and source fallback ${locale}`, async ({ page }) => {
  for (const sku of [feed.products[0].sku, "46545423761665", feed.products.at(-1)!.sku]) {
    await page.goto(localizedPath(`/search?q=${sku}`, locale));
    await expect(page.locator('.result-count')).toContainText('1 ');
    await expect(page.locator('.equipment-card,.supplier-entry-card')).toHaveCount(1);
    const raw = page.locator(`[data-feed-sku="${sku}"]`);
    if (await raw.count()) {
      await expect(raw).toContainText('Renogy EU');
      await expect(raw.locator('a[target="_blank"]')).toHaveAttribute('href', /^https:\/\/eu\.renogy\.com\/products\//);
      await expect(raw.locator('a[target="_blank"]')).not.toHaveAttribute('rel', /sponsored/);
      if (await raw.getAttribute('data-price-status') === 'unavailable') await expect(raw).toContainText(locale === 'ro' ? 'Verifică prețul actual' : 'Check current price');
    }
  }
  await page.goto(localizedPath('/search?kind=product&brand=PECRON',locale));
  await expect(page.locator('.product-photo-pending')).toHaveCount(3);
  await expect(page.locator('.product-photo-pending img')).toHaveCount(0);
  await expect(page.locator('.product-photo-pending').first()).toContainText(locale === 'ro' ? 'Imaginea produsului așteaptă verificarea' : 'Product image awaiting verification');
});

test('category comparison blocks cross-family selection and keeps the tray usable', async ({ page }) => {
  await page.setViewportSize({ width:320,height:568 });
  await page.goto('/compare');
  await expect(page.locator('.compare-selectors')).toHaveCount(0);
  await page.locator('select[name=category]').selectOption('lithium-batteries');
  await page.locator('.comparison-form').getByRole('link', { name:'Resetează', exact:true }).click();
  await expect(page.locator('select[name=category]')).toHaveValue('');
  await expect(page.locator('.compare-selectors')).toHaveCount(0);
  await page.locator('select[name=category]').selectOption('lithium-batteries');
  await expect(page.locator('select[name=item1] option[value="renogy-panel-200"]')).toHaveCount(0);
  await page.locator('select[name=item1]').selectOption('renogy-mini-100');
  await page.locator('select[name=item2]').selectOption('renogy-mini-200');
  await page.locator('.comparison-form button[type=submit]').click();
  await expect(page.locator('.comparison-scroll table')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.goto('/compare?ids=renogy-mini-100,renogy-panel-200');
  await expect(page.locator('.comparison-scroll')).toHaveCount(0);
  await expect(page.locator('.safety-note[role=status]')).toBeVisible();
  await page.goto('/marketplace/batteries');
  await page.locator('.equipment-card .compare-control button').first().click();
  await expect(page.locator('.comparison-tray')).toBeInViewport();
  await page.goto('/marketplace/solar/panels');
  await page.locator('.equipment-card .compare-control button').first().click();
  await expect(page.locator('.compare-control [role=status]').first()).toContainText('aceeași categorie');
  await expect(page.locator('.comparison-tray li')).toHaveCount(1);
  await page.locator('.comparison-tray li button').click();
  await expect(page.locator('.comparison-tray')).toHaveCount(0);
});

test('comparison category and draft survive RO/EN language navigation', async ({ page }) => {
  await page.goto('/compare');
  await page.locator('select[name=category]').selectOption('lithium-batteries');
  await page.getByRole('link',{name:'EN',exact:true}).click();
  await expect(page.locator('select[name=category]')).toHaveValue('lithium-batteries');
  await page.locator('select[name=item1]').selectOption('renogy-mini-100');
  await page.getByRole('link',{name:'RO',exact:true}).click();
  await expect(page.locator('select[name=item1]')).toHaveValue('renogy-mini-100');
  await page.locator('select[name=item2]').selectOption('renogy-mini-200');
  await page.locator('.comparison-form button[type=submit]').click();
  await expect(page.locator('.comparison-scroll thead th')).toHaveCount(3);
});

test('grouped account actions retain keyboard focus and Escape dismissal', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/en');
  const menu = page.locator('.account-menu');
  const summary = menu.locator('summary');
  await summary.click();
  await expect(menu.getByRole('link', { name:'Log in', exact:true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
});

test('planning references remain reachable outside the purchase catalog', async ({ page }) => {
  for (const prefix of ['', '/en']) {
    await page.goto(`${prefix}/learn`);
    const references = page.getByTestId('equipment-class-guides');
    await references.locator('summary').click();
    for (const slug of ['portable-panel-200w-class', 'flexible-panel-200w-class', 'essential-load-backup', 'water-system-planning']) {
      await expect(references.locator(`a[href="${prefix}/marketplace/products/${slug}"]`)).toBeVisible();
    }
    await expect(references.locator('[data-supplier-product]')).toHaveCount(0);
  }
});

import { test, expect } from "@playwright/test";
import { catalog } from "../../lib/affiliate/catalog";
import { publicRoutes } from "../../lib/marketplace/routes";

const origin = "https://mairelectroai.com";
const categories = ["solar", "solar/panels", "batteries", "batteries/lifepo4", "inverters"];

for (const locale of ["ro", "en"] as const) {
  const prefix = locale === "en" ? "/en" : "";
  test(`${locale}: category metadata, indexability and reciprocal language links`, async ({ page }) => {
    for (const category of categories) {
      const path = `/marketplace/${category}`;
      expect((await page.goto(prefix + path, { waitUntil: "domcontentloaded" }))?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", origin + prefix + path);
      for (const [language, languagePrefix] of [["ro", ""], ["en", "/en"], ["x-default", ""]]) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute("href", origin + languagePrefix + path);
      }
      // No robots tag means index/follow; do not wait for an optional element.
      expect(await page.locator('meta[name="robots"]').evaluateAll(tags => tags.map(tag => tag.getAttribute("content")).join(" "))).not.toContain("noindex");
      expect((await page.locator('meta[name="description"]').getAttribute("content"))!.length).toBeGreaterThan(70);
      await expect(page.locator("h1")).toHaveCount(1);
      if (locale === "ro" && category === "solar/panels") {
        await expect(page).toHaveTitle(/Panouri solare fotovoltaice: comparație și dimensionare/);
      }
      if (category.startsWith("batteries")) {
        await expect(page).toHaveTitle(locale === "ro" ? /România/ : /Romania/);
        await expect(page.locator("h1")).toContainText(locale === "ro" ? "stocarea energiei" : /storage/i);
        await expect(page.locator("main")).toContainText(locale === "ro" ? "furnizor" : "supplier");
      }
    }
  });

  test(`${locale}: every real model describes an editorial page without invented commercial schema`, async ({ page }) => {
    test.setTimeout(180000);
    for (const product of catalog.filter(p => p.kind === "product")) {
      const path = `${prefix}/marketplace/products/${product.slug}`;
      expect((await page.goto(path, { waitUntil: "domcontentloaded" }))?.status()).toBe(200);
      const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
      const webpage = schemas.find(s => s["@type"] === "WebPage");
      expect(webpage, product.slug).toMatchObject({ url: origin + path, inLanguage: locale });
      expect(webpage.name).toBe(await page.locator("h1").textContent());
      expect(webpage.description).toBe(await page.locator('meta[name="description"]').getAttribute("content"));
      expect(schemas.some(s => s["@type"] === "BreadcrumbList")).toBe(true);
      expect(JSON.stringify(schemas)).not.toMatch(/"@type":"(?:Product|Offer|AggregateOffer|Review|AggregateRating)"/);
    }
  });

  for (const width of [390, 1440]) test(`${locale}: direct category links work without JavaScript at ${width}px`, async ({ browser, baseURL }, info) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(prefix || "/", { waitUntil: "domcontentloaded" });
    await expect.poll(() => page.evaluate(() => Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).every(link => Boolean(link.sheet)) && document.fonts.status === "loaded")).toBe(true);
    const section = page.locator("#equipment-categories");
    const panelLink = section.getByRole("link", { name: locale === "ro" ? "Panouri solare fotovoltaice" : "Photovoltaic solar panels", exact: true });
    await expect(panelLink).toHaveAttribute("href", `${prefix}/marketplace/solar/panels`);
    await expect(section.getByRole("link", { name: locale === "ro" ? "Baterii LiFePO4" : "LiFePO4 batteries", exact: true })).toHaveAttribute("href", `${prefix}/marketplace/batteries/lifepo4`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await section.screenshot({ path: info.outputPath(`categories-${locale}-${width}.png`) });
    await panelLink.click();
    expect(new URL(page.url()).pathname).toBe(`${prefix}/marketplace/solar/panels`);
    await context.close();
  });
}

test("sitemap and robots preserve clean localized discovery and filtered pages remain noindex", async ({ request, page }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  expect(new Set(locations).size).toBe(locations.length);
  expect(locations.length).toBe(new Set(publicRoutes).size * 2);
  for (const product of catalog.filter(p => p.provider === "renogy")) for (const prefix of ["", "/en"]) {
    expect(locations).toContain(`${origin}${prefix}/marketplace/products/${product.slug}`);
  }
  expect(locations.every(url => url.startsWith(origin) && !url.includes("?"))).toBe(true);
  for (const category of categories) for (const prefix of ["", "/en"]) {
    expect(locations).toContain(`${origin}${prefix}/marketplace/${category}`);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(robots).toContain("Allow: /");
  expect(robots).not.toMatch(/Disallow: \/(?:marketplace|en)/);
  await page.goto("/marketplace/batteries?voltage=12");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/marketplace/batteries`);
});

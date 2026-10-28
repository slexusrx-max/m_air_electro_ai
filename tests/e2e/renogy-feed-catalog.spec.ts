import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import variants from "../../data/renogy-feed-variants.json";
import { expectRenogyFeedCta, expectedRenogyFeedLink } from "../supplier-link-expectations";

for (const locale of ["ro", "en"]) for (const width of [390, 1440]) {
  test(`extended Renogy catalog ${locale} ${width}`, async ({ page, baseURL }) => {
    const prefix = locale === "en" ? "/en" : "";
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${prefix}/renogy`, { waitUntil: "domcontentloaded" });
    await page.locator(`a[href="${prefix}/renogy/catalog"]`).click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/renogy/catalog$`));
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    // Client navigation briefly overlaps streamed metadata; require one settled canonical.
    await expect.poll(() => page.locator('link[rel="canonical"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href"))))
      .toEqual([`https://mairelectroai.com${prefix}/renogy/catalog`]);
    await expect.poll(() => page.locator('link[hreflang="en"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href"))))
      .toEqual(["https://mairelectroai.com/en/renogy/catalog"]);
    const cards = page.locator("main article[data-feed-sku]");
    await expect(cards).toHaveCount(48);
    await expect(page.getByText(locale === "ro" ? "365 poziții găsite" : "365 entries found")).toBeVisible();
    const first = variants.products[0];
    const firstCard = cards.filter({ has: page.getByRole("heading", { name: first.name, exact: true }) });
    await expect(firstCard).toHaveAttribute("data-feed-sku", first.sku);
    await expect(firstCard).toHaveAttribute("data-price-status", "unavailable");
    await expectRenogyFeedCta(firstCard.locator("a"), first, new URL(baseURL!).hostname === "mairelectroai.com");
    await page.getByLabel(locale === "ro" ? "Caută după model, variantă sau SKU" : "Search by model, variant or SKU").fill(variants.products[364].sku);
    await page.getByRole("button", { name: locale === "ro" ? "Caută" : "Search" }).click();
    await expect(page.locator("main article[data-feed-sku]")).toHaveCount(1);
    await expect(page.locator("main article[data-feed-sku]")).toHaveAttribute("data-feed-sku", variants.products[364].sku);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
    await page.screenshot({ path: `test-results/renogy-feed-${locale}-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test("all 365 feed rows preserve audited supplier destinations without visiting them", async ({ page, baseURL }, info) => {
  test.setTimeout(120000);
  const production = new URL(baseURL!).hostname === "mairelectroai.com";
  const seen = new Set<string>();
  let trackedCount = 0;
  const sources = new Map(variants.products.map(product => [product.sku, product]));
  const commits = new Set<string>();
  for (let index = 1; index <= Math.ceil(variants.products.length / 48); index++) {
    const response = await page.goto(`/en/renogy/catalog?page=${index}`);
    expect(response?.status()).toBe(200);
    commits.add((await page.locator('meta[name="deployment-commit"]').getAttribute("content")) ?? "unknown");
    const rows = await page.locator("article[data-feed-sku]").evaluateAll(cards => cards.map(card => {
      const link = card.querySelector("a[data-supplier-product]")!;
      return {
        sku: card.getAttribute("data-feed-sku")!, href: link.getAttribute("href"),
        status: link.getAttribute("data-tracking-status"), rel: link.getAttribute("rel"),
        disclosure: link.getAttribute("data-disclosure-status"), price: card.getAttribute("data-price-status"),
      };
    }));
    for (const row of rows) {
      expect(seen.has(row.sku), `Duplicate SKU ${row.sku}`).toBe(false);
      seen.add(row.sku);
      const entry = sources.get(row.sku);
      expect(entry).toBeDefined();
      const expected = expectedRenogyFeedLink(entry!, production);
      expect(row.href).toBe(expected.href);
      expect(row.status).toBe(expected.tracked ? "active" : "ordinary");
      expect(row.disclosure).toBe(expected.tracked ? "labelled" : "not-required");
      expect(row.rel).toBe(expected.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer");
      expect(row.price).toBe("unavailable");
      trackedCount += Number(expected.tracked);
    }
  }
  expect(seen.size).toBe(variants.products.length);
  expect(commits.size, "Deployment must not change mid-audit").toBe(1);
  await info.attach("feed-coverage.json", { contentType: "application/json", body: JSON.stringify({
    checkedAt: new Date().toISOString(), commits: [...commits], uniqueSkus: seen.size,
    tracked: trackedCount, ordinary: seen.size - trackedCount, networkClicksVerified: false,
  }, null, 2) });
});

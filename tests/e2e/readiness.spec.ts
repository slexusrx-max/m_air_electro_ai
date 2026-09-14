import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { publicRoutes } from "../../lib/marketplace/routes";
import { catalog } from "../../lib/affiliate/catalog";
const paths = ["/", "/about", "/contact", "/editorial-policy", "/author-policy", "/corrections-policy", "/ai-use-policy", "/partnerships", "/privacy", "/learn/how-to-size-backup-battery", "/compare?ids=renogy-mini-100,renogy-mini-200", "/marketplace/products/renogy-core-mini-100ah"];
for (const width of [320, 360, 375, 390, 414, 768, 1024, 1440]) {
  test(`affiliate readiness layout and metadata at ${width}px`, async ({ page }, info) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 900 });
    const externalAnalytics: string[] = [];
    page.on("request", request => { if (/plausible\.io|google-analytics\.com/.test(request.url())) externalAnalytics.push(request.url()); });
    for (const [i, path] of paths.entries()) {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      const problems = await page.locator("main input, main textarea, main select, main button").evaluateAll(elements => elements.filter(el => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && (box.x < -1 || box.right > innerWidth + 1 || (el.tagName !== "INPUT" || (el as HTMLInputElement).type !== "checkbox") && box.height < 43);
      }).map(el => el.outerHTML.slice(0, 150)));
      expect(problems).toEqual([]);
      if ([375, 1440].includes(width)) {
        await page.screenshot({ path: info.outputPath(`${i}-${width}.png`), fullPage: true });
        await page.screenshot({ path: info.outputPath(`${i}-${width}-viewport.png`) });
      }
    }
    expect(externalAnalytics).toEqual([]);
  });
}
test("editorial gaps are explicit and new policies are reachable in both languages", async ({ page }) => {
  await page.goto("/learn/how-to-size-backup-battery");
  await expect(page.locator(".editorial-record")).toContainText("Neconfirmat");
  const json = await page.locator('.editorial-record script[type="application/ld+json"]').textContent();
  expect(JSON.parse(json!).dateModified).toBeUndefined();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator(".editorial-record")).toContainText("Unconfirmed");
  await page.goto("/partnerships");
  await expect(page.locator("main")).toContainText("Data being collected");
  await expect(page.locator("main")).toContainText("affiliation not yet approved");
  await page.goto("/contact");
  await expect(page.locator('.contact-form input[name="email"]')).toHaveAttribute("type", "email");
  await page.getByRole("button", { name: "Analytics settings", exact: true }).click();
  await page.getByRole("button", { name: "Reject / withdraw consent", exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mair-analytics-consent-v1")!).choice)).toBe("rejected");
});

test("key public pages meet automated WCAG 2.2 AA checks", async ({ page }, info) => {
  test.setTimeout(240000);
  await page.setViewportSize({width:375,height:900});
  for(const path of ["/", "/contact", "/about", "/partnerships", "/learn/how-to-size-backup-battery", "/compare?ids=renogy-mini-100,renogy-mini-200", "/calculators/battery"]) {
    await page.goto(path);
    const result = await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    await info.attach(path.replace(/[^a-z]/g,"_") + "-axe", {body:JSON.stringify(result.violations),contentType:"application/json"});
    expect(result.violations.map(v => ({id:v.id,nodes:v.nodes.map(n => n.target)}))).toEqual([]);
  }
});

test("all sitemap pages have unique titles and descriptions", async ({ request }) => {
  test.setTimeout(180000);
  const titles = new Map<string, string>(), descriptions = new Map<string, string>();
  for (const path of publicRoutes) {
    const response = await request.get(path);
    expect(response.ok(), path).toBeTruthy();
    const html = await response.text();
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    expect(title, path).toBeTruthy(); expect(description, path).toBeTruthy();
    expect(titles.get(title!), `${path} duplicates title`).toBeUndefined();
    expect(descriptions.get(description!), `${path} duplicates description`).toBeUndefined();
    titles.set(title!, path); descriptions.set(description!, path);
  }
});

test("equipment classes never claim a dated supplier verification", async ({ page }) => {
  test.setTimeout(120000);
  const classes = catalog.filter(p => p.kind === "equipment-class");
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const item of classes) {
      await page.goto(`/marketplace/products/${item.slug}`);
      await expect(page.locator("main")).not.toContainText("Verificare sursă (asistată AI)");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    }
    await page.goto(`/compare?ids=renogy-mini-100,${classes[0].id}`);
    await expect(page.getByRole("cell", { name: "Nu se aplică — clasă de echipament", exact: true })).toBeVisible();
  }
});

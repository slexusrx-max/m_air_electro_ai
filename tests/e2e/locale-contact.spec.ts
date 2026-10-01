import { expectContactState } from "./helpers/contact-state";
import { test, expect } from "@playwright/test";
import { publicRoutes } from "../../lib/marketplace/routes";

test("public metadata follows RO/EN, preserving canonicals and indexing rules", async ({ request }) => {
  test.setTimeout(300000);
  for (const path of [...publicRoutes, "/search?q=solar", "/compare?ids=renogy-mini-100,renogy-mini-200", "/marketplace?brand=Renogy"]) {
    const descriptions: string[] = [];
    for (const locale of ["ro", "en"]) {
      const response = await request.get(path, { headers: { Cookie: `mr-electro-locale=${locale}` } });
      expect(response.status(), `${locale} ${path}`).toBe(200);
      const html = await response.text();
      expect(html, path).toContain(`lang="${locale}"`);
      const description = html.match(/<meta name="description" content="([^"]+)"/);
      expect(description, path).not.toBeNull();
      descriptions.push(description![1]);
      expect(html, path).toContain(`<meta property="og:description" content="${description![1]}"`);
      expect(html, path).toContain(`<meta name="twitter:description" content="${description![1]}"`);
      expect(html, path).toContain(`<meta property="og:locale" content="${locale === "ro" ? "ro_RO" : "en_GB"}"`);
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
      expect(canonical, path).not.toBeNull();
      expect(new URL(canonical![1]).href, path).toBe(new URL(path.split("?")[0], "https://mairelectroai.com").href);
      if (path.includes("?")) expect(html, path).toMatch(/<meta name="robots" content="noindex,\s*follow"/);
    }
    expect(descriptions[0], path).not.toBe(descriptions[1]);
  }
});

for (const width of [390, 430, 768, 1366, 1440]) {
  test(`finder metadata switches language without losing inputs at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/marketplace/find-my-solution?load=500&hours=4");
    await expect(page).toHaveTitle(/Găsește soluția energetică/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /^Dimensionează sistemul energetic/);
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(/Find My Solution/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /^Size an energy system/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_GB");
    await expect(page).toHaveURL(/\/marketplace\/find-my-solution\?load=500&hours=4$/);
    await page.getByRole("button", { name: "RO", exact: true }).click();
    await expect(page).toHaveTitle(/Găsește soluția energetică/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`finder-${width}.png`) });
  });
}

for (const locale of ["ro", "en"]) {
  test(`contact address copies without sending messages in ${locale}`, async ({ page, context, baseURL }, info) => {
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL! });
    const posts: string[] = [];
    await page.route("**/api/contact", route => {
      posts.push(route.request().url());
      return route.abort();
    });
    await page.setViewportSize({ width: locale === "ro" ? 390 : 1440, height: 900 });
    await page.goto("/contact");
    await page.getByRole("button", { name: locale === "ro" ? "Copiază adresa de email" : "Copy email address", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: locale === "ro" ? "Adresa a fost copiată" : "Address copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("contact@mairelectroai.com");
    await expectContactState(page);
    expect(posts).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator(".info-card").first().screenshot({ path: info.outputPath(`contact-${locale}.png`) });
  });

  test(`contact provides manual fallback when clipboard is denied in ${locale}`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new DOMException("Denied", "NotAllowedError"); } } });
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: locale === "ro" ? "Copiază adresa de email" : "Copy email address", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: locale === "ro" ? "Selectează și copiază" : "Select and copy" })).toBeVisible();
    await expect(page.getByRole("link", { name: locale === "ro" ? "Scrie un email" : "Write an email", exact: true })).toHaveAttribute("href", /^mailto:contact@mairelectroai.com\?/);
  });
}

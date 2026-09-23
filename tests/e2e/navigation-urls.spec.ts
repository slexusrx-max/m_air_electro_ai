import { test, expect, type Page } from "@playwright/test";
import { publicRoutes } from "../../lib/marketplace/routes";
import { isMalformedHttpUrl } from "../../lib/site";

async function auditLinks(page: Page) {
  const current = page.url();
  expect(isMalformedHttpUrl(current), current).toBe(false);
  const links = await page.locator("a[href], form[action], button[formaction]").evaluateAll(elements =>
    elements.map(el => ({ text: el.textContent?.trim().slice(0, 80), href: el.getAttribute("href") ?? el.getAttribute("action") ?? el.getAttribute("formaction") ?? "" })),
  );
  for (const { href, text } of links) {
    if (/^(mailto:|tel:)/i.test(href)) continue;
    const label = `${current}: ${text} -> ${href}`;
    expect(isMalformedHttpUrl(href, current), label).toBe(false);
    const url = new URL(href, current);
    if (url.origin === new URL(current).origin) {
      expect(href, label).toMatch(/^(\/(?!\/)|#|\?)/);
    }
  }
  return links.length;
}

for (const locale of ["ro", "en"]) test(`every public page has safe internal navigation in ${locale}`, async ({ page, context, baseURL }, info) => {
  test.setTimeout(300000);
  await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
  const malformedRequests: string[] = [];
  page.on("request", request => {
    if (request.isNavigationRequest() && isMalformedHttpUrl(request.url())) malformedRequests.push(request.url());
  });
  let checked = 0;
  for (const path of [...publicRoutes, "/search?q=100ah", "/compare?ids=renogy-mini-100,renogy-mini-200"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator(".commerce-header .brand-name")).toHaveAttribute("href", "/");
    await expect(page.locator(".deep-footer")).toContainText("Stanislav Zavizion");
    await expect(page.locator("body")).not.toContainText(/M Air Electro AI\s+(?:SRL|LLC|Ltd)\b|\[(?:company name|registered address|tax ID)\]|Your Company Name/i);
    checked += await auditLinks(page);
  }
  expect(malformedRequests).toEqual([]);
  await info.attach("navigation-audit", { body: JSON.stringify({ locale, pages: publicRoutes.length + 2, checked, malformedRequests }), contentType: "application/json" });
});

for (const width of [390, 430, 1440]) test(`logo, menus and language preserve clean navigation at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/marketplace/solar/panels/rigid");
  await page.locator(".commerce-header .brand-name").click();
  await expect(page).toHaveURL(new URL("/", page.url()).href);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  if (width < 1000) {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    for (const summary of await page.locator("#mobile-menu summary").all()) {
      if (await summary.isVisible()) await summary.click();
    }
    await auditLinks(page);
    await page.locator('#mobile-menu a[href="/marketplace"]').click();
  } else {
    for (const trigger of await page.locator("[data-menu-trigger]").all()) {
      if (!await trigger.isVisible()) continue;
      await trigger.click();
      await expect(page.locator("#mega-menu")).toBeVisible();
      await auditLinks(page);
      await page.keyboard.press("Escape");
    }
    await page.locator(".commerce-header").getByRole("link", { name: "Marketplace", exact: true }).click();
  }
  await expect(page).toHaveURL(/\/marketplace$/);
  await auditLinks(page);
  await page.locator(".commerce-header .brand-name").click();
  await expect(page).toHaveURL(new URL("/", page.url()).href);
});

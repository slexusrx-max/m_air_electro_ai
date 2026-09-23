import { test, expect } from "@playwright/test";
import { guides } from "../../lib/marketplace/guides";
const sizes = [[320,568],[360,800],[390,844],[412,915],[430,932],[768,1024],[1024,1366],[1366,768],[1440,900]];
const paths = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/onboarding", "/account", "/dashboard/client", "/dashboard/expert", "/marketplace", "/marketplace/batteries", "/marketplace/solar", "/marketplace/products/renogy-core-mini-100ah", "/marketplace/products/renogy-n-type-200w", "/search?q=100Ah", "/compare?ids=renogy-mini-100,renogy-mini-200", "/marketplace/find-my-solution", "/calculators/battery", "/calculators/solar", "/backup-calculator", "/solutions", `/learn/${guides[0].slug}`, "/experts", "/business", "/contact"];
for (const [width,height] of sizes) test(`responsive pages and images ${width}x${height}`, async ({ page }, info) => {
  test.setTimeout(240000);
  await page.setViewportSize({width,height});
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", r => { if (r.request().resourceType() === "image" && r.status() >= 400) errors.push(`image ${r.status()} ${r.url()}`); });
  for (const [i,path] of paths.entries()) {
    const r = await page.goto(path);
    expect(r?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, i => { i.loading = "eager"; return i.decode().catch(() => {}); })); });
    const issues = await page.evaluate(() => {
      const issues: string[] = [];
      if (document.documentElement.scrollWidth > innerWidth + 1) issues.push(`page overflow ${document.documentElement.scrollWidth}`);
      for (const el of document.querySelectorAll("input:not([type=hidden]),select,textarea,img")) {
        const rect = el.getBoundingClientRect();
        if (!rect.width && !rect.height) { if (el instanceof HTMLImageElement) issues.push("zero-size image"); continue; }
        if (rect.left < -1 || rect.right > innerWidth + 1) issues.push(`${el.tagName} overflow`);
        if (el instanceof HTMLImageElement) {
          if (!el.naturalWidth || rect.width <= 0 || rect.height <= 0) issues.push("invalid image");
          const style = getComputedStyle(el);
          if (style.objectFit === "cover" && !el.closest('[aria-hidden="true"]')) {
            const ratio = (rect.width / rect.height) / (el.naturalWidth / el.naturalHeight);
            if (ratio < .5 || ratio > 2) issues.push("extreme image crop");
          }
          if (!el.hasAttribute("width") && !el.hasAttribute("height") && el.dataset.nimg !== "fill") issues.push("unreserved image dimensions");
        }
      }
      return issues;
    });
    expect(issues,path).toEqual([]);
    if (path.startsWith("/compare?")) {
      const table = page.locator(".comparison-scroll");
      await expect(table).toBeVisible();
      if (width < 768) {
        await table.focus();
        await page.keyboard.press("ArrowRight");
        await expect.poll(() => table.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
      }
    }
    await page.screenshot({path:info.outputPath(`${i}-${width}.png`),fullPage:true});
    await page.screenshot({path:info.outputPath(`${i}-${width}-viewport.png`)});
  }
  expect(errors).toEqual([]);
});
for (const width of [320,360,390,430,1440]) test(`account navigation ${width}`, async ({page},info) => {
  await page.setViewportSize({width,height:sizes.find(size=>size[0]===width)?.[1] ?? 900});
  await page.goto("/");
  const nav = width < 1301 ? page.locator("#mobile-menu") : page.locator(".desktop-account-actions");
  if (width < 1301) await page.getByRole("button",{name:"Meniu",exact:true}).click();
  await expect(nav.getByRole("link",{name:"Autentificare",exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath(`account-menu-${width}.png`)});
  await nav.getByRole("link",{name:"Creează cont",exact:true}).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.locator('input[name="confirmation"]')).toBeVisible();
  if (width < 1301) {
    await page.getByRole("button",{name:"Meniu",exact:true}).click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(page.getByRole("button",{name:"Meniu",exact:true})).toBeFocused();
  }
});
test("saved profile import does not manufacture a saved project", async ({page}) => {
  await page.goto("/marketplace/find-my-solution");
  await page.getByRole("button",{name:"Folosește profilul casei salvat"}).click();
  await expect(page.locator('#main-content [role="alert"]')).toContainText("Nu există un profil energetic salvat valid");
});
test("auth localization, query preservation, private metadata and callback failure", async ({page}) => {
  await page.goto("/login?next=%2Faccount&source=test");
  await page.getByRole("button",{name:"EN",exact:true}).click();
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(page.locator("h1")).toHaveText("Welcome back");
  expect(new URL(page.url()).searchParams.get("next")).toBe("/account");
  expect(new URL(page.url()).searchParams.get("source")).toBe("test");
  for (const path of ["/register","/forgot-password","/reset-password","/account","/dashboard","/onboarding"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  }
  await page.goto("/auth/callback?error=access_denied");
  await expect(page.locator('#main-content [role="alert"]')).toContainText("invalid or expired");
});

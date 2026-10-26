import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { brandArtwork } from "../../lib/brand";
import { localizedPath } from "../../lib/i18n/routing";

for (const locale of ["ro", "en"]) for (const width of [320, 390, 1440]) {
  test(`approved exact artwork and stable brand placements ${locale} ${width}`, async ({ page, request }, info) => {
    test.setTimeout(120000);
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      Object.assign(window, { logoShifts: 0 });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!e.hadRecentInput) (window as unknown as { logoShifts: number }).logoShifts += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(localizedPath("/", locale), { waitUntil: "load" });
    const mark = page.locator("header [data-brand-mark]");
    await expect(mark).toBeVisible();
    await expect(mark.locator("img")).toHaveAttribute("alt", "");
    const frame = await mark.boundingBox();
    expect(frame!.width).toBeLessThanOrEqual(42); expect(frame!.height).toBeLessThanOrEqual(36);
    const image = mark.locator("img");
    await expect(image).toHaveAttribute("loading", "eager");
    await expect.poll(() => image.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
    expect(decodeURIComponent((await image.getAttribute("src"))!)).toContain(brandArtwork.src);
    const delivered = new URL(await image.evaluate((e: HTMLImageElement) => e.currentSrc));
    expect(Number(delivered.searchParams.get("w"))).toBeLessThanOrEqual(256);
    await expect(mark).toHaveCSS("overflow", "hidden");
    await expect(image).toHaveCSS("filter", "none");
    await expect(page.locator(".discovery-hero .button-primary")).toHaveCSS("background-color", "rgb(159, 228, 237)");
    await expect(page.locator(".hero-model-tile img")).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))); });
    expect(await page.evaluate(() => (window as unknown as { logoShifts: number }).logoShifts)).toBeLessThan(0.1);
    await page.screenshot({ path: info.outputPath(`logo-home-${locale}-${width}.png`) });
    const footer = page.locator("footer [data-brand-artwork]");
    await expect(footer).toBeVisible();
    expect((await footer.boundingBox())!.width).toBeGreaterThan(100);
    await expect(page.locator("[data-mobile-brand-intro]")).toHaveCount(0);
    {
      await footer.scrollIntoViewIfNeeded(); await expect(footer.locator("img")).toBeVisible();
      await expect.poll(() => footer.locator("img").evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      await footer.screenshot({ path: info.outputPath(`logo-footer-${locale}-${width}.png`) });
    }
    await page.goto(localizedPath("/about", locale));
    const full = page.locator("main [data-brand-artwork]");
    await full.scrollIntoViewIfNeeded();
    await expect.poll(() => full.locator("img").evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
    await expect(full.locator("img")).toHaveCSS("object-fit", "contain");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`logo-about-${locale}-${width}.png`) });
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    const png = await request.get(brandArtwork.src); expect(png.status()).toBe(200);
    expect(createHash("sha256").update(await png.body()).digest("hex")).toBe(brandArtwork.sha256);
    for (const path of ["/icon", "/apple-icon"]) {
      const icon = await request.get(path); expect(icon.status()).toBe(200); expect(icon.headers()["content-type"]).toContain("image/png");
      if (locale === "ro" && width === 390) writeFileSync(info.outputPath(`${path.slice(1)}.png`), await icon.body());
    }
    const favicon = await request.get("/favicon.ico"); expect(favicon.status()).toBe(200);
    expect((await favicon.body()).subarray(0, 6).toString("hex")).toBe("000001000300");
    const manifest = await request.get("/manifest.webmanifest"); expect(manifest.status()).toBe(200);
    expect((await manifest.json()).icons).toEqual([{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }]);
    expect(errors).toEqual([]);
  });
}

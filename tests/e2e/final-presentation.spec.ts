import { expect, test } from "@playwright/test";
import { rootCategories } from "../../lib/marketplace/content";

const categoryPaths = rootCategories.map((category) => `/marketplace/${category.path}`);
const publicCommercialPaths = [
  "/", "/marketplace", ...categoryPaths,
  "/marketplace/products/renogy-core-mini-100ah",
  "/marketplace/products/renogy-core-mini-200ah",
  "/marketplace/products/renogy-n-type-200w",
  "/solutions", "/solutions/home-backup", "/learn/how-to-size-backup-battery",
];
const filteredPaths = [
  "/search", "/search?q=battery", "/search?q=solar&kind=product",
  "/marketplace?batteryKwh=2.5&inverterKw=1&region=EU",
  ...categoryPaths.map((path) => `${path}?q=renogy`),
  "/marketplace/batteries/lifepo4?voltage=12&capacityAh=100",
  "/marketplace/solar/panels/rigid?power=200",
];

for (const locale of ["ro", "en"] as const) {
  test(`all primary category FAQs open and close by keyboard in ${locale}`, async ({ page, context, baseURL }) => {
    test.setTimeout(120000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    for (const path of categoryPaths) {
      await page.goto(path);
      await expect(page.locator("html"), path).toHaveAttribute("lang", locale);
      const faq = page.locator("main section").filter({
        has: page.getByRole("heading", {
          name: locale === "ro" ? "Întrebări frecvente" : "Frequently asked questions",
          exact: true,
        }),
      });
      const items = faq.locator(":scope > details");
      await expect(items, path).toHaveCount(2);
      for (const item of await items.all()) {
        const summary = item.locator(":scope > summary");
        const answer = item.locator(":scope > p");
        await expect(answer).toBeHidden();
        await summary.focus();
        await page.keyboard.press("Enter");
        await expect(item).toHaveAttribute("open", "");
        await expect(answer).toBeVisible();
        await expect(summary).toBeFocused();
        await page.keyboard.press("Space");
        await expect(item).not.toHaveAttribute("open", "");
        await expect(answer).toBeHidden();
        await expect(summary).toBeFocused();
      }
    }
  });

  test(`commercial pages are indexable and search/filter variants are noindex in ${locale}`, async ({ context, request, baseURL }) => {
    test.setTimeout(180000);
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    // APIRequestContext fixtures do not inherit browser cookies; send the same
    // language explicitly while checking the complete server HTML/headers.
    for (const [paths, noindex] of [[publicCommercialPaths, false], [filteredPaths, true]] as const) {
      for (const path of paths) {
        const response = await request.get(path, { headers: { Cookie: `mr-electro-locale=${locale}` } });
        expect(response.status(), path).toBe(200);
        const html = await response.text();
        expect(html, path).toMatch(new RegExp(`<html[^>]*lang="${locale}"`));
        const tags = html.match(/<meta\b[^>]*\bname=["'](?:robots|googlebot)["'][^>]*>/gi) ?? [];
        const directives = [...tags.map((tag) => tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? ""), response.headers()["x-robots-tag"] ?? ""].join(",");
        expect(/\bnoindex\b/i.test(directives), `${path}: ${directives || "default indexable"}`).toBe(noindex);
        if (noindex) expect(directives, path).toMatch(/\bfollow\b/i);
        const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/)?.[1];
        expect(canonical, path).toBeDefined();
        // Next normalizes the root canonical to the bare origin; URL parsing
        // treats that and the equivalent trailing-slash root consistently.
        expect(new URL(canonical!).href, path).toBe(new URL(path.split("?")[0], "https://mairelectroai.com").href);
      }
    }
  });
}

test("OpenGraph and Twitter metadata resolve to real share images", async ({ page, request, baseURL }) => {
  test.setTimeout(90000);
  const imageUrls = new Set<string>(["/opengraph-image", "/twitter-image"]);
  for (const path of ["/", "/marketplace", "/marketplace/products/renogy-core-mini-100ah"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const tags = page.locator(selector);
      expect(await tags.count(), `${path}: ${selector}`).toBeGreaterThan(0);
      for (const value of await tags.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content")!))) {
        const url = new URL(value);
        expect(url.origin).toBe("https://mairelectroai.com");
        imageUrls.add(`${url.pathname}${url.search}`);
      }
    }
  }
  // Request image paths on the target deployment; local tests must not silently
  // validate an older production image instead of their own build.
  for (const path of imageUrls) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toMatch(/^image\//);
    const bytes = await response.body();
    expect(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), path).toBe(true);
    expect(bytes.readUInt32BE(16), path).toBe(1200);
    expect(bytes.readUInt32BE(20), path).toBe(630);
    await page.evaluate(async (src) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error("Share image is not decodable");
    }, new URL(path, baseURL).href);
  }
});

type PresentationMetrics = {
  layoutShiftSupported: boolean;
  lcpSupported: boolean;
  layoutShifts: { value: number; startTime: number; hadRecentInput: boolean }[];
  largestContentfulPaintMs: number | null;
};

for (const width of [390, 1440]) {
  for (const path of ["/", "/marketplace"]) {
    test(`performance evidence and relevant artwork ${path} at ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        const metrics: PresentationMetrics = {
          layoutShiftSupported: PerformanceObserver.supportedEntryTypes.includes("layout-shift"),
          lcpSupported: PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint"),
          layoutShifts: [],
          largestContentfulPaintMs: null,
        };
        Object.assign(window, { __presentationMetrics: metrics });
        if (metrics.layoutShiftSupported) {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
              metrics.layoutShifts.push({ value: shift.value, startTime: shift.startTime, hadRecentInput: shift.hadRecentInput });
            }
          }).observe({ type: "layout-shift", buffered: true });
        }
        if (metrics.lcpSupported) {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) metrics.largestContentfulPaintMs = entry.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
        }
      });
      await page.goto(path, { waitUntil: "load" });
      await expect(page.locator("h1")).toBeVisible();
      if (path === "/") {
        const hero = page.locator(".brand-hero-art img");
        await expect(hero).toBeVisible();
        await expect(hero).toHaveAttribute("width", "1254");
        await expect(hero).toHaveAttribute("height", "1254");
        expect(await hero.evaluate((image) => new URL((image as HTMLImageElement).currentSrc).searchParams.get("url"))).toBe("/hero.png");
      }
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images).filter((image) => {
          const box = image.getBoundingClientRect();
          return box.bottom > 0 && box.top < innerHeight;
        }).map((image) => image.decode()));
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      });
      const evidence = await page.evaluate(() => {
        const metrics = (window as typeof window & { __presentationMetrics: PresentationMetrics }).__presentationMetrics;
        const resources = (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).map((entry) => ({
          url: entry.name, type: entry.initiatorType, durationMs: entry.duration,
          transferBytes: entry.transferSize, encodedBytes: entry.encodedBodySize, decodedBytes: entry.decodedBodySize,
        }));
        let maximumSession = 0, sessionValue = 0, sessionStart = 0, previousShift = 0;
        for (const shift of metrics.layoutShifts.filter((entry) => !entry.hadRecentInput)) {
          if (shift.startTime - previousShift > 1000 || shift.startTime - sessionStart > 5000) {
            sessionStart = shift.startTime;
            sessionValue = 0;
          }
          sessionValue += shift.value;
          maximumSession = Math.max(maximumSession, sessionValue);
          previousShift = shift.startTime;
        }
        return {
          url: location.href, viewport: { width: innerWidth, height: innerHeight },
          observedUntilMs: performance.now(), ...metrics, cumulativeLayoutShift: maximumSession,
          navigation: performance.getEntriesByType("navigation").map((entry) => entry.toJSON()),
          paint: performance.getEntriesByType("paint").map((entry) => entry.toJSON()),
          resources,
          scripts: resources.filter((entry) => entry.type === "script"),
          images: resources.filter((entry) => entry.type === "img"),
          totalTransferBytes: resources.reduce((sum, entry) => sum + entry.transferBytes, 0),
        };
      });
      await info.attach("performance-evidence.json", {
        contentType: "application/json",
        body: JSON.stringify({
          capturedAt: new Date().toISOString(),
          scope: "Initial navigation until fonts and visible images decode; fresh browser context, origin/CDN caches uncontrolled. Lab sample, not field Core Web Vitals. No artificial speed threshold.",
          ...evidence,
        }, null, 2),
      });
      const requestedAssets = evidence.resources.map((entry) => {
        const url = new URL(entry.url);
        return url.searchParams.get("url") ?? url.pathname;
      });
      expect(requestedAssets.filter((asset) => /green-energy-hero\.png|future-space-energy\.png/.test(asset))).toEqual([]);
      if (path === "/marketplace") expect(requestedAssets).not.toContain("/hero.png");
      expect(evidence.navigation).toHaveLength(1);
      expect(evidence.resources.length).toBeGreaterThan(0);
    });
  }
}

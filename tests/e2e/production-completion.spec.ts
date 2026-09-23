import { test, expect } from "@playwright/test";
import { publicRoutes } from "../../lib/marketplace/routes";
import { visualFamily } from "../../lib/visual-system";

test("all requested searches include equipment and related content", async ({ page }) => {
  test.setTimeout(120000);
  for (const q of ["battery", "12v", "100ah", "2000w", "solar", "inverter", "backup", "RV", "marine", "generator", "MPPT"]) {
    await page.goto(`/search?q=${q}`);
    await expect(page.locator(".equipment-card").first(), q).toBeVisible();
    await expect(page.locator(".search-content .discovery-card").first(), q).toBeVisible();
  }
  await page.goto("/search?q=solar&power=nonexistent");
  await expect(page.locator(".equipment-card")).toHaveCount(0);
  await expect(page.locator(".search-content .discovery-card").first()).toBeVisible();
  await page.goto("/marketplace/products/missing-product");
  await expect(page.locator("h1")).toContainText("Pagina nu a fost găsită");
});

test("comparison removal persists and supplier links remain ordinary EU links", async ({ page }) => {
  await page.goto("/marketplace/batteries");
  for (const n of [0, 1]) await page.locator(".equipment-card").nth(n).getByRole("button", { name: /Compară/ }).click();
  await page.locator(".equipment-card").nth(1).getByRole("link", { name: "Vezi (2) →" }).click();
  await expect(page.locator("table a[href^='https://eu.renogy.com/']")).toHaveCount(2);
  for (const a of await page.locator("table a[href^='https://eu.renogy.com/']").all()) {
    expect(new URL((await a.getAttribute("href"))!).search).toBe("");
    await expect(a).toHaveAttribute("target", "_blank");
  }
  await page.getByRole("link", { name: "Elimină", exact: true }).first().click();
  await expect(page.locator("table")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("mair-compare")?.split(",").length)).toBe(1);
  await page.goto("/marketplace/batteries");
  await expect(page.getByRole("button", { name: /Compară/, pressed: true })).toHaveCount(1);
  await page.goto("/compare?ids=invalid,invalid");
  await expect(page.getByRole("status")).toContainText("cel puțin două");
});

test("finder back, budget validation, recalculation and no-region empty state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/marketplace/find-my-solution");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByLabel("Buget orientativ").fill("-1");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await expect(page.locator("#main-content [role=alert]")).toContainText("Bugetul");
  await page.getByLabel("Buget orientativ").fill("500");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByRole("button", { name: "Calculează sistemul", exact: true }).click();
  await expect(page.locator(".finder-results")).toBeFocused();
  await expect(page.locator(".finder-results")).toContainText("1400 Wh");
  await expect(page.locator(".finder-results a[href='/marketplace/batteries']")).toContainText("Acumulatoare");
  await page.getByRole("button", { name: "Înapoi", exact: true }).click();
  await page.getByLabel("Ore de rezervă").fill("8");
  await expect(page.locator(".finder-results")).toHaveCount(0);
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByRole("button", { name: "Calculează sistemul", exact: true }).click();
  await expect(page.locator(".finder-results")).toContainText("2800 Wh");
  await page.getByRole("button", { name: "Înapoi", exact: true }).click();
  await page.getByRole("button", { name: "Înapoi", exact: true }).click();
  await page.getByLabel("Regiune").selectOption("US");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByRole("button", { name: "Calculează sistemul", exact: true }).click();
  await expect(page.getByRole("link", { name: "Compară opțiunile" })).toHaveCount(0);
  await expect(page.locator(".finder-results")).toContainText("Nu există catalog");
});

for (const locale of ["ro", "en"]) test(`every calculator responds and validates in ${locale}`, async ({ page, context, baseURL }) => {
  test.setTimeout(120000);
  await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
  for (const slug of ["battery", "solar", "cable-sizing", "voltage-drop", "generator", "motor-current", "breaker-selection", "fuse-selection", "transformer"]) {
    await page.goto(`/calculators/${slug}`);
    const main = page.locator("#main-content");
    const input = main.locator('input[type="number"]').first();
    const original = await input.inputValue();
    const before = await main.innerText();
    await input.fill(String(Number(original) * .8));
    await expect.poll(() => main.innerText()).not.toBe(before);
    await input.fill("0");
    await expect(main).toContainText(locale === "ro" ? "Introdu" : "Enter");
    for (const value of ["-1", "1e308"]) {
      await input.fill(value);
      expect(await main.innerText(), slug).not.toMatch(/NaN|Infinity|∞/);
    }
    await input.fill(original);
    await expect(main).not.toContainText(locale === "ro" ? "Introdu valori pozitive" : "Enter valid positive");
  }
});

for (const width of [390, 430, 768, 1366, 1440]) test(`page-family artwork, brand and reduced motion ${width}px`, async ({ page }, info) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/marketplace", "/marketplace/solar", "/marketplace/batteries", "/marketplace/inverters", "/marketplace/backup-power", "/marketplace/generators", "/marketplace/ev-charging", "/marketplace/marine", "/marketplace/industrial", "/solutions", "/calculators", "/learn", "/experts", "/business", "/about"]) {
    await page.goto(path);
    await expect(page.locator("[data-visual-family]")).toHaveAttribute("data-visual-family", visualFamily(path));
    if (path === "/") {
      await expect(page.locator(".brand-hero-art img")).toBeVisible();
      expect(await page.locator(".discovery-hero").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`${path.replaceAll("/", "_") || "home"}-${width}.png`) });
  }
});

test("canonical host, structured data, robots and manifest agree", async ({ request, baseURL }) => {
  test.setTimeout(120000);
  const origin = "https://mairelectroai.com";
  for (const path of publicRoutes) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    expect(canonical, path).not.toBeNull();
    expect(new URL(canonical![1]).href, path).toBe(new URL(path, origin).href);
    expect(html.includes("https://m-air-electro-ai.vercel.app"), path).toBe(false);
  }
  expect(await (await request.get("/robots.txt")).text()).toContain(`${origin}/sitemap.xml`);
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.theme_color).toBe("#edf5e9");
  const www = await request.get(baseURL?.startsWith("http://localhost") ? "/marketplace/solar?q=test" : "https://www.mairelectroai.com/marketplace/solar?q=test", {
    maxRedirects: 0,
    ...(baseURL?.startsWith("http://localhost") ? { headers: { host: "www.mairelectroai.com" } } : {}),
  });
  expect([301, 308]).toContain(www.status());
  expect(www.headers().location).toBe(`${origin}/marketplace/solar?q=test`);
});

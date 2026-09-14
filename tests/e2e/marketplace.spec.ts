import { test, expect } from "@playwright/test";
import { categories } from "../../lib/marketplace/content";
import { solutions } from "../../lib/marketplace/solutions";
import { guides } from "../../lib/marketplace/guides";
import { catalog } from "../../lib/affiliate/catalog";
import { publicRoutes, legacyRedirects } from "../../lib/marketplace/routes";
test("RO/EN switching preserves the deep route and desktop menu works by keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/marketplace/solar/panels/rigid");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\/marketplace\/solar\/panels\/rigid$/);
  await page
    .getByRole("button", { name: "Equipment menu", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#mega-menu")).toBeVisible();
  await page
    .locator("#mega-menu")
    .getByRole("link", { name: "Portable solar panels", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Portable solar panels",
  );
  await page
    .getByRole("button", { name: "Equipment menu", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mega-menu")).toHaveCount(0);
});
for (const width of [320, 360, 390, 430, 768])
  test(`nested mobile navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: /Meniu/ }).click();
    const nav = page.locator("#mobile-menu");
    await nav
      .locator(":scope > details")
      .filter({ has: page.locator("summary", { hasText: /^Echipamente$/ }) })
      .locator(":scope > summary")
      .click();
    const solar = nav
      .locator("details details")
      .filter({
        has: page.locator("summary", { hasText: /^Echipamente solare$/ }),
      });
    await solar.locator(":scope > summary").click();
    await solar
      .getByRole("link", { name: "Panouri solare portabile", exact: true })
      .click();
    await expect(page).toHaveURL(/\/marketplace\/solar\/panels\/portable$/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
  });
test("search, filters, no results and comparison flow", async ({ page }) => {
  await page.goto("/search?q=100Ah");
  await expect(page.locator(".equipment-card")).toHaveCount(2);
  await page.getByLabel("Tip înregistrare").selectOption("product");
  await page.getByRole("button", { name: "Aplică filtrele" }).click();
  await expect(page.locator(".equipment-card")).toHaveCount(1);
  await page.goto("/marketplace/batteries");
  const cards = page.locator(".equipment-card");
  await cards
    .nth(0)
    .getByRole("button", { name: "Compară", exact: false })
    .click();
  await cards
    .nth(1)
    .getByRole("button", { name: "Compară", exact: false })
    .click();
  await cards.nth(1).getByRole("link", { name: "Vezi (2) →" }).click();
  await expect(page.locator("table")).toBeVisible();
  await expect(page.locator("thead th")).toHaveCount(3);
  await page.goto("/search?q=impossible987654");
  await expect(
    page.getByText("Nicio potrivire în catalog", { exact: true }),
  ).toBeVisible();
});
test("solution finder rejects invalid inputs and returns transparent equipment recommendations", async ({
  page,
}) => {
  await page.goto(
    "/marketplace/find-my-solution?application=rv-caravan&load=250&hours=4",
  );
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByLabel("Consum simultan (W)").fill("0");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await expect(page.locator(".safety-note[role=alert]")).toBeVisible();
  await page.getByLabel("Consum simultan (W)").fill("250");
  await page.getByLabel("Vârf de pornire (W)").fill("500");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page
    .getByRole("button", { name: "Calculează sistemul", exact: true })
    .click();
  await expect(page.getByText("1400 Wh", { exact: true })).toBeVisible();
  await expect(page.getByText("400 W", { exact: true }).first()).toBeVisible();
  await expect(
    page.locator(".finder-results .equipment-card").first(),
  ).toBeVisible();
});
test("solar calculator, battery calculator and backup hours change results", async ({
  page,
}) => {
  await page.goto("/calculators/solar");
  await expect(page.locator(".calculation-result strong")).toContainText(
    "1.143 W",
  );
  await page.getByLabel("Consum zilnic (Wh)").fill("0");
  await expect(page.locator(".calculation-result")).toContainText(
    "Introdu valori pozitive",
  );
  await page.goto("/calculators/battery");
  await page.getByLabel("Puterea consumatorilor (W)").fill("250");
  await expect(page.getByText("1,358.7 Wh", { exact: true })).toBeVisible();
  await page.goto("/backup-calculator");
  const before = await page.getByTestId("backup-nominal").innerText();
  await page
    .getByTestId("appliance")
    .nth(1)
    .getByLabel("Ore de funcționare")
    .fill("1");
  const after = await page.getByTestId("backup-nominal").innerText();
  expect(after).not.toEqual(before);
  await expect(
    page.getByRole("link", {
      name: "Găsește echipamente potrivite",
      exact: true,
    }),
  ).toHaveAttribute("href", /batteryKwh=/);
});
test("all catalog, solution and article routes have H1, canonical and no runtime errors", async ({
  page,
}) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of [
    ...categories.map((c) => `/marketplace/${c.path}`),
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...guides.map((g) => `/learn/${g.slug}`),
    ...catalog.map((p) => `/marketplace/products/${p.slug}`),
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute(
      "href",
      new RegExp(path + "$"),
    );
  }
  expect(errors).toEqual([]);
});
test("sitemap excludes private pages, legacy routes redirect, unknown page is 404", async ({
  request,
  page,
}) => {
  test.setTimeout(120000);
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of publicRoutes) expect(xml).toContain(`${path}</loc>`);
  for (const path of [
    "/account",
    "/login",
    "/search",
    "/compare",
    "/ukraine-energy",
  ])
    expect(xml).not.toContain(`${path}</loc>`);
  for (const [path, target] of Object.entries(legacyRedirects)) {
    const r = await request.get(path, { maxRedirects: 0 });
    expect([307, 308]).toContain(r.status());
    expect(r.headers().location).toBe(target);
  }
  const response = await page.goto("/marketplace/no-such-category");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Pagina nu a fost găsită");
});
for (const width of [1440, 1366, 768, 390])
  test(`visual coverage and no overflow at ${width}px`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    for (const [name, path] of [
      ["home", "/"],
      ["category", "/marketplace/batteries"],
      ["product", "/marketplace/products/renogy-core-mini-100ah"],
      ["solution", "/solutions/home-backup"],
      ["article", "/learn/how-to-size-backup-battery"],
      ["calculator", "/backup-calculator"],
    ]) {
      await page.goto(path);
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        path,
      ).toBeTruthy();
    }
    if (width >= 1100) {
      await page
        .getByRole("button", { name: "Echipamente menu", exact: true })
        .click();
      await page.screenshot({
        path: testInfo.outputPath(`mega-${width}.png`),
        fullPage: false,
      });
    }
    expect(errors).toEqual([]);
  });

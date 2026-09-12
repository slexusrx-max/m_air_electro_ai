import { test, expect } from "@playwright/test";
const categories = [
  "lithium-batteries",
  "inverters",
  "solar-panels",
  "solar-kits",
  "charge-controllers",
  "battery-chargers",
  "backup-power",
  "electrical-accessories",
];
test.beforeEach(async ({ page }) => {
  page.on("pageerror", (e) => {
    throw e;
  });
});
test("homepage, header/footer navigation and marketplace category cards", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await expect(page.locator("h1")).toBeVisible();
  const links = await page
    .locator("header a,footer a")
    .evaluateAll((els) =>
      els
        .map((e) => e.getAttribute("href"))
        .filter((x): x is string => !!x && x.startsWith("/")),
    );
  for (const href of [...new Set(links)]) {
    await page.goto("/");
    const link = page
      .locator("header a,footer a")
      .filter({ visible: true })
      .filter({ hasText: /./ })
      .all();
    let clicked = false;
    for (const a of await link) {
      if ((await a.getAttribute("href")) === href) {
        await a.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      await page.getByRole("button", { name: "Deschide meniul" }).click();
      await page
        .locator('header a[href="' + href + '"]')
        .filter({ visible: true })
        .click();
    }
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(href === "/" ? "/$" : href + "$"));
    await expect(page.locator("body")).not.toContainText(
      /Application error|coming soon|placeholder|lorem ipsum/i,
    );
  }
  await page.goto("/marketplace");
  for (const category of categories) {
    const href = "/marketplace/category/" + category;
    await page.locator('main a[href="' + href + '"]').click();
    await expect(page).toHaveURL(new RegExp(href + "$"));
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.locator('a[href^="/marketplace/products/"]').count(),
    ).toBeGreaterThan(0);
    await page.goBack();
  }
});
test("finder validates, calculates repeatedly, focuses result and recalculates changed values", async ({
  page,
}) => {
  await page.goto("/marketplace/find-my-solution");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page.getByLabel("Sarcină continuă (W)", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await expect(page.locator("#content").getByRole("alert")).toBeVisible();
  await page.getByLabel("Sarcină continuă (W)", { exact: true }).fill("500");
  await page.getByLabel("Putere de vârf (W)", { exact: true }).fill("1000");
  await page.getByLabel("Autonomie dorită (ore)", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Ai panouri solare?", exact: true })
    .selectOption("yes");
  await page
    .getByRole("button", { name: "Calculează soluția", exact: true })
    .click();
  await expect(page.getByTestId("finder-results")).toBeVisible();
  await expect(page.getByTestId("finder-results")).toBeFocused();
  await expect(page.getByTestId("result-battery")).toHaveText("2,72 kWh");
  await expect(page.getByTestId("result-inverter")).toHaveText("700 W");
  await expect(page.getByTestId("result-solar")).toHaveText("800 W");
  await page
    .getByRole("button", { name: "Calculează soluția", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("revizia 2");
  await page.getByRole("button", { name: "Înapoi", exact: true }).click();
  await page.getByLabel("Autonomie dorită (ore)", { exact: true }).fill("8");
  await page.getByRole("button", { name: "Continuă", exact: true }).click();
  await page
    .getByRole("button", { name: "Calculează soluția", exact: true })
    .click();
  await expect(page.getByTestId("result-battery")).toHaveText("5,44 kWh");
  await page
    .getByRole("link", {
      name: "Găsește echipamente pentru acest necesar",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Necesarul tău a fost preluat" }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get("batteryKwh")).toBe("5.44");
});
test("backup edits power/quantity/hours, adds custom device and transfers valid requirements", async ({
  page,
}) => {
  await page.goto("/backup-calculator");
  const first = page.getByTestId("appliance").first();
  await expect(page.getByTestId("backup-continuous")).toHaveText("245 W");
  await first.getByLabel("Putere (W)", { exact: true }).fill("100");
  await expect(page.getByTestId("backup-continuous")).toHaveText("330 W");
  await first.getByLabel("Cantitate", { exact: true }).fill("2");
  await expect(page.getByTestId("backup-continuous")).toHaveText("430 W");
  await first.getByLabel("Ore de funcționare", { exact: true }).fill("1");
  await expect(page.getByTestId("backup-energy")).toHaveText("1,28 kWh");
  await page
    .getByRole("button", { name: "Adaugă aparat", exact: true })
    .click();
  await expect(page.getByTestId("appliance")).toHaveCount(6);
  await expect(page.getByTestId("backup-continuous")).toHaveText("530 W");
  await page
    .getByTestId("appliance")
    .last()
    .getByLabel("Putere (W)", { exact: true })
    .fill("0");
  await expect(page.locator("#content").getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Găsește echipamente potrivite" }),
  ).toHaveCount(0);
  await page
    .getByTestId("appliance")
    .last()
    .getByLabel("Putere (W)", { exact: true })
    .fill("200");
  await expect(page.getByTestId("backup-continuous")).toHaveText("630 W");
  await page
    .getByRole("link", { name: "Găsește echipamente potrivite", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Necesarul tău a fost preluat" }),
  ).toBeVisible();
  const q = new URL(page.url()).searchParams;
  expect(Number(q.get("batteryKwh"))).toBeGreaterThan(0);
  expect(q.get("region")).toBe("RO");
});
test("language, mobile menu, legal pages and overflow", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Deschide meniul" }).click();
    await expect(
      page.getByRole("navigation", { name: "Navigare mobilă" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Navigare mobilă" })
      .getByRole("link", { name: "Contact", exact: true })
      .click();
    await expect(
      page.getByRole("navigation", { name: "Navigare mobilă" }),
    ).toHaveCount(0);
  }
  await page.getByLabel("Limba", { exact: true }).selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("footer")).toContainText("Affiliate Disclosure");
  await page.getByLabel("Language", { exact: true }).selectOption("ro");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  for (const route of [
    "/",
    "/marketplace",
    "/marketplace/find-my-solution",
    "/backup-calculator",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
    "/knowledge-base",
    "/calculators",
  ]) {
    const r = await page.goto(route);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBeTruthy();
    await expect(page.locator("body")).not.toContainText(
      /[А-Яа-яІіЇїЄє]|coming soon|placeholder|lorem ipsum|protected marketplace/,
    );
    expect(await page.locator('a[href="#"]').count()).toBe(0);
  }
  await page.goto("/contact");
  await expect(
    page
      .locator(
        'main a[href^="mailto:"], main a[href="https://github.com/slexusrx-max/m_air_electro_ai/issues/new"]',
      )
      .first(),
  ).toBeVisible();
});

test("all catalog detail pages have original content, valid ordinary supplier links and honest schema", async ({
  page,
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => p.startsWith("/marketplace/products/"));
  expect(routes).toHaveLength(11);
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Limite și compatibilitate",
        exact: true,
      }),
    ).toBeVisible();
    const source = page.locator(
      'main a[target="_blank"][href^="https://eu.renogy.com/"]',
    );
    await expect(source).toHaveCount(1);
    const href = await source.getAttribute("href");
    expect(new URL(href!).search).toBe("");
    expect(await source.getAttribute("rel")).not.toContain("sponsored");
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    for (const text of schemas) {
      const s = JSON.parse(text);
      expect(s.offers).toBeUndefined();
      expect(s.aggregateRating).toBeUndefined();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
  }
});

test("keyboard skip link and mobile Escape preserve focus", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator("#site-language")).toBeEnabled();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Sari la conținut", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#content")).toBeFocused();
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Deschide meniul" }).click();
    await page
      .getByRole("navigation", { name: "Navigare mobilă" })
      .getByRole("link")
      .first()
      .focus();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Deschide meniul" }),
    ).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Navigare mobilă" }),
    ).toHaveCount(0);
  }
});

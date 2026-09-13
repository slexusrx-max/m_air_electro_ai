import { test, expect } from "@playwright/test";
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
  await expect(page.locator("#main-content").getByRole("alert")).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Cerințe primite din calculator" })).toBeVisible();
  const q = new URL(page.url()).searchParams;
  expect(Number(q.get("batteryKwh"))).toBeGreaterThan(0);
  expect(q.get("region")).toBe("RO");
});

test("legacy product URLs preserve models, schema and supplier disclosure", async ({
  page,
  request,
}) => {
  for (const [old, current] of [
    ["lfp-battery-12v-100ah", "renogy-core-mini-100ah"],
    ["solar-panel-200w", "renogy-n-type-200w"],
    ["renogy-inverter-1000w", "renogy-pure-sine-1000w"],
  ]) {
    const response = await request.get("/marketplace/products/" + old, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(
      "/marketplace/products/" + current,
    );
  }
  await page.goto("/marketplace/products/renogy-core-mini-100ah");
  const supplier = page.locator(
    'main a.button-primary[href^="https://eu.renogy.com/"]',
  );
  await expect(supplier).toBeVisible();
  expect(new URL((await supplier.getAttribute("href"))!).search).toBe("");
  expect(await supplier.getAttribute("rel")).not.toContain("sponsored");
  for (const raw of await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()) {
    const data = JSON.parse(raw);
    expect(data.offers).toBeUndefined();
    expect(data.aggregateRating).toBeUndefined();
  }
  await expect(page.locator(".supplier-disclosure")).toContainText(
    "fără urmărire afiliată",
  );
});
test("keyboard skip link reaches the main content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

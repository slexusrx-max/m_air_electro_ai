import { test, expect } from "@playwright/test";
import { catalog } from "../../lib/affiliate/catalog";
import { filterEquipment } from "../../lib/marketplace/query";

const calculators = ["battery", "solar", "cable-sizing", "voltage-drop", "generator", "motor-current", "transformer", "breaker-selection", "fuse-selection"];

for (const slug of calculators) test(`${slug}: every numeric field validates and every selector works`, async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(`/calculators/${slug}`);
  const main = page.locator("#main-content");
  const inputs = main.locator('input[type="number"]');
  for (const input of await inputs.all()) {
    const original = await input.inputValue();
    for (const value of ["", "-1", "1e308", "1e309"]) {
      await input.fill(value);
      if (slug === "solar") await expect(main.locator(".calculation-result")).toContainText("Introdu valori pozitive");
      else await expect(main.getByRole("alert")).toBeVisible();
      expect(await main.innerText()).not.toMatch(/NaN|Infinity|∞/);
    }
    await input.fill(original);
    await expect(main.getByRole("alert")).toHaveCount(0);
  }
  for (const select of await main.locator("select").all()) {
    const original = await select.inputValue();
    for (const option of await select.locator("option").all()) {
      await select.selectOption((await option.getAttribute("value"))!);
      expect(await main.innerText()).not.toMatch(/NaN|Infinity|∞/);
    }
    await select.selectOption(original);
  }
  await expect(main.locator('[aria-live="polite"]').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("zero motor load, reserve, protection margins and transformer load calculate successfully", async ({ page }) => {
  for (const [slug, labels] of [
    ["generator", ["Motorul cel mai mare (kW)", "Rezervă de funcționare (%)"]],
    ["breaker-selection", ["Rezervă suplimentară (%)"]],
    ["fuse-selection", ["Rezervă suplimentară (%)"]],
    ["transformer", ["Încărcare de funcționare estimată (%)"]],
  ] as const) {
    await page.goto(`/calculators/${slug}`);
    // Use the zero-minimum controls, whose labels remain separately covered by localization tests.
    const inputs = page.locator('#main-content input[type="number"][min="0"]');
    await expect(inputs).toHaveCount(labels.length);
    for (const input of await inputs.all()) await input.fill("0");
    await expect(page.locator("#main-content").getByRole("alert")).toHaveCount(0);
    expect(await page.locator("#main-content").innerText()).not.toMatch(/NaN|Infinity|∞/);
  }
});

test("backup validates all quantity fields, removes custom loads and recovers after invalid settings", async ({ page }) => {
  await page.goto("/backup-calculator");
  const first = page.getByTestId("appliance").first();
  for (const label of ["Putere (W)", "Cantitate", "Ore de funcționare", "Multiplicator pornire"]) {
    const input = first.getByLabel(label, { exact: true });
    const original = await input.inputValue();
    for (const value of ["", "0", "-1", "1e308", "1e309", ...(label === "Cantitate" ? ["1.5"] : [])]) {
      await input.fill(value);
      await expect(page.locator("#main-content").getByRole("alert")).toBeVisible();
      await expect(page.getByTestId("backup-results")).toHaveCount(0);
    }
    await input.fill(original);
    await expect(page.getByTestId("backup-results")).toBeVisible();
  }
  await page.getByRole("button", { name: "Adaugă aparat", exact: true }).click();
  const custom = page.getByTestId("appliance").last();
  await custom.getByLabel("Denumire", { exact: true }).fill("");
  await expect(page.locator("#main-content").getByRole("alert")).toBeVisible();
  await custom.getByRole("button", { name: "Elimină", exact: true }).click();
  await expect(page.getByTestId("appliance")).toHaveCount(5);
  await expect(page.getByTestId("backup-results")).toBeVisible();
  for (const input of await page.getByTestId("appliance").getByRole("checkbox").all()) await input.uncheck();
  await expect(page.locator("#main-content").getByRole("alert")).toContainText("Activează cel puțin un aparat");
  await first.getByRole("checkbox").check();
  await expect(page.getByTestId("backup-continuous")).toHaveText("15 W");
});

test("all required searches show accurate counts, preserve queries and handle diacritics and special characters", async ({ page }) => {
  test.setTimeout(120000);
  for (const q of ["battery", "12v", "100ah", "2000w", "solar", "inverter", "backup", "rv", "marine", "generator", "mppt", "renogy", "încărcare", "protecție", '<script>missing-123456789</script>']) {
    await page.goto(`/search?${new URLSearchParams({ q })}`);
    const count = filterEquipment(catalog, { q }).length;
    await expect(page.locator(".equipment-card")).toHaveCount(count);
    await expect(page.locator(".result-count")).toContainText(`${count} rezultate`);
    await expect(page.locator('.catalog-filters input[name="q"]')).toHaveValue(q);
    for (const link of await page.locator('.equipment-card a[href^="/marketplace/products/"]').all()) await expect(link).toHaveAttribute("href", /^\/marketplace\/products\/[a-z0-9-]+$/);
  }
  const q = "100 Ah";
  await page.goto(`/search?${new URLSearchParams({ q })}`);
  await page.getByRole("button", { name: "Aplică filtrele", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("q")).toBe(q);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(new URL(page.url()).searchParams.get("q")).toBe(q);
  await expect(page.locator('.catalog-filters input[name="q"]')).toHaveValue(q);
});

test("comparison supports 2–4 records, maximum selection, shareable URL, removal and back navigation", async ({ page }) => {
  await page.goto("/search");
  const controls = page.locator(".equipment-card .compare-control");
  for (let i = 0; i < 4; i++) {
    await controls.nth(i).getByRole("button").click();
    await expect(controls.nth(i).getByRole("link")).toHaveText(`Vezi (${i + 1}) →`);
  }
  await controls.nth(4).getByRole("button").click();
  await expect(controls.nth(4).getByRole("status")).toContainText("Maximum 4");
  await controls.first().getByRole("link").click();
  await expect(page).toHaveURL(/\/compare\?ids=/);
  const shared = page.url();
  await expect(page.locator("thead th")).toHaveCount(5);
  const ids = new URL(shared).searchParams.get("ids")!.split(",");
  for (let i = 0; i < 4; i++) await expect(page.locator(`select[name="item${i + 1}"]`)).toHaveValue(ids[i]);
  await page.getByRole("link", { name: "Elimină", exact: true }).first().click();
  await expect(page.locator("thead th")).toHaveCount(4);
  await expect(page.locator('select[name="item1"]')).toHaveValue(ids[1]);
  await page.goBack();
  await expect(page.locator("thead th")).toHaveCount(5);
  await expect(page.locator('select[name="item1"]')).toHaveValue(ids[0]);
  await page.goto(shared);
  await expect(page.locator("thead th")).toHaveCount(5);
  const productHref = await page.locator("thead th a").first().getAttribute("href");
  await page.locator("thead th a").first().click();
  await expect(page).toHaveURL(new RegExp(`${productHref}$`));
  await expect(page.locator("h1")).toHaveCount(1);
});

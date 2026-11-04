import { test, expect } from "@playwright/test";

for (const locale of ["ro", "en"] as const) test(`battery search landing explains and reproduces its example ${locale}`, async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${locale === "en" ? "/en" : ""}/calculators/battery`);
  await expect(page).toHaveTitle(locale === "ro" ? /Calculator capacitate baterie: Wh și Ah/ : /Battery capacity calculator: Wh & Ah sizing/);
  const panel = page.getByTestId("battery-sizing-explainer");
  await expect(panel).toContainText(locale === "ro" ? "nu autonomie garantată" : "not guaranteed runtime");
  await page.getByLabel(locale === "ro" ? "Puterea consumatorilor (W)" : "Load power (W)", { exact: true }).fill("100");
  await page.getByLabel(locale === "ro" ? "Durata rezervei (ore)" : "Backup time (hours)", { exact: true }).fill("4");
  await page.getByLabel(locale === "ro" ? "Tensiunea bateriei (V)" : "Battery system voltage (V)", { exact: true }).fill("12.8");
  await page.getByLabel(locale === "ro" ? "Adâncime maximă de descărcare (%)" : "Maximum depth of discharge (%)", { exact: true }).fill("80");
  await page.getByLabel(locale === "ro" ? "Randament invertor (%)" : "Inverter efficiency (%)", { exact: true }).fill("90");
  const energy = page.locator("article").filter({ has: page.getByText(locale === "ro" ? "Energie nominală minimă" : "Minimum nominal energy", { exact: true }) });
  await expect(energy).toContainText(/555[.,]56 Wh/);
  const compare = panel.getByRole("link", { name: /Renogy Core Mini 100/ });
  const destination = new URL((await compare.getAttribute("href"))!, baseURL);
  expect(destination.pathname).toBe(`${locale === "en" ? "/en" : ""}/compare`);
  expect(destination.searchParams.get("ids")).toBe("renogy-mini-100,renogy-mini-200");
  await compare.click();
  await expect(page.locator(".comparison-scroll table")).toBeVisible();
  await expect(page.locator(".comparison-scroll thead th")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

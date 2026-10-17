import { test, expect } from "@playwright/test";

for (const locale of ["ro", "en"]) for (const width of [320, 1440]) {
  test(`registration confirmation is durable and readable in ${locale} at ${width}px`, async ({ page, context, baseURL }, info) => {
    await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto("/register/check-email");
    expect(response?.status()).toBe(200);
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText(locale === "ro" ? "Verifică e-mailul" : "Check your email");
    await expect(main.getByRole("status")).toContainText(locale === "ro" ? "Dacă ai deja cont" : "If you already have an account");
    await expect(main.locator('a[href="/login"]')).toBeVisible();
    await expect(main.locator('a[href="/forgot-password"]')).toBeVisible();
    await expect(main.locator('a[href="/register"]')).toBeVisible();
    await expect(main.locator("input")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    if (process.env.EXPECTED_DEPLOYMENT_SHA) await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute("content", process.env.EXPECTED_DEPLOYMENT_SHA);
    await page.screenshot({ path: info.outputPath(`confirmation-${locale}-${width}.png`) });
    await page.reload();
    await expect(main.getByRole("status")).toBeVisible();
    await main.locator('a[href="/login"]').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
}

test("confirmation works without JavaScript and invalid callback offers login rather than registration", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/register/check-email`);
  await expect(page.getByRole("main").getByRole("status")).toBeVisible();
  await page.goto(`${baseURL}/auth/callback`);
  await expect(page).toHaveURL(/\/login\?error=verification-failed$/);
  await expect(page.getByRole("alert")).toBeVisible();
  await context.close();
});

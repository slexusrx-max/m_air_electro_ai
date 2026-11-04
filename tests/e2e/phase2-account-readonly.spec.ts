import { test, expect } from "@playwright/test";

for (const width of [390, 430, 768, 1366, 1440]) test(`account forms remain readable and private without submitting at ${width}px`, async ({ page, context, baseURL }, info) => {
  const mutations: string[] = [];
  await page.setViewportSize({ width, height: 900 });
  await context.addCookies([{ name: "mr-electro-locale", value: "ro", url: baseURL! }]);
  await context.route("**/*", route => {
    if (!["GET", "HEAD", "OPTIONS"].includes(route.request().method())) {
      mutations.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/login", "/register", "/forgot-password", "/reset-password"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toBeVisible();
    await expect(page.locator('meta[name="robots"]'), path).toHaveAttribute("content", /noindex/);
    await expect(page.locator("#main-content form button"), path).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true);
    if (path !== "/reset-password") await expect(page.locator('input[name="email"]')).toHaveAttribute("autocomplete", "email");
    if (path === "/login") await expect(page.locator('input[name="password"]')).toHaveAttribute("autocomplete", "current-password");
    if (path === "/register" || path === "/reset-password") {
      await expect(page.locator('input[name="confirmation"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toHaveAttribute("minlength", "8");
    }
    if (path === "/register") expect(await page.locator('select[name="role"] option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(["client", "expert"]);
  }
  await page.screenshot({ path: info.outputPath(`account-reset-${width}.png`) });
  expect(errors).toEqual([]);
  expect(mutations).toEqual([]);
});

test("anonymous dashboard and project access remain denied and invalid callbacks fail safely", async ({ page, request }) => {
  for (const path of ["/dashboard", "/dashboard/client", "/dashboard/expert"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  const projects = await request.get("/api/projects");
  expect(projects.status()).toBe(401);
  expect(projects.headers()["cache-control"]).toContain("no-store");
  expect(await projects.json()).toEqual({ error: "unauthenticated" });
  await page.goto("/auth/callback?error=access_denied");
  await expect(page).toHaveURL(/\/login\?error=verification-failed$/);
  await expect(page.locator('#main-content [role="alert"]')).toBeVisible();
});

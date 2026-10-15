import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const routes = ["/", "/marketplace", "/renogy", "/waterdrop", "/search?q=Renogy", "/marketplace/batteries", "/compare?ids=renogy-mini-100,renogy-mini-200", "/marketplace/find-my-solution", "/calculators/solar", "/learn", "/partnerships", "/contact", "/login"];
const phase = process.env.UX_AUDIT_PHASE === "before" ? "before" : "after";
for (const width of phase === "before" ? [390, 768, 1440] : [320, 360, 390, 768, 1024, 1440]) {
  test(`visual UX audit ${phase} ${width}`, async ({ page, context, baseURL }) => {
    test.setTimeout(300000);
    await context.addCookies([{ name: "mr-electro-locale", value: "en", url: baseURL! }]);
    await page.setViewportSize({ width, height: 900 });
    await page.route("**/api/contact", route => route.abort());
    const directory = path.resolve(".task-work", "ux-redesign", phase, String(width));
    mkdirSync(directory, { recursive: true });
    for (const [index, route] of routes.entries()) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      if (process.env.EXPECTED_DEPLOYMENT_SHA) await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute("content", process.env.EXPECTED_DEPLOYMENT_SHA);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
      await page.screenshot({ path: path.join(directory, `${index}-${route.split("?")[0].replaceAll("/", "_") || "home"}.png`), fullPage: true });
      await page.screenshot({ path: path.join(directory, `${index}-viewport.png`) });
    }
  });
}

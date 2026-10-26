import { expect, test, type Locator, type Page } from "@playwright/test";

async function moveAcrossCard(page: Page, card: Locator) {
  await card.scrollIntoViewIfNeeded();
  for (const side of [-1, 1]) {
    const bounds = (await card.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width * (side < 0 ? 0.1 : 0.9), bounds.y + bounds.height / 2);
    // Check the rendered rotation: CSS variables alone cannot detect a hover override.
    await expect.poll(() => card.evaluate((element, direction) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return Math.atan2(-matrix.m13, matrix.m11) * 180 / Math.PI * direction;
    }, side)).toBeGreaterThan(6);
    const angle = await card.evaluate(element => Number.parseFloat(element.style.getPropertyValue("--tilt-y")));
    expect(Math.abs(angle)).toBeLessThanOrEqual(7);
  }
  await page.mouse.move(1, 1);
  await expect(card).not.toHaveAttribute("data-tilt-active", "true");
  await expect.poll(() => card.evaluate(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return Math.abs(matrix.m13);
  })).toBeLessThan(0.001);
}

for (const path of ["/", "/marketplace/water", "/renogy/catalog"]) {
  test(`product cards remain clear and rotate under the pointer: ${path}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    if (path === "/") await moveAcrossCard(page, page.locator(".hero-equipment-tile").first());
    const card = page.locator(".equipment-card,.supplier-entry-card,[data-feed-sku]").first();
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(card).toHaveCSS("backdrop-filter", "blur(3px) saturate(1.08)");
    await moveAcrossCard(page, card);
    await page.screenshot({ path: info.outputPath("clear-product-cards.png") });
  });
}

test("reduced motion keeps product cards still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const selector of [".hero-equipment-tile", ".equipment-card"]) {
    const card = page.locator(selector).first();
    await card.hover();
    await expect(card).toHaveCSS("transform", "none");
    await expect(card).not.toHaveAttribute("data-tilt-active", "true");
  }
});

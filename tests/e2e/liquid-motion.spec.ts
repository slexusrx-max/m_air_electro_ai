import { test, expect } from "@playwright/test";

test("glass motion is gentle, controls stay still and reduced motion changes apply immediately", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/marketplace/batteries");
  const card = page.locator(".equipment-card").first();
  const compare = card.locator(".compare-control button");
  await compare.click();
  await expect(compare).toHaveAttribute("aria-pressed", "true");
  await compare.click();
  await expect(compare).toHaveAttribute("aria-pressed", "false");
  await card.scrollIntoViewIfNeeded();
  const pointAtCard = async () => {
    const purpose = card.locator(".product-purpose");
    await purpose.scrollIntoViewIfNeeded();
    const box = (await purpose.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
  };
  await pointAtCard();
  await expect(card).toHaveAttribute("data-tilt-active", "true");
  const tilt = await card.evaluate(element => ["--tilt-x", "--tilt-y"].map(key => parseFloat((element as HTMLElement).style.getPropertyValue(key))));
  expect(tilt.every(value => Number.isFinite(value) && Math.abs(value) <= 2)).toBe(true);
  expect(tilt.some(value => Math.abs(value) > 0.1)).toBe(true);
  await card.locator("[data-supplier-product]").hover();
  await expect(card).not.toHaveAttribute("data-tilt-active");
  await pointAtCard();
  await expect(card).toHaveAttribute("data-tilt-active", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).not.toHaveAttribute("data-tilt-active");
  await pointAtCard();
  await expect(card).not.toHaveAttribute("data-tilt-active");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await pointAtCard();
  await expect(card).toHaveAttribute("data-tilt-active", "true");
  await page.mouse.wheel(0, 100);
  await expect(card).not.toHaveAttribute("data-tilt-active");
});

test("touch input never activates panel tilt", async ({ page }) => {
  await page.goto("/marketplace/batteries");
  const card = page.locator(".equipment-card").first();
  await card.dispatchEvent("pointermove", { pointerType: "touch", clientX: 20, clientY: 20 });
  await expect(card).not.toHaveAttribute("data-tilt-active");
});

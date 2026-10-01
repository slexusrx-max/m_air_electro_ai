import { expect, type Page } from "@playwright/test";

export async function expectContactState(page: Page) {
  // Production is enabled; local builds fail closed unless explicitly configured.
  const enabled = process.env.TEST_CONTACT_FORM_ENABLED
    ? process.env.TEST_CONTACT_FORM_ENABLED === "true"
    : new URL(page.url()).hostname === "mairelectroai.com";
  await expect(page.locator(".contact-form")).toHaveCount(enabled ? 1 : 0);
  await expect(page.locator('script[src*="turnstile"]')).toHaveCount(enabled ? 1 : 0);
  if (enabled) {
    await expect(page.locator('.contact-form input[name="name"]')).toBeVisible();
    await expect(page.locator('.contact-form input[name="email"]')).toBeVisible();
    await expect(page.locator('.contact-form textarea')).toBeVisible();
    await expect(page.locator('.contact-form fieldset')).toBeEnabled();
    await expect(page.locator('.contact-form button[type="submit"]')).toBeVisible();
    // Turnstile controls submit readiness; the isolated fixture covers its lifecycle.
    await expect(page.locator("main")).not.toContainText(/form is unavailable|Formularul de pe site nu este disponibil/);
  } else {
    await expect(page.locator("main")).toContainText(/form is unavailable|Formularul de pe site nu este disponibil/);
  }
}

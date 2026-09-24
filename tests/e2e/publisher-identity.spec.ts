import { test, expect } from "@playwright/test";

const identityPages = ["/about", "/contact", "/privacy", "/terms", "/affiliate-disclosure", "/partnerships", "/business", "/experts", "/methodology", "/editorial-policy", "/author-policy", "/corrections-policy", "/ai-use-policy"];
function objects(value: unknown): Record<string, unknown>[] {
  if (!value || typeof value !== "object") return [];
  return [value as Record<string, unknown>, ...Object.values(value).flatMap(objects)];
}

for (const locale of ["ro", "en"]) test(`publisher is an individual, not a company or assumed reviewer, in ${locale}`, async ({ page, context, baseURL }) => {
  test.setTimeout(180000);
  await context.addCookies([{ name: "mr-electro-locale", value: locale, url: baseURL! }]);
  await page.setViewportSize({ width: locale === "ro" ? 390 : 1440, height: 900 });
  for (const path of [...identityPages, "/", "/learn/how-to-size-backup-battery", "/marketplace/products/renogy-core-mini-100ah"]) {
    await page.goto(path);
    await expect(page.locator(".deep-footer")).toContainText("Stanislav Zavizion");
    await expect(page.locator('meta[name="publisher"]')).toHaveAttribute("content", "Stanislav Zavizion");
    if (identityPages.includes(path)) {
      const identity = page.locator(".publisher-details");
      await expect(identity).toContainText("Stanislav Zavizion");
      await expect(identity.locator('a[href="mailto:contact@mairelectroai.com"]')).toHaveText("contact@mairelectroai.com");
      await expect(identity).toContainText(locale === "ro" ? "Persoană fizică / editor independent" : "Individual / independent publisher");
      await expect(identity).toContainText(locale === "ro" ? "România / Uniunea Europeană" : "Romania / European Union");
      await expect(page.locator("main")).toContainText(locale === "ro" ? "nu există o companie înregistrată" : "no incorporated company");
      await expect(identity).not.toContainText(locale === "ro" ? "necesită confirmarea proprietarului" : "owner confirmation required");
      await expect(page.locator('main a[href*="gmail.com"]')).toHaveCount(0);
    }
    const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(text => objects(JSON.parse(text)));
    const person = data.find(n => n["@id"] === "https://mairelectroai.com/#publisher" && n["@type"] === "Person");
    expect(person?.name, path).toBe("Stanislav Zavizion");
    expect(data.some(n => n["@type"] === "Brand" && n.name === "M Air Electro AI"), path).toBe(true);
    expect(data.filter(n => ["Organization", "Corporation"].includes(String(n["@type"])) && n.name === "M Air Electro AI"), path).toEqual([]);
    for (const key of ["address", "vatID", "taxID", "legalName", "hasCredential", "jobTitle", "email", "employee"]) expect(person?.[key], `${path}: ${key}`).toBeUndefined();
    for (const article of data.filter(n => ["Article", "TechArticle"].includes(String(n["@type"])))) {
      expect(article.author, path).toBeUndefined();
      expect((article.publisher as Record<string, unknown>)?.name, path).toBe("Stanislav Zavizion");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true);
  }
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: locale === "ro" ? "Scrie un email" : "Write an email", exact: true })).toHaveAttribute("href", "mailto:contact@mairelectroai.com?subject=M%20Air%20Electro%20AI%20enquiry");
  const emails = await page.locator('a[href^="mailto:"]').evaluateAll(links => links.map(link => link.getAttribute("href")));
  expect(emails.length).toBeGreaterThan(0);
  expect([...new Set(emails.map(href => href?.split("?")[0]))].sort()).toEqual(["mailto:contact@mairelectroai.com", "mailto:partnerships@mairelectroai.com", "mailto:privacy@mairelectroai.com"]);
  await expect(page.locator("main")).toContainText(locale === "ro" ? "Formularul de pe site nu este disponibil" : "The website form is unavailable");
  await expect(page.locator("main")).toContainText(locale === "ro" ? "verificată printr-un test real de livrare" : "verified with a real delivery test");
  await expect(page.locator('.contact-form')).toHaveCount(0);
  await expect(page.locator('script[src*="turnstile"]')).toHaveCount(0);
  for (const [path, email] of [["/privacy", "privacy@mairelectroai.com"], ["/partnerships", "partnerships@mairelectroai.com"]]) {
    await page.goto(path);
    expect(await page.locator(`main a[href="mailto:${email}"]`).count()).toBeGreaterThan(0);
  }
});

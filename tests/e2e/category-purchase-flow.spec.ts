import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../../lib/affiliate/catalog";
import { expectSupplierCta } from "../supplier-link-expectations";

const categoryModels = {
  inverters: { id: "renogy-inverter-1000", trackedUrl: "https://renogy.sjv.io/MKxQDq" },
  "solar/panels": { id: "renogy-panel-200", trackedUrl: "https://renogy.sjv.io/dy0R9j" },
};

for (const locale of ["ro", "en"] as const) for (const width of [390, 1440]) {
  test(`category selection and supplier journey ${locale} ${width}`, async ({ page, baseURL }, info) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    const prefix = locale === "en" ? "/en" : "";
    for (const category of ["inverters", "solar/panels"] as const) {
      const path = `${prefix}/marketplace/${category}`;
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${path}`);
      await expect(page).toHaveTitle(category === "inverters"
        ? (locale === "ro" ? /Invertoare pentru baterii/ : /Battery inverters/)
        : (locale === "ro" ? /Panouri solare fotovoltaice/ : /Solar panels: compare/));
      const purchase = page.getByRole("region", { name: locale === "ro" ? "Cum alegi și cumperi" : "How to choose and buy" });
      await expect(purchase).toContainText(locale === "ro" ? "nu încasează plata" : "does not take payment");
      const models = catalog.filter(product => product.kind === "product" && product.paths.includes(category));
      await expect(page.getByTestId("catalog-record-types")).toContainText(`${locale === "ro" ? "Modele reale" : "Real models"}: ${models.length}`);
      await expect(page.getByTestId("equipment-class-image-note")).toHaveCount(category === "inverters" ? 1 : 2);
      const supplier = page.locator(".equipment-card a[data-supplier-product]");
      await expect(supplier).toHaveCount(models.length);
      for (const product of models) await expectSupplierCta(supplier.and(page.locator(`[data-supplier-product="${product.id}"]`)), product, new URL(baseURL!).hostname === "mairelectroai.com");
      const model = categoryModels[category];
      const ordinaryUrl = catalog.find(product => product.id === model.id)!.productUrl;
      const selected = supplier.and(page.locator(`[data-supplier-product="${model.id}"]`));
      const href = await selected.getAttribute("href");
      expect([ordinaryUrl, model.trackedUrl]).toContain(href);
      await expect(selected).toHaveAttribute("data-tracking-status", href === model.trackedUrl ? "active" : "ordinary");
      if (href === model.trackedUrl) await expect(selected).toHaveAttribute("rel", /sponsored/);
      await expect(selected).toHaveAttribute("target", "_blank");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${category.replaceAll("/", "-")}-${locale}-${width}.png`), fullPage: true });
      await page.getByLabel(locale === "ro" ? "Tip înregistrare" : "Record type").selectOption("equipment-class");
      await page.getByRole("button", { name: locale === "ro" ? "Aplică filtrele" : "Apply filters", exact: true }).click();
      await expect(page.getByTestId("catalog-record-types")).toContainText(locale === "ro" ? "Modele reale: 0" : "Real models: 0");
      await expect(page.locator(".equipment-card a[data-supplier-product]")).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mairelectroai.com${path}`);
    }
  });
}

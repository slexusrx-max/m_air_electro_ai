import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { catalog } from "../lib/affiliate/catalog";
import { expectSupplierCta } from "../tests/supplier-link-expectations";

async function main() {
  mkdirSync(".task-work", { recursive: true });

  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1050 },
    });

    await context.addCookies([
      {
        name: "mr-electro-locale",
        value: "en",
        url: "https://mairelectroai.com",
      },
    ]);

    const page = await context.newPage();
    const results: Array<{
      model: string;
      provider: string;
      url: string;
      status: number | undefined;
      merchant: string;
      ordinaryUrl: string;
    }> = [];

    const targetProviders = [
      "waterdrop-eu",
      "pecron-eu",
      "bluetti-eu",
    ];

    const products = catalog.filter((product) =>
      targetProviders.includes(product.provider),
    );

    if (products.length !== 9) {
      throw new Error(
        `Expected 9 Waterdrop/PECRON/BLUETTI products, found ${products.length}`,
      );
    }

    for (const product of products) {
      const response = await page.goto(
        `https://mairelectroai.com/marketplace/products/${product.slug}`,
        {
          waitUntil: "networkidle",
        },
      );

      expect(response?.status()).toBe(200);

      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toHaveText(product.name);

      const cta = page.locator(
        `.product-detail a[data-supplier-product="${product.id}"]`,
      );

      await expect(cta).toBeVisible();

      await expectSupplierCta(cta, product, true);

      results.push({
        model: product.name,
        provider: product.provider,
        url: page.url(),
        status: response?.status(),
        merchant: product.merchant,
        ordinaryUrl: product.productUrl,
      });
    }

    await page.goto(
      "https://mairelectroai.com/marketplace/products/bluetti-elite-200-v2",
      {
        waitUntil: "networkidle",
      },
    );

    await page.screenshot({
      path: ".task-work/suppliers-production-desktop.png",
      fullPage: true,
    });

    writeFileSync(
      ".task-work/suppliers-production-smoke.json",
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          verifiedModels: results.length,
          failures: 0,
          results,
        },
        null,
        2,
      ),
    );

    console.log(
      JSON.stringify({
        verifiedModels: results.length,
        failures: 0,
      }),
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { catalog } from "../lib/affiliate/catalog";
import { expectSupplierCta } from "../tests/supplier-link-expectations";

const targetProviders = ["waterdrop-eu", "pecron-eu", "bluetti-eu"];
const products = catalog.filter((product) =>
  targetProviders.includes(product.provider),
);

async function main() {
  for (const provider of targetProviders) {
    if (!products.some((product) => product.provider === provider)) {
      throw new Error(`No catalogue models for ${provider}`);
    }
  }

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
      trackingStatus: string | null;
    }> = [];

    for (const product of products) {
      const response = await page.goto(
        `https://mairelectroai.com/en/marketplace/products/${product.slug}`,
        {
          waitUntil: "networkidle",
        },
      );

      expect(response?.status()).toBe(200);

      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toHaveText(product.name);

      const cta = page.locator(
        `.product-detail [data-supplier-product="${product.id}"]`,
      );

      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("data-supplier", product.provider);

      await expectSupplierCta(cta, product, true);

      results.push({
        model: product.name,
        provider: product.provider,
        url: page.url(),
        status: response?.status(),
        merchant: product.merchant,
        ordinaryUrl: product.productUrl,
        trackingStatus: await cta.getAttribute("data-tracking-status"),
      });
    }

    await page.goto(
      "https://mairelectroai.com/en/marketplace/products/bluetti-elite-200-v2",
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

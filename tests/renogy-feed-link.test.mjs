import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

test("feed links prefer exact issued SKU mappings and preserve ordinary fallback", () => {
  const entry = { sku: "46435544826113", url: "https://eu.renogy.com/products/example" };
  const variantUrl = new URL(entry.url);
  variantUrl.searchParams.set("variant", entry.sku);
  const exactVariantUrl = variantUrl.href;

  for (const tracked of [false, true]) {
    const href = tracked ? "https://renogy.sjv.io/issued" : entry.url;
    const calls = [];
    const { RenogyFeedLink } = load("components/marketplace/renogy-feed-link.tsx", {
      "@/lib/affiliate/providers/renogy": {
        renogyLink: url => {
          calls.push(url);
          return url === exactVariantUrl && tracked
            ? { href, tracked: true }
            : { href: url, tracked: false };
        },
      },
    });
    for (const ro of [true, false]) {
      const result = RenogyFeedLink({ entry, ro, children: "Visit" });
      assert.equal(result.props.href, href);
      assert.equal(result.props["data-tracking-status"], tracked ? "active" : "ordinary");
      assert.equal(result.props["data-supplier-product"], "renogy-feed-46435544826113");
      assert.equal(result.props["data-supplier-language"], ro ? "ro" : "en");
      assert.equal(result.props.rel.includes("sponsored"), tracked);
      assert.equal(result.props.children.join("").includes(ro ? "link afiliat" : "affiliate link"), tracked);
    }
    assert.deepEqual(calls, tracked
      ? [exactVariantUrl, exactVariantUrl]
      : [exactVariantUrl, entry.url, exactVariantUrl, entry.url]);
  }
});

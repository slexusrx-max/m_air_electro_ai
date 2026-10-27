import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

test("feed links preserve gated hrefs, public analytics identity and truthful disclosure", () => {
  const entry = { sku: "46435544826113", url: "https://eu.renogy.com/products/example" };
  for (const tracked of [false, true]) {
    const href = tracked ? "https://renogy.sjv.io/issued" : entry.url;
    const { RenogyFeedLink } = load("components/marketplace/renogy-feed-link.tsx", {
      "@/lib/affiliate/providers/renogy": { renogyLink: url => { assert.equal(url, entry.url); return { href, tracked }; } },
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
  }
});

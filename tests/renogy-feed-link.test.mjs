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
      "@/lib/affiliate/suppliers": { validSupplierUrl: () => true },
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

test('all real feed rows keep valid supplier inputs and unknown variants fall back safely', async () => {
  const { validSupplierUrl } = await import('../lib/affiliate/suppliers.ts');
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const feed = require('../data/renogy-feed-variants.json');
  const reviewed = require('../data/renogy-reviewed-links.json');
  let recovered = 0;
  const { RenogyFeedLink } = load('components/marketplace/renogy-feed-link.tsx', {
    '@/lib/affiliate/suppliers': { validSupplierUrl },
    '@/lib/affiliate/providers/renogy': { renogyLink: url => {
      assert.ok(validSupplierUrl(url, 'renogy'), `Unreviewed variant sent to strict resolver: ${url}`);
      return {href:reviewed[url] ?? url,tracked:Boolean(reviewed[url])};
    } },
  });
  for (const entry of feed.products) {
    const exact = `${entry.url}?variant=${entry.sku}`;
    for (const ro of [true,false]) {
      const result = RenogyFeedLink({entry,ro,children:'Visit'});
      if (reviewed[exact]) {
        assert.equal(result.props.href, reviewed[exact]);
        if (ro) recovered++;
      }
    }
  }
  assert.equal(recovered,12);
});

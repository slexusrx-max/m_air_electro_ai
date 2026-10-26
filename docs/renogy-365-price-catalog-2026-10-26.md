# Renogy 365-SKU price catalog — 26 October 2026

## Scope

The authenticated Renogy EU Impact catalog `28907` contains **365 unique merchant SKU rows**, **365 unique source names** and **101 ordinary Renogy EU product destinations**. The public `/renogy/catalog` and `/en/renogy/catalog` routes now preserve every row as a distinct feed entry with search and pagination. Feed entries are not presented as 365 independently reviewed canonical product models.

`data/renogy-feed-variants.json` retains only SKU, source name, ordinary official destination, parent SKU and row role. It deliberately excludes price, original price, discount, stock, descriptions, images, tracking URLs and feed credentials. The generated identity index is reproducible with `scripts/import-renogy-feed-identities.mjs`; the importer validates the issued Impact mapping before discarding its tracking URL.

## Current-price gate

`RENOGY_IMPACT_PRODUCT_FEED_URL` is server-only. On a successful fresh download, `Current Price` is accepted only for a unique numeric SKU with positive EUR value from catalog `28907`. The public layer receives amount, EUR currency, SKU and retrieval time only. It never receives feed credentials, `Original Price`, stock or the feed tracking URL.

The supplied 18 October archive contains **362 populated current prices and three blank values**. It is identity evidence, not a fresh production price source. Even with a current feed, a blank, duplicate, malformed or missing price stays in fallback state for that SKU. Without a current configured feed, every entry links to Renogy EU for price verification rather than displaying a stale number.

## Interface and indexing

The unfiltered catalog is canonical and indexable. Search and pagination URLs point back to it and are `noindex,follow`. Forty-eight cards are rendered per page to keep the route usable on mobile and desktop. Each card exposes its exact feed SKU and explicit `fresh` or `unavailable` price state for regression testing.

The existing 19 canonical Renogy selections, exact affiliate activation gates, parent-page tracking mappings, photographs and disclosures remain separate and unchanged.

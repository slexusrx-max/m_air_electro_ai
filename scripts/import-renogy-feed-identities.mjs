import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const [input, output = "data/renogy-feed-variants.json"] = process.argv.slice(2);
if (!input) throw new Error("Usage: node scripts/import-renogy-feed-identities.mjs <feed.txt.gz> [output.json]");

function parseTsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "\t" && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = "";
    } else field += char;
  }
  if (field || row.length) { row.push(field); if (row.some(Boolean)) rows.push(row); }
  return rows;
}

const compressed = readFileSync(input);
const rows = parseTsv(gunzipSync(compressed).toString("utf8").replace(/^\uFEFF/, ""));
const headers = rows.shift();
const index = Object.fromEntries(headers.map((header, position) => [header, position]));
for (const required of ["Unique Merchant SKU", "Product Name", "Product URL", "Parent SKU"]) {
  if (index[required] === undefined) throw new Error(`Missing feed column: ${required}`);
}

const parsed = rows.map((row) => {
  const sku = row[index["Unique Merchant SKU"]]?.trim();
  const name = row[index["Product Name"]]?.trim();
  const issued = new URL(row[index["Product URL"]]?.trim());
  const url = new URL(issued.searchParams.get("u") ?? "");
  if (!/^\d+$/.test(sku) || !name) throw new Error(`Invalid identity row: ${sku || "missing SKU"}`);
  if (issued.origin !== "https://renogy.sjv.io" || issued.searchParams.get("prodsku") !== sku ||
    issued.searchParams.get("intsrc") !== "CATF_28907") throw new Error(`Invalid issued mapping: ${sku}`);
  if (url.origin !== "https://eu.renogy.com" || !/^\/products\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(url.pathname) ||
    url.username || url.password || url.hash) throw new Error(`Invalid ordinary Renogy URL: ${sku}`);
  return { sku, name, url: `${url.origin}${url.pathname.replace(/\/$/, "")}`, parentSku: row[index["Parent SKU"]]?.trim() || null };
});

if (parsed.length !== 365 || new Set(parsed.map(record => record.sku)).size !== parsed.length) {
  throw new Error(`Expected 365 unique feed SKUs, received ${parsed.length}`);
}
const destinationCounts = new Map();
for (const record of parsed) destinationCounts.set(record.url, (destinationCounts.get(record.url) ?? 0) + 1);
const products = parsed.map(record => ({
  ...record,
  kind: record.parentSku ? "variant" : destinationCounts.get(record.url) > 1 ? "parent" : "single",
}));
writeFileSync(output, `${JSON.stringify({
  schemaVersion: 1,
  catalogId: "28907",
  sourceSha256: createHash("sha256").update(compressed).digest("hex"),
  products,
}, null, 2)}\n`);
console.log(JSON.stringify({ output, products: products.length, destinations: destinationCounts.size }));

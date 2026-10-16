import { createHash } from "node:crypto";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { catalog } from "../lib/affiliate/catalog";
import { categoryImagePath, isCatalogListing } from "../lib/marketplace/product-presentation";

const files = readdirSync("public/equipment").filter(name => /\.(png|jpe?g|webp|svg)$/i.test(name)).map(name => {
  const path = `/equipment/${name}`;
  return { path, sha256: createHash("sha256").update(readFileSync(`public${path}`)).digest("hex") };
});
const rows = catalog.map(product => {
  const categoryArtwork = categoryImagePath(product.category);
  return { id: product.id, name: product.name, kind: product.kind, categoryArtwork,
    sha256: files.find(file => file.path === categoryArtwork)?.sha256 ?? null,
    inlineArtwork: categoryArtwork ? null : product.category === "water" ? "water-schematic" : "equipment-schematic",
    modelImage: product.image, displayed: product.kind === "product" ? "photo-pending-verification" : "category-illustration",
    listed: isCatalogListing(product) };
});
const sharedPaths = files.map(file => ({ ...file, products: rows.filter(row => row.categoryArtwork === file.path).map(row => row.id) })).filter(group => group.products.length > 1);
const duplicateFileHashes = [...new Set(files.map(file => file.sha256))].map(sha256 => ({ sha256, paths: files.filter(file => file.sha256 === sha256).map(file => file.path) })).filter(group => group.paths.length > 1);
mkdirSync(".task-work", { recursive: true });
writeFileSync(".task-work/product-image-audit.json", JSON.stringify({ rows, files, sharedPaths, duplicateFileHashes }, null, 2));
console.log(JSON.stringify({ records: rows.length, models: rows.filter(row => row.kind === "product").length, sharedPaths, duplicateFileHashes, report: ".task-work/product-image-audit.json" }, null, 2));

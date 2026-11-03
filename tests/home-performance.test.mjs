import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("homepage keeps its product preview bounded", () => {
  const source = readFileSync("components/marketplace/discovery-home.tsx", "utf8");
  assert.match(source, /const HOME_PREVIEW_LIMIT = 12;/);
  assert.match(source, /homePreviewModels = homeModels\.slice\(0, HOME_PREVIEW_LIMIT\)/);
  assert.match(source, /homePreviewModels\.map\(product => <ProductCard/);
  assert.doesNotMatch(source, /pageSize=\{homeModels\.length\}/);
});

test("CI blocks high-severity production dependency regressions", () => {
  const workflow = readFileSync(".github/workflows/verify.yml", "utf8");
  assert.match(workflow, /npm audit --omit=dev --audit-level=high/);
});

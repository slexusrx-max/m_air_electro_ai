import test from "node:test";
import assert from "node:assert/strict";
import { parseCsvRow } from "./csv-row";

test("audit CSV accepts quoted, unquoted, escaped and empty fields", () => {
  assert.deepEqual(parseCsvRow('sku,"place, name",https://example.com,"a""b",ordinary,'), ["sku", "place, name", "https://example.com", 'a"b', "ordinary", ""]);
  assert.deepEqual(parseCsvRow('"sku","placement","source","href","tracked","reason"'), ["sku", "placement", "source", "href", "tracked", "reason"]);
});
test("audit CSV rejects broken quote boundaries instead of changing destinations", () => {
  for (const row of ['"unfinished', 'bad"quote', '"closed"bad', 'line\nbreak']) assert.throws(() => parseCsvRow(row));
});

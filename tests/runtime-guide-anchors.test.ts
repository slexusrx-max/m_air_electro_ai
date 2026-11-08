import test from "node:test";
import assert from "node:assert/strict";
import { guides } from "../lib/marketplace/guides";

test("runtime guide retains existing section anchor meanings when editorial sections are added", () => {
  const guide = guides.find(g => g.slug === "battery-runtime-calculation")!;
  assert.deepEqual(guide.sections.slice(0, 4).map(s => s.title.en), [
    "A transparent equation",
    "Variable loads need energy measurement",
    "Validate without over-discharging",
    "Worked case and decision",
  ]);
  assert.equal(guide.sections[3].title.ro, "Exemplu de calcul și decizie");
});

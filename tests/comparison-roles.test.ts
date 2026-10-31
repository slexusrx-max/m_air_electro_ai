import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../lib/affiliate/catalog';
import reviewed from '../data/pecron-reviewed-expansion.json';
import { comparisonGroup, comparableSelection, comparisonLabels } from '../lib/marketplace/comparison';

test('comparison keeps documented DC supplies and expansion batteries in separate roles', () => {
  for (const record of reviewed) {
    const product = catalog.find(p => p.id === record.id)!;
    if (record.typeEn === 'Low-voltage DC backup supply') assert.equal(comparisonGroup(product), 'dc-backup');
    if (record.typeEn === 'Expansion battery') assert.equal(comparisonGroup(product), 'expansion-batteries');
  }
  for (const ids of ['pecron-d77,pecron-e600lfp','pecron-ep3800-48v,renogy-mini-100','pecron-d39,pecron-e1000lfp']) {
    const result = comparableSelection(ids,catalog);
    assert.equal(result.invalid,true);
    assert.equal(result.selected.length,0);
  }
  for (const ids of ['pecron-d77,pecron-d39','pecron-ep3800-48v,pecron-ep3000-48v','pecron-e600lfp,pecron-e1000lfp','renogy-mini-100,renogy-mini-200']) {
    const result = comparableSelection(ids,catalog);
    assert.equal(result.invalid,false);
    assert.equal(result.selected.length,2);
  }
  for (const key of ['dc-backup','expansion-batteries']) assert.ok(comparisonLabels[key].every(Boolean));
});

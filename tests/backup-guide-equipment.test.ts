import test from 'node:test';
import assert from 'node:assert/strict';
import { guides } from '../lib/marketplace/guides';
import { catalog } from '../lib/affiliate/catalog';

test('backup sizing guide separates real AC stations from standalone batteries', () => {
  const guide = guides.find(g => g.slug === 'how-to-size-backup-battery')!;
  assert.equal(guide.equipmentGroups?.length, 2);
  const categories = ['backup-power', 'lithium-batteries'];
  guide.equipmentGroups!.forEach((group, index) => {
    assert.ok(group.title.ro && group.title.en && group.description.ro && group.description.en);
    assert.equal(new Set(group.productIds).size, 2);
    for (const id of group.productIds) {
      const product = catalog.find(p => p.id === id)!;
      assert.ok(product, id);
      assert.equal(product.kind, 'product');
      assert.notEqual(product.availability, 'unavailable');
      assert.equal(product.category, categories[index]);
      assert.ok(Number(product.facets.capacityWh) > 0);
      if (index === 0) assert.ok(Number(product.facets.power) > 0);
      assert.ok(!id.startsWith('pecron-ep'), 'expansion battery must not replace either path');
    }
  });
});

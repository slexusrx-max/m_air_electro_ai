import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../lib/affiliate/catalog';
import { productAlternatives } from '../lib/marketplace/product-alternatives';
import { comparisonGroup } from '../lib/marketplace/comparison';

const model = (id: string) => catalog.find(p => p.id === id)!;

test('detail alternatives distinguish DC supplies, expansion modules and separate batteries', () => {
  assert.deepEqual(productAlternatives(model('pecron-d77'), catalog).map(p => p.id), ['pecron-d39']);
  assert.deepEqual(productAlternatives(model('pecron-ep3800-48v'), catalog).map(p => p.id), ['pecron-ep3000-48v', 'pecron-ep2000s-48v']);
  assert.ok(productAlternatives(model('renogy-mini-100'), catalog).every(p => !p.id.startsWith('pecron-ep')));
  assert.ok(productAlternatives(model('pecron-e600lfp'), catalog).every(p => !['pecron-d77', 'pecron-d39'].includes(p.id)));
});

test('all detail alternatives retain real available models, role and existing water installation guard', () => {
  for (const product of catalog) {
    const alternatives = productAlternatives(product, catalog);
    assert.ok(alternatives.length <= 3);
    for (const alternative of alternatives) {
      assert.notEqual(alternative.id, product.id);
      assert.equal(alternative.kind, 'product');
      assert.notEqual(alternative.availability, 'unavailable');
      assert.equal(comparisonGroup(alternative), comparisonGroup(product));
      if (product.category === 'water' && product.technicalSpecs.Installation && product.technicalSpecs.Installation !== 'Check manual') {
        assert.equal(alternative.technicalSpecs.Installation, product.technicalSpecs.Installation);
      }
    }
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import photos from '../data/renogy-parent-photos.json';
import {renogyFeedProducts} from '../data/renogy-extra-feed-products';
test('parent images are explicitly reviewed representatives or documented omissions',()=>{
 assert.equal(Object.keys(photos.entries).length,72);
 const values=Object.values(photos.entries);assert.equal(values.filter(p=>'src' in p).length,66);assert.equal(values.filter(p=>p.status==='omitted').length,6);
 for(const product of renogyFeedProducts){const p=photos.entries[product.url];assert.ok(p);if('src' in p){assert.equal(new URL(p.src).hostname,'cdn.shopify.com');assert.ok(p.width>0&&p.height>0);assert.equal(p.status,'representative');}else assert.ok(p.reason);}
 assert.equal(photos.entries['https://eu.renogy.com/products/my-solar-plan-motorhome-solution-kit'].status,'omitted');
});

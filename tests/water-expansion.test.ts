import test from 'node:test';
import assert from 'node:assert/strict';
import rows from '../data/waterdrop-reviewed-expansion.json';
import {catalog} from '../lib/affiliate/catalog';
test('Waterdrop expansion preserves feed identities without emergency or performance inference',()=>{
 assert.equal(rows.length,13);assert.equal(catalog.filter(p=>p.provider==='waterdrop-eu').length,16);
 for(const r of rows){const p=catalog.find(p=>p.id===r.id)!;assert.equal(p.productUrl,r.url);assert.ok(!p.paths.includes('water/emergency-off-grid'));const u=new URL(r.issued);assert.equal(u.origin,'https://dewaterdropfilter.pxf.io');assert.equal(u.searchParams.get('u'),r.url);assert.equal(u.searchParams.get('prodsku'),r.sku);assert.ok(r.width>0&&r.height>0);assert.equal(p.price,null);}
});

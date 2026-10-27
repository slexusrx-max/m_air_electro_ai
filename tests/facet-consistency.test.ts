import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../lib/affiliate/catalog';
import {filterEquipment,normalizeFacet} from '../lib/marketplace/query';
test('known format and waveform aliases match canonical records without inventing unknown values',()=>{
 assert.deepEqual(filterEquipment(catalog,{kind:'product',format:'Portable'}).map(p=>p.id),filterEquipment(catalog,{kind:'product',format:'portable'}).map(p=>p.id));
 assert.equal(filterEquipment(catalog,{kind:'product',format:'portable'}).length,4);
 assert.equal(normalizeFacet('waveform','Pure sine'),'pure-sine');assert.equal(normalizeFacet('format','Unverified form'),'Unverified form');
 assert.equal(filterEquipment(catalog,{kind:'product',brand:'Waterdrop',technology:'UF'}).length,1);
 assert.equal(filterEquipment(catalog,{kind:'product',brand:'Waterdrop',installation:'countertop'}).length,7);
});

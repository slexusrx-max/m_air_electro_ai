import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../lib/affiliate/catalog';
import { specificationLabel, specificationValue } from '../lib/marketplace/specifications';
test('water specifications share canonical keys and documented unavailable model remains archived',()=>{
 const old=catalog.find(p=>p.id==='waterdrop-g3p600')!;const newer=catalog.find(p=>p.id==='waterdrop-k19h')!;
 assert.equal(newer.availability,'unavailable');assert.equal(old.technicalSpecs.Technology,newer.technicalSpecs.Technology);
 assert.ok(old.technicalSpecs.Installation);assert.ok(newer.technicalSpecs.Installation);
 assert.equal(specificationLabel('Installation',true),'Instalare');assert.equal(specificationValue('Countertop',true),'Pe blat');
 assert.equal(specificationValue('12 / 24 V',true),'12 / 24 V');
 assert.equal(specificationValue('Undocumented value',true),'Undocumented value');
});

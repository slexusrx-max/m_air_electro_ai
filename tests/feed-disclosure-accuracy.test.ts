import test from 'node:test';
import assert from 'node:assert/strict';
import counts from '../data/renogy-parent-row-types.json';
import {renogyFeedProducts} from '../data/renogy-extra-feed-products';
import {buildMetadata} from '../lib/metadata';
test('parent summary rows are not counted as selectable variants',()=>{
 const values=Object.values(counts);assert.equal(values.length,72);
 const total=values.reduce((a,c)=>({feedRows:a.feedRows+c.feedRows,parentRows:a.parentRows+c.parentRows,variantRows:a.variantRows+c.variantRows,singleOptions:a.singleOptions+c.singleOptions}),{feedRows:0,parentRows:0,variantRows:0,singleOptions:0});
 assert.deepEqual(total,{feedRows:186,parentRows:31,variantRows:114,singleOptions:41});
 for(const p of renogyFeedProducts){const c=counts[p.url];assert.equal(c.feedRows,p.skuCount);assert.equal(c.feedRows,c.parentRows+c.variantRows+c.singleOptions);}
 const adaptor=counts['https://eu.renogy.com/products/renogy-solar-adaptor-kit'];assert.equal(adaptor.variantRows,10);assert.equal(adaptor.parentRows,1);
});
test('generic OpenGraph artwork alt does not claim to depict a model',()=>{
 const meta=buildMetadata({title:'Waterdrop K19H',path:'/marketplace/products/waterdrop-k19h'});
 assert.equal((meta.openGraph?.images as {alt:string}[])[0].alt,'M Air Electro AI - independent equipment discovery');
});

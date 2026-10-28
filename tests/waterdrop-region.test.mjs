import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from './helpers.mjs';

test('Waterdrop labels German scope on tracked and ordinary CTAs without changing href or tracking', () => {
  const { SupplierLinksProvider, SupplierLink } = load('components/marketplace/supplier-link.tsx');
  for (const ro of [true, false]) for (const tracked of [true, false]) {
    const product = {id:'water-model',provider:'waterdrop-eu',category:'water',productUrl:'https://www.waterdropfilter.de/en/products/example'};
    const href = tracked ? 'https://dewaterdropfilter.pxf.io/issued' : product.productUrl;
    const html = renderToStaticMarkup(createElement(SupplierLinksProvider,{links:{'water-model':{href,tracked}},prices:{}}, createElement(SupplierLink,{product,ro})));
    assert.ok(html.includes(`href="${href}"`));
    assert.ok(html.includes(ro ? 'Magazin DE — doar Germania' : 'DE store — Germany only'));
    assert.ok(html.includes(`data-tracking-status="${tracked ? 'active' : 'ordinary'}"`));
    assert.equal(html.includes('sponsored'),tracked);
  }
  const html = renderToStaticMarkup(createElement(SupplierLink,{product:{id:'other',provider:'renogy',productUrl:'https://eu.renogy.com/products/example'},ro:false}));
  assert.ok(!html.includes('Germany only'));
});

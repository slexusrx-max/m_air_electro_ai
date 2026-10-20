import test from 'node:test';
import assert from 'node:assert/strict';
import {navigation} from '../lib/marketplace/navigation';
import {currentNavigationSection} from '../lib/marketplace/navigation-current';
const cases: [string,string|undefined][] = [
 ['/',undefined],['/learn','/learn'],['/learn/energy','/learn'],['/learn/energy/kwh','/learn'],
 ['/marketplace','/marketplace'],['/marketplace/batteries/lifepo4','/marketplace'],
 ['/marketplace/water','/marketplace/water'],['/marketplace/water/reverse-osmosis','/marketplace/water'],
 ['/waterdrop','/marketplace/water'],['/marketplace/products/waterdrop-g3p800','/marketplace/water'],
 ['/renogy','/marketplace'],['/marketplace/products/renogy-core-mini-100ah','/marketplace'],['/partnerships','/marketplace'],
 ['/solutions','/solutions'],['/solutions/home-backup','/solutions'],
 ['/calculators','/calculators'],['/calculators/battery','/calculators'],['/backup-calculator','/calculators'],['/marketplace/find-my-solution','/calculators'],
 ['/faq','/learn'],['/experts','/experts'],['/business','/business'],['/search?q=water','/marketplace'],['/compare','/marketplace'],
 ['/about',undefined],['/marketplaces',undefined],['/learner',undefined],['/expertise',undefined],
];
for(const locale of ['ro','en'] as const) test(`exactly one owning navigation section ${locale}`,()=>{
 const groups=navigation(locale);
 for(const [path,expected] of cases)assert.equal(currentNavigationSection((locale==='en'?'/en':'')+path,groups),expected,path);
 function check(items:typeof groups[number]['children']) { for(const item of items){assert.ok(currentNavigationSection(item.href,groups),item.href); if(item.children)check(item.children);} }
 check(groups);
});

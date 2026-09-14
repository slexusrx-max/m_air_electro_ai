import { test, expect } from "@playwright/test";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
let bundle: string;
test.beforeAll(async () => {
  const result = await build({
    stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {SiteHeader} from './components/site-header'; import {navigation} from './lib/marketplace/navigation'; const p=window.fixtureProfile; createRoot(document.getElementById('root')).render(<SiteHeader profile={p} dashboardHref={'/dashboard/'+p.role} dictionary={{}} locale="ro" groups={navigation('ro')}/>);`, resolveDir:process.cwd(),loader:"tsx" },
    bundle:true,write:false,jsx:"automatic",define:{"process.env.NODE_ENV":'"production"'},
    plugins:[{name:"isolated-header-dependencies",setup(b){
      b.onResolve({filter:/^(next\/link|next\/navigation|@\/app\/\(auth\)\/actions)$/},args=>({path:args.path,namespace:"header-fixture"}));
      b.onLoad({filter:/.*/,namespace:"header-fixture"},args=>({loader:"jsx",resolveDir:process.cwd(),contents:args.path==="next/link" ? `import React from 'react'; export default function Link({href,children,...props}) { return <a href={href} {...props}>{children}</a>; }` : args.path==="next/navigation" ? `export const usePathname=()=>'/';` : `export async function signOut(){document.documentElement.dataset.signedOut='true';}` }));
    }}],
  });
  bundle=result.outputFiles[0].text;
});
for (const role of ["client","expert"]) for (const width of [320,390,430,1440]) test(`mocked ${role} authenticated header at ${width}px`,async({page},info)=>{
  await page.setViewportSize({width,height:900});
  const css=readFileSync(resolve("app/globals.css"),"utf8").replace(/@import[^;]+;/g,"");
  // Component-only fixture: no real accounts, auth requests, credentials or server bypass.
  await page.route("**/header-fixture",route=>route.fulfill({contentType:"text/html",body:`<!doctype html><html><head><style>${css}</style></head><body><div id="root"></div><script>window.fixtureProfile=${JSON.stringify({role,email:"test@example.invalid"})}</script><script>${bundle.replace(/<\/script/gi,"<\\/script")}</script></body></html>`}));
  await page.goto("http://localhost:3100/header-fixture");
  if(width<1301) await page.getByRole("button",{name:"Meniu",exact:true}).click();
  const nav=page.locator(width<1301?"#mobile-menu":".desktop-account-actions");
  await expect(nav.getByRole("link",{name:width<1301?"Contul meu":"Cont",exact:true})).toHaveAttribute("href",`/dashboard/${role}`);
  await expect(nav.getByRole("link",{name:"Autentificare",exact:true})).toHaveCount(0);
  await page.screenshot({path:info.outputPath(`${role}-${width}.png`)});
  await nav.getByRole("button",{name:"Deconectare",exact:true}).click();
  await expect(page.locator("html")).toHaveAttribute("data-signed-out","true");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});

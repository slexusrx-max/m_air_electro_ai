import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";
const form = (values) => { const data = new FormData(); for (const [k,v] of Object.entries(values)) data.set(k,v); return data; };
function setup({locale="ro",role="client",blocked=false,configured=true}={}) {
 const calls=[];
 const auth = new Proxy({}, { get:(_,name)=>async (input)=>{calls.push([name,input]);return {data:{user:{id:"test"}},error:null};} });
 const actions=load("app/(auth)/actions.ts",{
  "next/navigation":{redirect:path=>{throw new Error(`REDIRECT:${path}`);}},
  "next/cache":{revalidatePath:()=>{}},
  "next/headers":{cookies:async()=>({set:(name,value)=>calls.push(["cookie",{name,value}])})},
  "@/lib/i18n/request":{getRequestLocale:async()=>locale,localeCookieName:"mr-electro-locale"},
  "@/lib/auth-messages":load("lib/auth-messages.ts"),
  "@/lib/site":{absoluteUrl:path=>`https://example.invalid${path}`},
  "@/lib/i18n/types":{roles:["client","expert"]},
  "@/lib/supabase/server":{createActionClient:async()=>{if(!configured)throw Error("missing");return {auth,rpc:async(name,input)=>{calls.push([name,input]);return {error:null};}};}},
  "@/lib/supabase/auth":{getCurrentProfile:async()=>({role,account_status:blocked?"blocked":"active"}),rolePath:{client:"/dashboard/client",expert:"/dashboard/expert"}},
 });
 return {actions,calls};
}
test("registration preserves password whitespace, accepts only public roles and sends verification callback",async()=>{
 const {actions,calls}=setup();
 const data={email:"test@example.invalid",password:" secret123 ",confirmation:" secret123 ",role:"expert"};
 assert.match((await actions.signUp({},form(data))).message,/Verifică/);
 assert.equal(calls[0][1].password,data.password);
 assert.match(calls[0][1].options.emailRedirectTo,/auth\/callback\?next=\/dashboard\/expert/);
 assert.ok((await actions.signUp({},form({...data,role:"admin"}))).error);
 assert.equal(calls.length,1);
 assert.ok((await actions.signUp({},form({...data,confirmation:"secret123"}))).error);
});
test("login routes clients and experts and signs blocked accounts out",async()=>{
 for(const role of ["client","expert"]) {
  const {actions}=setup({role});
  await assert.rejects(actions.signIn({},form({email:"a@b.test",password:"longpassword"})),new RegExp(`REDIRECT:/dashboard/${role}`));
 }
 const {actions,calls}=setup({blocked:true});
 assert.match((await actions.signIn({},form({email:"a@b.test",password:"longpassword"}))).error,/blocat/);
 assert.equal(calls.at(-1)[0],"signOut");
});
test("all authentication actions report missing configuration in RO and EN",async()=>{
 for(const locale of ["ro","en"]) {
  const {actions}=setup({locale,configured:false});
  const data=form({email:"test@example.invalid",password:"secret123",confirmation:"secret123",role:"client"});
  for(const name of ["signIn","signUp","requestPasswordReset","updatePassword"]) assert.match((await actions[name]({},data)).error,locale==="ro"?/momentan/:/temporarily unavailable/);
 }
});
test("recovery uses reset callback, password update validates confirmation, and logout redirects",async()=>{
 const {actions,calls}=setup({locale:"en"});
 assert.match((await actions.requestPasswordReset({},form({email:"test@example.invalid"}))).message,/If an account exists/);
 assert.match(calls[0][1],/test@example.invalid/);
 assert.ok((await actions.updatePassword({},form({password:"abcdefgh",confirmation:"different"}))).error);
 await assert.rejects(actions.updatePassword({},form({password:"abcdefgh",confirmation:"abcdefgh"})),/REDIRECT:\/dashboard/);
 await assert.rejects(actions.signOut(),/REDIRECT:\//);
});
test("onboarding persists Romanian and zero years through the existing secured RPC",async()=>{
 const {actions,calls}=setup({role:"expert"});
 await assert.rejects(actions.completeOnboarding({},form({full_name:"Test",country_code:"RO",preferred_language:"ro",years_experience:"0",professional_title:"Electrician",professional_description:"Test"})),/REDIRECT/);
 assert.equal(calls[0][0],"complete_user_onboarding");
 assert.equal(calls[0][1].p_preferred_language,"ro");
 assert.equal(calls[0][1].p_years_experience,0);
 assert.equal(calls[1][1].value,"ro");
});
test("verification callback exchanges the code, sets session cookies and rejects external redirects",async()=>{
 const {safeRedirectUrl}=load("lib/safe-redirect.ts");
 let ensured=false;
 const callback=load("app/auth/callback/route.ts",{
  "@/lib/safe-redirect":{safeRedirectUrl},
  "next/server":{NextResponse:{redirect:url=>({url:String(url),cookies:{set:()=>{ensured=true;}}})}},
  "@supabase/ssr":{createServerClient:(_url,_key,options)=>({auth:{exchangeCodeForSession:async code=>{assert.equal(code,"isolated-code");options.cookies.setAll([{name:"session",value:"test",options:{httpOnly:true}}]);return {data:{user:{id:"test"}},error:null};}}})},
  "@/lib/supabase/server":{getSupabaseConfig:()=>({url:"https://example.invalid",key:"test"})},
  "@/lib/supabase/auth":{ensureProfileForUser:async()=>{}},
 },{process:{env:{NEXT_PUBLIC_SUPABASE_URL:"https://example.invalid",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"test"}}});
 const response=await callback.GET({url:"https://site.invalid/auth/callback?code=isolated-code&next=https://evil.invalid",cookies:{getAll:()=>[]}});
 assert.equal(response.url,"https://site.invalid/dashboard");assert.ok(ensured);
});

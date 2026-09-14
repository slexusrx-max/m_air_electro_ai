import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {PGlite} from '@electric-sql/pglite';
const migration = name => readFileSync(new URL('../supabase/migrations/'+name+'.sql',import.meta.url),'utf8');
test('onboarding preserves account lifecycle and AI quotas enforce database permissions',async()=>{
  const db=new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema public,auth to authenticated,anon;`);
    for(const file of ['20260721000000_auth_profiles','20260721000001_add_admin_role','20260724000000_complete_user_profiles','20260725000000_production_profile_backend','20260729000000_remove_registration_onboarding','20260912000000_secure_onboarding','20260912000001_ai_request_quota']) await db.exec(migration(file));
    const id='00000000-0000-0000-0000-000000000001';
    await db.exec(`insert into auth.users(id,email) values ('${id}','test@example.org'); select set_config('request.jwt.claim.sub','${id}',false);`);
    const onboard=`select public.complete_user_onboarding('Test','RO','ro',p_assistance_type => 'Support')`;
    await db.exec(`update public.profiles set account_status='blocked'; set role authenticated;`);
    await assert.rejects(db.exec(onboard),/Account unavailable/);
    await assert.rejects(db.exec('select public.consume_ai_request()'),/Active account required/);
    await db.exec('reset role');
    assert.equal((await db.query('select account_status from public.profiles')).rows[0].account_status,'blocked');
    for(const role of ['anon','authenticated']) {
      const legacy=await db.query(`select has_function_privilege('${role}', 'public.complete_onboarding(text,text,text,text,text,text,text[],integer,text,text,text[],text)', 'execute') as allowed`);
      assert.equal(legacy.rows[0].allowed,false);
    }
    await db.exec(`update public.profiles set account_status='pending'; set role authenticated; ${onboard}; reset role;`);
    assert.equal((await db.query('select account_status from public.profiles')).rows[0].account_status,'pending');
    await db.exec(`update public.profiles set account_status='active'; set role authenticated; ${onboard};`);
    await db.exec('reset role');
    assert.equal((await db.query('select preferred_language from public.profiles')).rows[0].preferred_language,'ro');
    assert.equal((await db.query('select assistance_type from public.client_profiles')).rows[0].assistance_type,'Support');
    await db.exec('set role authenticated');
    const results=await Promise.all(Array.from({length:35},()=>db.query('select public.consume_ai_request() as allowed')));
    assert.equal(results.filter(r=>r.rows[0].allowed).length,30);
    await assert.rejects(db.exec('update public.ai_request_usage set requests=1'),/permission denied/);
    await db.exec(`reset role; update public.ai_request_usage set usage_day=usage_day-1; set role authenticated;`);
    assert.equal((await db.query('select public.consume_ai_request() as allowed')).rows[0].allowed,true);
    await db.exec(`reset role; set role anon;`);
    await assert.rejects(db.exec('select public.consume_ai_request()'),/permission denied/);
  } finally {await db.close();}
});

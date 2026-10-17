import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {PGlite} from '@electric-sql/pglite';
const migration = name => readFileSync(new URL('../supabase/migrations/'+name+'.sql',import.meta.url),'utf8');
test('saved profiles can be read after reconnect while other accounts remain private',async()=>{
 const db=new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create schema auth;
   create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
   create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   grant usage on schema public,auth to authenticated,anon;`);
  for(const file of ['20260721000000_auth_profiles','20260721000001_add_admin_role','20260724000000_complete_user_profiles','20260725000000_production_profile_backend','20260729000000_remove_registration_onboarding','20260912000000_secure_onboarding']) await db.exec(migration(file));
  const id='00000000-0000-0000-0000-000000000001';
  const other='00000000-0000-0000-0000-000000000002';
  await db.exec(`insert into auth.users(id,email) values ('${id}','one@example.invalid'),('${other}','two@example.invalid');
   select set_config('request.jwt.claim.sub','${id}',false); set role authenticated;`);
  await assert.rejects(db.query('select * from public.profiles'),/permission denied/);
  await db.exec('reset role');
  await db.exec(migration('20261017000000_restore_own_profile_read'));
  await db.exec(`set role authenticated;
   select public.complete_user_onboarding('Saved name','RO','en',p_assistance_type => 'Battery sizing');
   reset role; select set_config('request.jwt.claim.sub','',false);
   select set_config('request.jwt.claim.sub','${id}',false); set role authenticated;`);
  assert.deepEqual((await db.query('select id,full_name,country_code from public.profiles')).rows,[{id,full_name:'Saved name',country_code:'RO'}]);
  assert.equal((await db.query(`select id from public.profiles where id='${other}'`)).rows.length,0);
  await assert.rejects(db.exec("update public.profiles set role='admin'"),/permission denied/);
  await db.exec('reset role; set role anon');
  await assert.rejects(db.query('select * from public.profiles'),/permission denied/);
 } finally {await db.close();}
});

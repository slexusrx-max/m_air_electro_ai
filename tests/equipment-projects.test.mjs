import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { load } from "./helpers.mjs";

const validation = load("lib/marketplace/projects.ts");
const known = new Set(["renogy-mini-100", "renogy-mini-200"]);
const draft = { name: " Cabin ", items: [{ productId: "renogy-mini-100", quantity: 2 }] };
const uuid = "00000000-0000-0000-0000-000000000001";

test("project validation rejects unknown products, duplicate lines, forged fields and non-integer quantities", () => {
  const valid = validation.validateProjectDraft(draft, known);
  assert.equal(valid.ok, true);
  assert.equal(valid.value.name, "Cabin");
  assert.equal(valid.value.items[0].quantity, 2);
  for (const value of [null, [], { ...draft, name: "" }, { ...draft, name: "x".repeat(101) }, { ...draft, name: "x\ny" },
    { ...draft, items: "invalid" }, { ...draft, items: Array(101).fill(draft.items[0]) },
    { ...draft, items: [...draft.items, ...draft.items] },
    ...[0, -1, 1000, 1.5, "2", null].map(quantity => ({ ...draft, items: [{ productId: "renogy-mini-100", quantity }] })),
    { ...draft, items: [{ productId: "invented-product", quantity: 1 }] },
    { ...draft, items: [{ productId: "renogy-mini-100", quantity: 1, price: 99 }] }]) {
    assert.equal(validation.validateProjectDraft(value, known).ok, false, JSON.stringify(value));
  }
  assert.equal(validation.validateProjectDraft({ name: "Empty project", items: [] }, known).ok, true);
  assert.equal(validation.validateProjectVersion({ id: uuid, revision: 1 }).ok, true);
  for (const value of [{ id: "x", revision: 1 }, { id: uuid, revision: 0 }, { id: uuid, revision: 1.2 }, { id: uuid, revision: "1" }]) {
    assert.equal(validation.validateProjectVersion(value).ok, false);
  }
});

test("project CSV preserves quantity, quotes text and neutralises formulas", () => {
  const csv = validation.projectCsv({ ...draft, name: '=HYPERLINK("bad")' }, { "renogy-mini-100": 'Battery, "Mini"' });
  assert.match(csv, /'=HYPERLINK/);
  assert.match(csv, /Battery, ""Mini""/);
  assert.match(csv, /,"2"\r\n$/);
});

const migration = name => readFileSync(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
test("real project RLS supports active and pending owners with isolation, persistence, revisions, limits and blocked denial", async () => {
  const db = new PGlite();
  const one = uuid;
  const two = "00000000-0000-0000-0000-000000000002";
  const items = JSON.stringify(draft.items);
  const login = async id => db.exec(`reset role; select set_config('request.jwt.claim.sub','${id}',false); set role authenticated;`);
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema public,auth to authenticated,anon;`);
    for (const file of ["20260721000000_auth_profiles", "20260721000001_add_admin_role", "20260724000000_complete_user_profiles", "20260725000000_production_profile_backend", "20260729000000_remove_registration_onboarding", "20260912000000_secure_onboarding", "20261017000000_restore_own_profile_read", "20261018000000_equipment_projects", "20261018000001_equipment_projects_pending_profiles"]) await db.exec(migration(file));
    await db.exec(`insert into auth.users(id,email) values ('${one}','one@example.invalid'),('${two}','two@example.invalid');`);
    await login(one);
    const inserted = await db.query("insert into public.equipment_projects(owner_id,name,items) values ($1,'Cabin',$2::jsonb) returning id,revision", [one, items]);
    const id = inserted.rows[0].id;
    assert.equal(inserted.rows[0].revision, 1);
    // Isolated test fixtures only: exercise the legacy pending state used by
    // existing signed-in accounts without changing production profile states.
    await db.exec("reset role; update public.profiles set account_status='pending';");
    await login(two);
    assert.equal((await db.query("select * from public.equipment_projects")).rows.length, 0);
    assert.equal((await db.query("update public.equipment_projects set name='Intruder' where id=$1 returning id", [id])).rows.length, 0);
    assert.equal((await db.query("delete from public.equipment_projects where id=$1 returning id", [id])).rows.length, 0);
    await assert.rejects(db.query("insert into public.equipment_projects(owner_id,name) values ($1,'Forged')", [one]), /row-level security/);
    const otherProject = (await db.query("insert into public.equipment_projects(owner_id,name,items) values ($1,'Other pending owner',$2::jsonb) returning id", [two, items])).rows[0].id;
    assert.equal((await db.query("select name from public.equipment_projects where id=$1", [otherProject])).rows[0].name, "Other pending owner");
    await login(one);
    assert.equal((await db.query("select id from public.equipment_projects where id=$1", [otherProject])).rows.length, 0);
    assert.equal((await db.query("select name,items from public.equipment_projects where id=$1", [id])).rows[0].name, "Cabin");
    const updated = await db.query("update public.equipment_projects set items=$1::jsonb where id=$2 and revision=1 returning revision", [JSON.stringify([{ productId: "renogy-mini-100", quantity: 3 }]), id]);
    assert.equal(updated.rows[0].revision, 2);
    assert.equal((await db.query("update public.equipment_projects set name='Stale device' where id=$1 and revision=1 returning id", [id])).rows.length, 0);
    assert.equal((await db.query("delete from public.equipment_projects where id=$1 and revision=1 returning id", [id])).rows.length, 0);
    await assert.rejects(db.query("update public.equipment_projects set owner_id=$1 where id=$2", [two, id]), /permission denied/);
    await assert.rejects(db.query("update public.equipment_projects set revision=1 where id=$1", [id]), /permission denied/);
    await assert.rejects(db.query("insert into public.equipment_projects(owner_id,name,revision) values ($1,'Forged revision',20)", [one]), /permission denied/);
    for (const bad of [{}, [null], [{ productId: "renogy-mini-100", quantity: 0 }], [{ productId: "renogy-mini-100", quantity: 1.5 }], [{ productId: "renogy-mini-100", quantity: "1" }], [...draft.items, ...draft.items], [{ productId: "renogy-mini-100", quantity: 1, price: 99 }], Array.from({ length: 101 }, (_, i) => ({ productId: `model-${i}`, quantity: 1 }))]) {
      await assert.rejects(db.query("update public.equipment_projects set items=$1::jsonb where id=$2", [JSON.stringify(bad), id]), /check constraint/);
    }
    for (let i = 1; i < 20; i++) await db.query("insert into public.equipment_projects(owner_id,name) values ($1,$2)", [one, `Project ${i}`]);
    await assert.rejects(db.query("insert into public.equipment_projects(owner_id,name) values ($1,'Over limit')", [one]), /PROJECT_LIMIT/);
    assert.equal((await db.query("delete from public.equipment_projects where id=$1 and revision=2 returning id", [id])).rows.length, 1);
    await db.exec(`reset role; update public.profiles set account_status='blocked' where id='${one}';`);
    await login(one);
    assert.equal((await db.query("select * from public.equipment_projects")).rows.length, 0);
    assert.equal((await db.query("update public.equipment_projects set name='Blocked' returning id")).rows.length, 0);
    await assert.rejects(db.query("insert into public.equipment_projects(owner_id,name) values ($1,'Blocked')", [one]), /row-level security/);
    await db.exec("reset role; set role anon");
    await assert.rejects(db.query("select * from public.equipment_projects"), /permission denied/);
    await assert.rejects(db.query("insert into public.equipment_projects(owner_id,name) values ($1,'Anonymous')", [one]), /permission denied/);
  } finally { await db.close(); }
});

function routes({ user = { id: uuid }, status = "active", configured = true, replies = [] } = {}) {
  const calls = [];
  const supabase = {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from(table) {
      const call = { table, operations: [] };
      calls.push(call);
      const result = table === "profiles" ? { data: status ? { account_status: status } : null, error: null } : replies.shift() ?? { data: [], error: null };
      const builder = new Proxy({}, { get: (_, name) => name === "then" ? (resolve, reject) => Promise.resolve(result).then(resolve, reject) : (...args) => { call.operations.push([name, ...args]); return builder; } });
      return builder;
    },
  };
  const handlers = load("app/api/projects/route.ts", {
    "@/lib/supabase/server": { createActionClient: async () => { if (!configured) throw Error("Missing secret"); return supabase; } },
    "@/lib/affiliate/catalog": { catalog: [...known].map(id => ({ id })) },
    "@/lib/marketplace/projects": validation,
  }, { TextEncoder });
  return { handlers, calls };
}
function request(method, body, headers = {}) {
  return new Request("https://mairelectroai.com/api/projects", { method, headers: { origin: "https://mairelectroai.com", "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}

test("project API requires a signed-in eligible account and rejects cross-origin, oversized or forged input", async () => {
  for (const [options, expected] of [[{ user: null }, 401], [{ status: "blocked" }, 403], [{ status: "unexpected" }, 403], [{ status: null }, 403], [{ configured: false }, 503]]) {
    const { handlers } = routes(options);
    assert.equal((await handlers.GET()).status, expected);
    assert.equal((await handlers.POST(request("POST", draft))).status, expected);
  }
  const { handlers, calls } = routes();
  assert.equal((await handlers.POST(request("POST", draft, { origin: "https://attacker.invalid" }))).status, 403);
  assert.equal((await handlers.POST(request("POST", draft, { origin: "" }))).status, 403);
  assert.equal((await handlers.POST(request("POST", draft, { "content-type": "text/plain" }))).status, 415);
  assert.equal((await handlers.POST(request("POST", { ...draft, owner_id: uuid }))).status, 400);
  assert.equal((await handlers.POST(request("POST", { ...draft, name: "x".repeat(50_000) }))).status, 413);
  assert.equal((await handlers.POST(request("POST", { ...draft, items: [{ productId: "unknown", quantity: 1 }] }))).status, 400);
  assert.equal(calls.filter(call => call.table === "equipment_projects").length, 0);
});

test("project API accepts authenticated pending profiles without changing their account state", async () => {
  const { handlers, calls } = routes({ status: "pending", replies: [{ data: [], error: null }, { data: { id: uuid, ...draft, revision: 1 }, error: null }] });
  assert.equal((await handlers.GET()).status, 200);
  assert.equal((await handlers.POST(request("POST", draft))).status, 201);
  for (const call of calls.filter(call => call.table === "profiles")) {
    assert.equal(call.operations.some(op => ["insert", "update", "upsert", "delete"].includes(op[0])), false);
  }
});

test("project API scopes reads, creates and versioned mutations to authenticated owner", async () => {
  const { handlers, calls } = routes({ replies: [{ data: [], error: null }, { data: { id: uuid, ...draft, revision: 1 }, error: null }] });
  const read = await handlers.GET();
  assert.equal(read.headers.get("cache-control"), "private, no-store");
  assert.equal(calls[1].operations.some(op => op[0] === "eq" && op[1] === "owner_id" && op[2] === uuid), true);
  const created = await handlers.POST(request("POST", draft));
  assert.equal(created.status, 201);
  const insert = calls.find(call => call.operations.some(op => op[0] === "insert"));
  assert.equal(insert.operations.find(op => op[0] === "insert")[1].owner_id, uuid);
  for (const method of ["PATCH", "DELETE"]) {
    const fixture = routes({ replies: [{ data: null, error: null }, { data: { id: uuid }, error: null }] });
    const response = await fixture.handlers[method](request(method, { id: uuid, revision: 1, ...(method === "PATCH" ? draft : {}) }));
    assert.equal(response.status, 409);
    const operations = fixture.calls[1].operations;
    assert.equal(operations.some(op => op[0] === "eq" && op[1] === "owner_id" && op[2] === uuid), true);
    assert.equal(operations.some(op => op[0] === "eq" && op[1] === "revision" && op[2] === 1), true);
  }
  const notFound = routes({ replies: [{ data: null, error: null }, { data: null, error: null }] });
  assert.equal((await notFound.handlers.DELETE(request("DELETE", { id: uuid, revision: 1 }))).status, 404);
  const failed = routes({ replies: [{ data: null, error: { message: "private database detail" } }] });
  assert.deepEqual(await (await failed.handlers.GET()).json(), { error: "unavailable" });
});

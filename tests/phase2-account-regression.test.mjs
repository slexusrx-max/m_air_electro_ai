import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

const user = { id: "00000000-0000-0000-0000-000000000001", email: "fixture@example.invalid", user_metadata: { role: "client" } };
const profile = { id: user.id, email: user.email, role: "client", account_status: "active" };
const redirect = path => { throw Error(`REDIRECT:${path}`); };

function profileHarness({ signedIn = true, authError = null, read = { data: profile, error: null }, throwRead = false, throwDetails = false, adminFailure = false } = {}) {
  const calls = [];
  const client = {
    auth: { getUser: async () => ({ data: { user: signedIn ? user : null }, error: authError }) },
    from(table) {
      calls.push(["from", table]);
      if (throwDetails && table !== "profiles") throw Error("private database details");
      const builder = {
        select: () => builder,
        eq: (...args) => { calls.push(["eq", ...args]); return builder; },
        maybeSingle: async () => {
          if (throwRead) throw Error("private database details");
          return read;
        },
      };
      return builder;
    },
  };
  const api = load("lib/supabase/auth.ts", {
    "server-only": {},
    "next/navigation": { redirect },
    "@/lib/supabase/server": {
      createClient: async () => client,
      createAdminClient: () => { calls.push(["admin"]); if (adminFailure) throw Error("private secret details"); return null; },
    },
  });
  return { api, calls };
}

test("failed profile status reads cannot fabricate active sessions or trigger privileged bootstrap", async () => {
  for (const options of [{ read: { data: null, error: { code: "42501", message: "private database details" } } }, { throwRead: true }]) {
    const { api, calls } = profileHarness(options);
    assert.equal(await api.getCurrentProfile(), null);
    assert.equal(calls.some(call => call[0] === "admin"), false);
    await assert.rejects(api.requireCompletedProfile(), /REDIRECT:\/login$/);
  }
});

test("verified owner profiles preserve pending and blocked state while optional role data outages stay nonfatal", async () => {
  for (const status of ["active", "pending", "blocked"]) {
    const saved = { ...profile, account_status: status, full_name: "Owner fixture" };
    const { api, calls } = profileHarness({ read: { data: saved, error: null }, throwDetails: true });
    assert.deepEqual(await api.getCurrentProfile(), saved);
    assert.deepEqual(await api.getAccountDetails(saved), saved);
    assert.ok(calls.some(call => call[0] === "eq" && call[1] === "id" && call[2] === user.id));
    assert.equal(calls.some(call => call[0] === "admin"), false);
    if (status === "blocked") await assert.rejects(api.requireCompletedProfile(), /REDIRECT:\/login\?error=account-blocked/);
    else assert.deepEqual(await api.requireCompletedProfile(), saved);
  }
});

test("auth failures stay anonymous and successful missing-row reads retain existing bounded bootstrap", async () => {
  for (const options of [{ signedIn: false }, { authError: { code: "invalid_token" } }]) {
    const { api, calls } = profileHarness(options);
    assert.equal(await api.getCurrentProfile(), null);
    assert.equal(calls.length, 0);
  }
  const { api } = profileHarness({ read: { data: null, error: null }, adminFailure: true });
  const session = await api.getCurrentProfile();
  assert.equal(session.id, user.id);
  assert.equal(session.role, "client");
  assert.equal(await api.ensureProfileForUser(user), null);
});

function pageHarness(locale = "ro") {
  return {
    "next/navigation": { redirect },
    "@/components/auth/auth-form": { AuthForm: () => null },
    "@/components/platform-shell": { PlatformShell: () => null },
    "@/components/localized-link": () => null,
    "@/app/(auth)/actions": { signIn: () => {}, signUp: () => {} },
    "@/lib/i18n/request": { getRequestDictionary: async () => ({}), getRequestLocale: async () => locale },
    "@/lib/auth-messages": load("lib/auth-messages.ts"),
    "@/lib/supabase/auth": { getCurrentUser: async () => user, getCurrentProfile: async () => null, rolePath: { client: "/dashboard/client", expert: "/dashboard/expert" } },
  };
}

test("signed-in unavailable profiles render a localized recovery page without a login/dashboard redirect loop", async () => {
  for (const locale of ["ro", "en"]) {
    const deps = pageHarness(locale);
    const page = await load("app/(auth)/login/page.tsx", deps).default({ searchParams: Promise.resolve({}) });
    const alert = page.props.children.find(child => child?.props?.role === "alert");
    assert.equal(alert.props.children, deps["@/lib/auth-messages"].authMessages.unavailable[locale]);
  }
  for (const path of ["app/(auth)/register/page.tsx", "app/(auth)/register/check-email/page.tsx"]) {
    await assert.rejects(load(path, pageHarness()).default(), /REDIRECT:\/login\?error=account-unavailable/);
  }
});

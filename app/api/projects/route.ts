import { createActionClient } from "@/lib/supabase/server";
import { catalog } from "@/lib/affiliate/catalog";
import { isProjectObject, projectLimits, validateProjectDraft, validateProjectVersion } from "@/lib/marketplace/projects";

const knownProductIds = new Set(catalog.map(product => product.id));
const fields = "id,name,items,revision,created_at,updated_at";
const respond = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie" } });
const unavailable = () => respond({ error: "unavailable" }, 503);

async function account() {
  const supabase = await createActionClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { response: respond({ error: "unauthenticated" }, 401) };
  const { data: profile, error: profileError } = await supabase.from("profiles").select("account_status").eq("id", user.id).maybeSingle();
  if (profileError) return { response: unavailable() };
  if (!profile || profile.account_status !== "active") return { response: respond({ error: "account_unavailable" }, 403) };
  return { supabase, user };
}

async function payload(request: Request, permittedKeys: string[]) {
  // Cookie-authenticated mutations are accepted only from the same browser origin.
  if (request.headers.get("origin") !== new URL(request.url).origin) return { response: respond({ error: "invalid_origin" }, 403) };
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return { response: respond({ error: "json_required" }, 415) };
  if (Number(request.headers.get("content-length")) > projectLimits.bodyBytes) return { response: respond({ error: "too_large" }, 413) };
  const text = await request.text();
  if (new TextEncoder().encode(text).length > projectLimits.bodyBytes) return { response: respond({ error: "too_large" }, 413) };
  let body: unknown;
  try { body = JSON.parse(text); } catch { return { response: respond({ error: "invalid_project" }, 400) }; }
  if (!isProjectObject(body) || Object.keys(body).some(key => !permittedKeys.includes(key))) return { response: respond({ error: "invalid_project" }, 400) };
  return { body };
}

export async function GET() {
  try {
    const session = await account();
    if ("response" in session) return session.response;
    const { data, error } = await session.supabase.from("equipment_projects").select(fields).eq("owner_id", session.user.id).order("updated_at", { ascending: false }).limit(projectLimits.projects);
    if (error) return unavailable();
    return respond({ projects: data });
  } catch { return unavailable(); }
}

export async function POST(request: Request) {
  try {
    const parsed = await payload(request, ["name", "items"]);
    if ("response" in parsed) return parsed.response;
    const session = await account();
    if ("response" in session) return session.response;
    const result = validateProjectDraft(parsed.body, knownProductIds);
    if (!result.ok) return respond({ error: "invalid_project", message: result.error }, 400);
    const { data, error } = await session.supabase.from("equipment_projects").insert({ owner_id: session.user.id, ...result.value }).select(fields).single();
    if (error?.message?.includes("PROJECT_LIMIT")) return respond({ error: "project_limit", limit: projectLimits.projects }, 409);
    if (error) return unavailable();
    return respond({ project: data }, 201);
  } catch { return unavailable(); }
}

export async function PATCH(request: Request) {
  try {
    const parsed = await payload(request, ["id", "revision", "name", "items"]);
    if ("response" in parsed) return parsed.response;
    const session = await account();
    if ("response" in session) return session.response;
    const version = validateProjectVersion(parsed.body);
    const draft = validateProjectDraft(parsed.body, knownProductIds);
    if (!version.ok || !draft.ok) return respond({ error: "invalid_project" }, 400);
    const { id, revision } = version.value;
    const { data, error } = await session.supabase.from("equipment_projects").update(draft.value).eq("owner_id", session.user.id).eq("id", id).eq("revision", revision).select(fields).maybeSingle();
    if (error) return unavailable();
    if (!data) return await missingOrConflict(session.supabase, session.user.id, id);
    return respond({ project: data });
  } catch { return unavailable(); }
}

export async function DELETE(request: Request) {
  try {
    const parsed = await payload(request, ["id", "revision"]);
    if ("response" in parsed) return parsed.response;
    const session = await account();
    if ("response" in session) return session.response;
    const version = validateProjectVersion(parsed.body);
    if (!version.ok) return respond({ error: "invalid_project" }, 400);
    const { id, revision } = version.value;
    const { data, error } = await session.supabase.from("equipment_projects").delete().eq("owner_id", session.user.id).eq("id", id).eq("revision", revision).select("id").maybeSingle();
    if (error) return unavailable();
    if (!data) return await missingOrConflict(session.supabase, session.user.id, id);
    return respond({ ok: true });
  } catch { return unavailable(); }
}

async function missingOrConflict(supabase: Awaited<ReturnType<typeof createActionClient>>, ownerId: string, id: string) {
  const { data, error } = await supabase.from("equipment_projects").select("id").eq("owner_id", ownerId).eq("id", id).maybeSingle();
  if (error) return unavailable();
  return data ? respond({ error: "conflict" }, 409) : respond({ error: "not_found" }, 404);
}

import { createActionClient } from "@/lib/supabase/server";

const bucket = "technical-documents";
const maxBytes = 20 * 1024 * 1024;
const permitted = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

function safeName(name: string) { return name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 240) || "document"; }

export async function GET() {
  try {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    const { data, error } = await supabase.from("technical_documents").select("id,name,mime_type,byte_size,created_at").order("created_at", { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ documents: data });
  } catch {
    return Response.json({ error: "Document storage is not configured" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "File is required" }, { status: 400 });
    if (file.size > maxBytes || (!permitted.has(file.type) && !/\.(pdf|jpe?g|png|webp|txt|docx)$/i.test(file.name))) return Response.json({ error: "Unsupported file or file exceeds 20 MB" }, { status: 400 });
    const name = safeName(file.name); const path = `${user.id}/${crypto.randomUUID()}-${name}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });
    const { data, error } = await supabase.from("technical_documents").insert({ owner_id: user.id, name, storage_path: path, mime_type: file.type || "application/octet-stream", byte_size: file.size }).select("id,name,mime_type,byte_size,created_at").single();
    if (error) { await supabase.storage.from(bucket).remove([path]); return Response.json({ error: error.message }, { status: 500 }); }
    return Response.json({ document: data }, { status: 201 });
  } catch {
    return Response.json({ error: "Document storage is not configured" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    const { id } = await request.json();
    if (typeof id !== "string") return Response.json({ error: "Document id is required" }, { status: 400 });
    const { data: document, error: lookupError } = await supabase.from("technical_documents").select("storage_path").eq("id", id).maybeSingle();
    if (lookupError || !document) return Response.json({ error: "Document not found" }, { status: 404 });
    const { error: deleteError } = await supabase.from("technical_documents").delete().eq("id", id);
    if (deleteError) return Response.json({ error: deleteError.message }, { status: 500 });
    const { error: storageError } = await supabase.storage.from(bucket).remove([document.storage_path]);
    if (storageError) return Response.json({ error: storageError.message }, { status:500 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Document storage is not configured" }, { status: 503 });
  }
}

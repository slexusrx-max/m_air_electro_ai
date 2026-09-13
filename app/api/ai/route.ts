import { getAiRuntimeStatus } from "@/lib/server/ai";
import { createActionClient } from "@/lib/supabase/server";

const maxPromptLength = 6000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { prompt?: unknown; mode?: unknown; locale?: unknown } | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const mode = typeof body?.mode === "string" ? body.mode.trim() : "Electrical Question";
  if (!prompt || prompt.length > maxPromptLength || mode.length > 100) {
    return Response.json({ error: "Prompt must be between 1 and 6000 characters and mode at most 100 characters" }, { status: 400 });
  }
  const runtime = getAiRuntimeStatus();
  if (runtime.preferredProvider !== "openai" || !runtime.activeProviderConfigured) return Response.json({ error: "The selected AI provider is not configured", provider: runtime.preferredProvider }, { status: 503 });

  try {
    const supabase = await createActionClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return Response.json({ error: "Sign in to use the AI assistant" }, { status: 401 });
    const { data: profile, error: profileError } = await supabase.from("profiles").select("account_status").eq("id", user.id).maybeSingle();
    if (profileError) return Response.json({ error: "Account verification is unavailable" }, { status: 503 });
    if (profile?.account_status !== "active") return Response.json({ error: "An active account is required" }, { status: 403 });
    const { data: allowed, error: quotaError } = await supabase.rpc("consume_ai_request");
    if (quotaError) return Response.json({ error: "AI quota verification is unavailable" }, { status: 503 });
    if (allowed !== true) return Response.json({ error: "Daily AI request limit reached. Try again after midnight UTC." }, { status: 429 });
  } catch {
    return Response.json({ error: "Account verification is unavailable" }, { status: 503 });
  }

  const system = body?.locale === "uk"
    ? "Ти Electro-AI — помічник з енергетики та електротехніки. Відповідай українською. Не вигадуй дані з документів, не давай інструкцій для робіт під напругою, обходу захистів або зворотного живлення генератора. Чітко позначай, коли потрібен кваліфікований електрик."
    : "You are Electro-AI, an energy and electrical engineering assistant. Reply in English. Do not invent document data or give instructions for energized work, bypassing protections, or generator backfeeding. Clearly state when a qualified electrician is required.";
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL, input: [{ role: "system", content: system }, { role: "user", content: `Mode: ${mode}\n\n${prompt}` }], max_output_tokens: 700 }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) return Response.json({ error: "The AI provider rejected the request" }, { status: 502 });
    const data = await response.json() as { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string; refusal?: string }> }> };
    const answer = (data.output ?? []).filter((item) => item.type === "message").flatMap((item) => item.content ?? []).map((part) => {
      if (part.type === "output_text" && typeof part.text === "string") return part.text;
      if (part.type === "refusal" && typeof part.refusal === "string") return part.refusal;
      return "";
    }).filter(Boolean).join("\n").trim();
    if (!answer) return Response.json({ error: "The AI provider returned no text. Please try again." }, { status: 502 });
    return Response.json({ answer });
  } catch {
    return Response.json({ error: "The AI provider is temporarily unavailable" }, { status: 502 });
  }
}

import { getAiRuntimeStatus } from "@/lib/server/ai";

const maxPromptLength = 6000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { prompt?: unknown; mode?: unknown; locale?: unknown } | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > maxPromptLength) return Response.json({ error: "Prompt must be between 1 and 6000 characters" }, { status: 400 });
  const runtime = getAiRuntimeStatus();
  if (runtime.preferredProvider !== "openai" || !runtime.activeProviderConfigured) return Response.json({ error: "The selected AI provider is not configured", provider: runtime.preferredProvider }, { status: 503 });
  const system = body?.locale === "uk"
    ? "Ти Electro-AI — помічник з енергетики та електротехніки. Відповідай українською. Не вигадуй дані з документів, не давай інструкцій для робіт під напругою, обходу захистів або зворотного живлення генератора. Чітко позначай, коли потрібен кваліфікований електрик."
    : "You are Electro-AI, an energy and electrical engineering assistant. Reply in English. Do not invent document data or give instructions for energized work, bypassing protections, or generator backfeeding. Clearly state when a qualified electrician is required.";
  const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL, input: [{ role: "system", content: system }, { role: "user", content: `Mode: ${typeof body?.mode === "string" ? body.mode : "Electrical Question"}\n\n${prompt}` }], max_output_tokens: 700 }) });
  if (!response.ok) return Response.json({ error: "The AI provider rejected the request" }, { status: 502 });
  const data = await response.json() as { output_text?: string };
  return Response.json({ answer: data.output_text ?? "" });
}

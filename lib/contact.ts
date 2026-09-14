import { getSiteUrl, siteConfig, verifiedMailbox } from "./site";

export function contactReady() {
  return Boolean(siteConfig.contactEmail && verifiedMailbox(process.env.CONTACT_FROM_EMAIL) &&
    process.env.RESEND_API_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY &&
    process.env.CONTACT_FORM_ENABLED === "true");
}

export async function handleContact(request: Request, send: typeof fetch = fetch) {
  const reply = (status: number, code: string) => Response.json({ code }, { status });
  if (request.headers.get("origin") !== getSiteUrl()) return reply(403, "invalid");
  if (!contactReady()) return reply(503, "unavailable");
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415, "invalid");
  // Bound the streamed body too: Content-Length is controlled by the caller.
  const reader = request.body?.getReader();
  if (!reader) return reply(400, "invalid");
  let size = 0, raw = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) { await reader.cancel(); return reply(413, "invalid"); }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return reply(400, "invalid");
    const { name, email, message, consent, website, token } = data;
    if (typeof name !== "string" || !name.trim() || name.length > 100 ||
      typeof email !== "string" || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
      typeof message !== "string" || message.trim().length < 20 || message.length > 4000 ||
      consent !== true || website || typeof token !== "string" || !token || token.length > 2048) return reply(400, "invalid");
    const verification = await send("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    const challenge = await verification.json();
    if (!verification.ok || !challenge.success || challenge.hostname !== new URL(getSiteUrl()).hostname || challenge.action !== "contact") return reply(403, "challenge");
    const sent = await send("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: verifiedMailbox(process.env.CONTACT_FROM_EMAIL), to: [siteConfig.contactEmail], reply_to: email,
        subject: "M Air Electro AI — website enquiry", text: `Name: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}` }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await sent.json();
    return sent.ok && typeof result.id === "string" ? reply(200, "accepted") : reply(502, "failed");
  } catch { return reply(400, "failed"); }
}

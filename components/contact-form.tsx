"use client";
import Link from "@/components/localized-link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Turnstile = {
  render: (node: HTMLElement, options: object) => string;
  remove: (id: string) => void;
};

export function ContactForm({ ro, enabled, siteKey }: { ro: boolean; enabled: boolean; siteKey?: string }) {
  const sending = useRef(false);
  const [uncertain, setUncertain] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [challengeStatus, setChallengeStatus] = useState<"pending" | "expired" | "error">("pending");
  const container = useRef<HTMLDivElement>(null);
  const l = (en: string, translated: string) => ro ? translated : en;
  useEffect(() => {
    const api = (window as unknown as { turnstile?: Turnstile }).turnstile;
    if (!enabled || !scriptReady || !api || !container.current) return;
    let active = true;
    const invalidate = (reason: "expired" | "error") => {
      if (active) { setToken(""); setChallengeStatus(reason); }
    };
    const id = api.render(container.current, {
      sitekey: siteKey, action: "contact", size: "flexible",
      callback: (value: string) => { if (active) setToken(value); },
      "expired-callback": () => invalidate("expired"),
      "error-callback": () => invalidate("error"),
      "timeout-callback": () => invalidate("expired"),
    });
    return () => { active = false; api.remove(id); };
  }, [enabled, scriptReady, siteKey, attempt]);
  if (!enabled) return <section className="content-panel">
    <h2>{l("Website contact form", "Formular de contact pe site")}</h2>
    <p role="status">{l("The website form is unavailable. Please use the email links above to send your enquiry.", "Formularul de pe site nu este disponibil. Folosește linkurile de email de mai sus pentru a trimite întrebarea.")}</p>
  </section>;
  return <section className="content-panel">
    <h2>{l("Send an enquiry", "Trimite o întrebare")}</h2>
    <form className="contact-form" onSubmit={async (event) => {
      event.preventDefault(); if (!enabled || busy || sending.current || uncertain) return;
      if (!token) {
        setStatus(l("Complete the spam check before sending your message.", "Finalizează verificarea anti-spam înainte de a trimite mesajul."));
        return;
      }
      const form = event.currentTarget, data = new FormData(form);
      const requestId = crypto.randomUUID();
      const unknownOutcome = () => { setUncertain(true); setStatus(l("Delivery outcome is unknown. Do not resend this enquiry until receipt is checked. Keep this reference: ", "Rezultatul trimiterii este necunoscut. Nu retrimite intrebarea pana la verificarea primirii. Pastreaza referinta: ") + requestId); };
      sending.current = true; setBusy(true); setStatus("");
      try {
        const response = await fetch("/api/contact", { method: "POST", signal: AbortSignal.timeout(45000), headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          name: data.get("name"), email: data.get("email"), message: data.get("message"), website: data.get("website"), consent: data.get("consent") === "on", token, requestId,
        }) });
        const result = await response.json();
        if (response.ok && result.code === "accepted") {
          trackEvent("contact_accepted");
          setStatus(l("Your message was accepted for delivery. Delivery to the mailbox is not yet confirmed.", "Mesajul a fost acceptat pentru livrare. Primirea în căsuța poștală nu este încă confirmată.")); form.reset();
        }
        else if (!["failed", "invalid", "challenge", "unavailable"].includes(result.code)) unknownOutcome();
        else setStatus(l("Message not sent. Check the fields and complete a fresh spam check, or use the verified email address.", "Mesajul nu a fost trimis. Verifică datele și repetă verificarea anti-spam sau folosește adresa verificată."));
      } catch { unknownOutcome(); }
      finally { sending.current = false; setBusy(false); setToken(""); setChallengeStatus("pending"); setAttempt(a => a + 1); }
    }}>
      <fieldset disabled={!enabled || busy}>
        <label>{l("Name", "Nume")}<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>{l("Message (20–4000 characters)", "Mesaj (20–4000 caractere)")}<textarea name="message" required minLength={20} maxLength={4000} rows={6} /></label>
        <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="consent-label"><input name="consent" type="checkbox" required /><span>{l("I agree to processing my name, email and message to answer this enquiry. No marketing subscription.", "Sunt de acord cu prelucrarea numelui, adresei și mesajului pentru răspuns. Fără abonare la marketing.")}</span></label>
        <p><Link href="/privacy">{l("Privacy notice", "Informare privind confidențialitatea")}</Link> · {l("Do not send sensitive documents or passwords.", "Nu trimite documente sensibile sau parole.")}</p>
        <div ref={container} />
        <p aria-live="polite">{uncertain ? l("Submission paused until receipt is checked.", "Trimiterea este oprita pana la verificarea primirii.") : token
          ? l("Spam check complete. You can send your message.", "Verificare anti-spam finalizată. Poți trimite mesajul.")
          : challengeStatus === "error"
            ? l("The spam check could not complete. Retry the check or use the email address above.", "Verificarea anti-spam nu s-a finalizat. Reîncearcă verificarea sau folosește adresa de email de mai sus.")
            : challengeStatus === "expired"
              ? l("The spam check expired. Complete a fresh check before sending.", "Verificarea anti-spam a expirat. Finalizează o verificare nouă înainte de trimitere.")
              : l("Complete the spam check to enable sending.", "Finalizează verificarea anti-spam pentru a putea trimite mesajul.")}</p>
        <button className="button-primary" type="submit" disabled={!token || uncertain}>{busy ? l("Sending…", "Se trimite…") : l("Send message", "Trimite mesajul")}</button>
      </fieldset>
    </form>
    <p role="status" aria-live="polite">{status}</p>
    {enabled && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setScriptReady(true)} onError={() => { setToken(""); setChallengeStatus("error"); }} />}
  </section>;
}

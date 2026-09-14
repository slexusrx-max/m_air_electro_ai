"use client";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";

export function ContactForm({ ro, enabled, siteKey }: { ro: boolean; enabled: boolean; siteKey?: string }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [attempt, setAttempt] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const l = (en: string, translated: string) => ro ? translated : en;
  function renderChallenge() {
    const api = (window as unknown as { turnstile?: { render: (node: HTMLElement, options: object) => void } }).turnstile;
    if (api && container.current && !container.current.hasChildNodes()) api.render(container.current, { sitekey: siteKey, action: "contact", size: "flexible" });
  }
  return <section className="content-panel">
    <h2>{l("Send an enquiry", "Trimite o întrebare")}</h2>
    {!enabled && <p role="status">{l("Private messaging is not available yet. The owner must configure and verify the domain mailbox before this form can send messages.", "Mesajele private nu sunt încă disponibile. Proprietarul trebuie să configureze și să verifice adresa de email a domeniului înainte de activarea formularului.")}</p>}
    <form className="contact-form" onSubmit={async (event) => {
      event.preventDefault(); if (!enabled || busy) return;
      const form = event.currentTarget, data = new FormData(form);
      setBusy(true); setStatus("");
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          name: data.get("name"), email: data.get("email"), message: data.get("message"), website: data.get("website"), consent: data.get("consent") === "on", token: data.get("cf-turnstile-response") || "",
        }) });
        const result = await response.json();
        if (response.ok && result.code === "accepted") { setStatus(l("Your message was accepted for delivery. Delivery to the mailbox is not yet confirmed.", "Mesajul a fost acceptat pentru livrare. Primirea în căsuța poștală nu este încă confirmată.")); form.reset(); }
        else setStatus(l("Message not sent. Check the fields and complete a fresh spam check, or use the verified email address.", "Mesajul nu a fost trimis. Verifică datele și repetă verificarea anti-spam sau folosește adresa verificată."));
      } catch { setStatus(l("Connection failed. Please try again later.", "Conexiune eșuată. Încearcă mai târziu.")); }
      finally { setBusy(false); setAttempt(a => a + 1); }
    }}>
      <fieldset disabled={!enabled || busy}>
        <label>{l("Name", "Nume")}<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>{l("Message (20–4000 characters)", "Mesaj (20–4000 caractere)")}<textarea name="message" required minLength={20} maxLength={4000} rows={6} /></label>
        <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="consent-label"><input name="consent" type="checkbox" required /><span>{l("I agree to processing my name, email and message to answer this enquiry. No marketing subscription.", "Sunt de acord cu prelucrarea numelui, adresei și mesajului pentru răspuns. Fără abonare la marketing.")}</span></label>
        <p><Link href="/privacy">{l("Privacy notice", "Informare privind confidențialitatea")}</Link> · {l("Do not send sensitive documents or passwords.", "Nu trimite documente sensibile sau parole.")}</p>
        {enabled && <div key={attempt} ref={(node) => { container.current = node; if (node) renderChallenge(); }} />}
        <button className="button-primary" type="submit">{busy ? l("Sending…", "Se trimite…") : l("Send message", "Trimite mesajul")}</button>
      </fieldset>
    </form>
    <p role="status" aria-live="polite">{status}</p>
    {enabled && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={renderChallenge} />}
  </section>;
}

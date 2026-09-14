export const authMessages = {
  unavailable: { ro: "Autentificarea nu este disponibilă momentan. Încearcă mai târziu; poți explora echipamentele fără cont.", en: "Accounts are temporarily unavailable. Try again later; you can explore equipment without an account." },
  credentials: { ro: "Adresa de e-mail sau parola este incorectă.", en: "The email address or password is incorrect." },
  required: { ro: "Introdu o adresă de e-mail validă și parola.", en: "Enter a valid email address and password." },
  password: { ro: "Parola trebuie să conțină cel puțin 8 caractere.", en: "The password must contain at least 8 characters." },
  mismatch: { ro: "Parolele nu coincid.", en: "Passwords do not match." },
  role: { ro: "Alege un rol valid.", en: "Choose a valid role." },
  blocked: { ro: "Acest cont este blocat.", en: "This account is blocked." },
  verify: { ro: "Verifică e-mailul pentru confirmarea contului. Dacă ai deja cont, autentifică-te sau resetează parola.", en: "Check your email to confirm your account. If you already have an account, sign in or reset your password." },
  reset: { ro: "Dacă există un cont pentru această adresă, vei primi un link de resetare.", en: "If an account exists for this address, you will receive a reset link." },
  expired: { ro: "Linkul nu este valid sau a expirat. Solicită un link nou.", en: "The link is invalid or expired. Request a new link." },
  unconfirmed: { ro: "Confirmă adresa de e-mail înainte de autentificare.", en: "Confirm your email address before signing in." },
  rate: { ro: "Prea multe încercări. Așteaptă câteva minute și încearcă din nou.", en: "Too many attempts. Wait a few minutes and try again." },
  fields: { ro: "Completează toate câmpurile obligatorii.", en: "Complete all required fields." },
  failed: { ro: "Modificarea nu a putut fi salvată. Verifică datele și încearcă din nou.", en: "The change could not be saved. Check your details and try again." },
} as const;
export function authErrorKey(code?: string) {
  if (code === "session_not_found" || code === "refresh_token_not_found" || code === "otp_expired") return "expired";
  if (code === "invalid_credentials") return "credentials";
  if (code === "email_not_confirmed") return "unconfirmed";
  if (code?.includes("rate_limit")) return "rate";
  if (code === "weak_password") return "password";
  return "failed";
}

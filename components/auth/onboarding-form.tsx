"use client";

import { useActionState, useState } from "react";

import type { ActionState } from "@/app/(auth)/actions";
import type { Country } from "@/lib/i18n/countries";
import type { Dictionary, RegistrationRole } from "@/lib/i18n/types";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  countries: Country[];
  dictionary: Dictionary;
  initialRole: RegistrationRole;
};

const inputClassName = "mt-2 w-full rounded-xl border border-white/20 bg-slate-950/30 px-3 py-3 text-white";

export function OnboardingForm({ action, countries, dictionary: t, initialRole }: Props) {
  const [step, setStep] = useState(1);
  const [role] = useState<RegistrationRole>(initialRole);
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState(false);
  const [language, setLanguage] = useState("en");
  const [state, formAction, pending] = useActionState(action, {});
  const advance = () => {
    if (step === 2 && !country) {
      setCountryError(true);
      return;
    }
    setStep((current) => current + 1);
  };
  const specializations = ["diagnostics", "automation", "marine", "power"] as const;

  return (
    <section className="glass-panel mx-auto w-full max-w-2xl rounded-[2rem] p-6 sm:p-8">
      <p className="text-sm text-lime-200">{step} / 4</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{t["onboarding.title"]}</h1>
      <p className="mt-2 text-sm text-white/68">{t["onboarding.description"]}</p>
      <form action={formAction} className="mt-7 space-y-6">
        <input type="hidden" name="preferred_language" value={language} />
        {step === 1 && <section><h2 className="text-lg font-semibold">{t[`role.${role}`]}</h2><p className="mt-2 text-sm text-white/70">{t[`role.${role}Description`]}</p><p className="mt-4 text-sm text-lime-100">{t["onboarding.roleFixed"]}</p></section>}
        {step === 2 && <section><label className="block text-lg font-semibold">{t["onboarding.country"]}<select required name="country_code" autoComplete="country" value={country} onChange={(event) => { setCountry(event.target.value); setCountryError(false); }} className={inputClassName}><option value="" disabled>{t["common.required"]}</option>{countries.map((item) => <option key={item.code} value={item.code}>{item.name} ({item.code})</option>)}</select></label>{countryError && <p role="alert" className="mt-2 text-sm text-red-200">Choose your country to continue.</p>}</section>}
        {step === 3 && <fieldset><legend className="text-lg font-semibold">{t["onboarding.language"]}</legend><div className="mt-3 grid grid-cols-3 gap-3">{["en", "ru", "ro"].map((code) => <label key={code} className="rounded-xl border border-white/20 p-3 has-[:checked]:border-lime-200"><input className="mr-2" type="radio" value={code} checked={language === code} onChange={() => setLanguage(code)} />{code.toUpperCase()}</label>)}</div></fieldset>}
        {step === 4 && <section className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium sm:col-span-2">{t["onboarding.fullName"]}<input required name="full_name" className={inputClassName} /></label>
          {role === "client" && <><label className="block text-sm font-medium sm:col-span-2">{t["onboarding.assistance"]}<textarea required name="assistance_type" rows={3} className={inputClassName} /></label><label className="block text-sm font-medium sm:col-span-2">{t["onboarding.companyOptional"]}<input name="company_name" className={inputClassName} /></label><label className="block text-sm font-medium sm:col-span-2">{t["onboarding.companyDescription"]}<textarea name="company_description" rows={3} className={inputClassName} /></label></>}
          {role === "expert" && <><label className="block text-sm font-medium">{t["onboarding.professionalTitle"]}<input required name="professional_title" className={inputClassName} /></label><label className="block text-sm font-medium">{t["onboarding.yearsExperience"]}<input required name="years_experience" type="number" min="0" max="80" className={inputClassName} /></label><fieldset className="sm:col-span-2"><legend className="text-sm font-medium">{t["onboarding.specializations"]}</legend><div className="mt-2 flex flex-wrap gap-4">{specializations.map((item) => <label key={item}><input type="checkbox" name="specializations" value={t[`onboarding.specialization.${item}`]} /> {t[`onboarding.specialization.${item}`]}</label>)}</div></fieldset><label className="block text-sm font-medium sm:col-span-2">{t["onboarding.professionalDescription"]}<textarea required name="professional_description" rows={4} className={inputClassName} /></label></>}
        </section>}
        {state.error && <p role="alert" className="text-sm text-red-200">{state.error}</p>}
        <div className="flex justify-end"><button type={step < 4 ? "button" : "submit"} disabled={pending} onClick={step < 4 ? advance : undefined} className="rounded-xl bg-lime-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{step < 4 ? t["onboarding.continue"] : t["onboarding.complete"]}</button></div>
      </form>
    </section>
  );
}

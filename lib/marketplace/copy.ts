import type { Dictionary } from "@/lib/i18n/types";
export const isRomanian = (t: Dictionary) => t.locale !== "en";
export function commercialCopy(t: Dictionary) {
  const ro = isRomanian(t);
  return {
    ro,
    locale: ro ? "ro-RO" : "en-GB",
    marketplace: ro ? "Echipamente" : "Equipment",
    finder: ro ? "Găsește soluția mea" : "Find My Solution",
    backup: ro ? "Calculator de autonomie" : "Backup Calculator",
    browse: ro ? "Vezi echipamentele" : "Browse Marketplace",
    about: ro ? "Despre proiect" : "About",
    contact: "Contact",
    privacy: ro ? "Confidențialitate" : "Privacy Policy",
    terms: ro ? "Condiții de utilizare" : "Terms",
    disclosure: ro ? "Transparență și afiliere" : "Affiliate Disclosure",
    safety: ro
      ? "Selecția finală și instalarea trebuie verificate de un electrician calificat, conform instrucțiunilor producătorului și cerințelor electrice aplicabile. Nu conecta un generator sau un invertor la o priză pentru a alimenta instalația casei."
      : "Final selection and installation must be checked by a qualified electrician against manufacturer instructions and applicable electrical requirements. Never backfeed house wiring through a socket with a generator or inverter.",
    supplierNote:
      t["affiliate.active"] === "true"
        ? ro
          ? "M Air Electro AI este independent. Unele legături marcate sunt afiliate: achizițiile eligibile pot genera un comision. Furnizorul stabilește prețul, stocul, plata, livrarea, garanția și retururile."
          : "M Air Electro AI is independent. Some marked links are affiliate links: qualifying purchases may generate a commission. The supplier controls price, stock, payment, delivery, warranty and returns."
        : ro
          ? "M Air Electro AI este un ghid independent. Legăturile către Renogy EU sunt legături obișnuite către furnizor, fără urmărire afiliată. Furnizorul stabilește prețul, stocul, plata, livrarea, garanția și retururile."
          : "M Air Electro AI is an independent guide. Renogy EU links are ordinary supplier links without affiliate tracking. The supplier controls price, stock, payment, delivery, warranty and returns.",
    price: ro
      ? "Verifică prețul actual la furnizor"
      : "Check current price at supplier",
    review: ro ? "Citește ghidul" : "Read the guide",
    categories: ro
      ? "Alege componenta sistemului"
      : "Choose a system component",
    products: ro
      ? "Selecții explicate, pentru o alegere informată"
      : "Explained selections for an informed choice",
    productIntro: ro
      ? "Compară rolul, limitele și compatibilitatea fiecărei componente. Ghidurile de clasă descriu o configurație, iar exemplele de produs trimit la modelul real al producătorului."
      : "Compare each component’s role, limitations and compatibility. Class guides describe a configuration; product examples link to the manufacturer's actual model.",
    equipmentClass: ro
      ? "Ghid de clasă — nu un model comercial"
      : "Equipment class guide — not a specific model",
    productExample: ro
      ? "Exemplu de produs documentat"
      : "Reviewed product example",
    specs: ro ? "Repere tehnice" : "Technical reference",
    use: ro ? "Când este potrivit" : "Suitable uses",
    advantages: ro ? "Avantaje practice" : "Practical advantages",
    limits: ro ? "Limite și compatibilitate" : "Limitations and compatibility",
    why: ro ? "De ce merită analizat" : "Why consider this option",
    checked: ro ? "Revizie editorială" : "Editorial review",
    visit: ro
      ? "Vezi la furnizorul Renogy EU ↗"
      : "Visit Renogy EU supplier ↗",
    illustration: ro
      ? "Ilustrație tehnică M Air; nu este o fotografie a produsului."
      : "Original M Air technical illustration; not a product photograph.",
  };
}

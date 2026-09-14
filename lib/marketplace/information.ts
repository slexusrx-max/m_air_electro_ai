import { policies } from "./policies";
import { bilingual as b, type LocalText } from "./content";
export type InformationPage = {
  title: LocalText;
  intro: LocalText;
  sections: { title: LocalText; body: LocalText }[];
};
const s = (en: string, ro: string, body: string, translated: string) => ({
  title: b(en, ro),
  body: b(body, translated),
});
export const information: Record<string, InformationPage> = {
  ...policies,
  about: {
    title: b("About M Air Electro AI", "Despre M Air Electro AI"),
    intro: b(
      "An independent product discovery, comparison and sizing platform for Romania and the EU.",
      "Platformă independentă de descoperire, comparație și dimensionare a echipamentelor energetice pentru România și UE.",
    ),
    sections: [
      s(
        "What we help you decide",
        "Ce te ajutăm să decizi",
        "Move from a need to a load calculation, understand the equipment roles, compare documented options and visit an external supplier. Solar, batteries, inverters, backup and charging form the core catalog; industrial and marine paths add application-specific considerations.",
        "Pornește de la nevoie, calculează sarcina, înțelege rolurile echipamentelor, compară opțiuni documentate și vizitează furnizorul extern. Solarul, bateriile, invertoarele, rezerva și încărcarea formează nucleul; industrialul și navalul adaugă cerințe specifice.",
      ),
      s(
        "Editorial independence",
        "Independență editorială",
        "Calculations are deterministic and assumptions are visible. Real models have official source links; equipment classes are explicitly labelled. We do not fabricate prices, stock, ratings, reviews or expert verification. AI assistance and a future expert network support the buying decision.",
        "Calculele sunt deterministe, cu ipoteze vizibile. Modelele reale au surse oficiale; clasele sunt etichetate explicit. Nu inventăm prețuri, stoc, evaluări, recenzii sau verificări de experți. AI și viitoarea rețea de experți susțin decizia.",
      ),
      s(
        "Commercial role",
        "Rol comercial",
        "We are not the seller, warehouse or Renogy dealer. Renogy EU is the first intended affiliate supplier, with approval not yet confirmed. Until approval and configuration, supplier links are ordinary external links. The supplier handles orders, delivery, warranty and returns.",
        "Nu suntem vânzător, depozit sau dealer Renogy. Renogy EU este primul furnizor vizat pentru afiliere, fără aprobare confirmată. Până la aprobare și configurare, linkurile sunt normale. Furnizorul gestionează comenzile, livrarea, garanția și retururile.",
      ),
    ],
  },
  business: {
    title: b("For business", "Pentru afaceri"),
    intro: b(
      "Build a clear equipment brief for installers, contractors, small businesses, RV and marine specialists, and industrial maintenance teams.",
      "Pregătește cerințe clare pentru instalatori, contractori, afaceri mici, specialiști în rulote și naval, și mentenanță industrială.",
    ),
    sections: [
      s(
        "Available now",
        "Disponibil acum",
        "Use system sizing, electrical calculators, buying guides and independent catalog comparison to document project assumptions. Share comparison URLs and record required power, energy, voltage and operating environment before requesting quotes directly from suppliers.",
        "Folosește dimensionarea, calculatoarele, ghidurile și comparațiile pentru ipotezele proiectului. Distribuie URL-urile comparațiilor și notează puterea, energia, tensiunea și mediul înainte de cereri de ofertă direct la furnizori.",
      ),
      s(
        "Procurement and project inquiries",
        "Achiziții și cerințe de proiect",
        "We can receive product corrections, supplier-interest and project-feedback inquiries through the contact path. Bulk pricing, installation contracts, procurement fulfilment and project engineering are not offered as active services on this website. Request binding offers from the actual supplier or contractor.",
        "Primim corecții de produse, interes din partea furnizorilor și feedback de proiect prin contact. Prețurile de volum, contractele de instalare, achizițiile gestionate și proiectarea nu sunt servicii active ale site-ului. Cere oferte ferme furnizorului sau contractorului real.",
      ),
      s(
        "Future supplier relationships",
        "Relații viitoare cu furnizorii",
        "Future supplier onboarding will require identity, regional delivery, product-source and commercial-term checks. Inclusion will not imply certification, and payment integration will not be activated without a separate owner-approved scope.",
        "Viitoarea integrare a furnizorilor va cere verificarea identității, livrării regionale, surselor și condițiilor. Includerea nu implică certificare, iar plățile nu se activează fără un scop separat aprobat de proprietar.",
      ),
    ],
  },
  experts: {
    title: b("Professional help", "Ajutor profesional"),
    intro: b(
      "Use a qualified professional to turn a planning estimate into an installation-specific design. The expert marketplace is a future service layer.",
      "Folosește un profesionist calificat pentru transformarea estimării în proiect specific instalației. Marketplace-ul de experți este un serviciu viitor.",
    ),
    sections: [
      s(
        "No fictional profiles",
        "Fără profiluri fictive",
        "No verified professional profiles are currently published. We do not promise response times, availability, certifications or a completed verification process. Use the contact path to express professional onboarding interest or suggest a regional service requirement.",
        "Nu sunt publicate în prezent profiluri profesionale verificate. Nu promitem timpi de răspuns, disponibilitate, certificări sau verificări finalizate. Folosește contactul pentru interes de înscriere profesională sau cerințe regionale.",
      ),
      s(
        "Prepare for an assessment",
        "Pregătește evaluarea",
        "Bring your load list, supply voltage and phases, expected autonomy, existing equipment model numbers, site conditions and calculated assumptions. Ask the professional to validate cable sizing, overcurrent protection, transfer arrangements, earthing and commissioning tests.",
        "Pregătește lista sarcinilor, tensiunea și fazele, autonomia, modelele existente, condițiile și ipotezele. Cere validarea cablurilor, protecțiilor, transferului, împământării și testelor de punere în funcțiune.",
      ),
      s(
        "Future verification",
        "Verificare viitoare",
        "A future directory will distinguish declared skills from checked credentials, identify regions and service scope, and require consent before publishing a profile. Until that process is operational, this page is an information and contact path, not a booking service.",
        "Viitorul director va distinge competențele declarate de acreditările verificate, va arăta regiunile și scopul și va cere acordul înainte de publicare. Până atunci, pagina oferă informații și contact, nu rezervări.",
      ),
    ],
  },
  "affiliate-disclosure": {
    title: b(
      "Affiliate and supplier disclosure",
      "Transparență privind afilierea și furnizorii",
    ),
    intro: b(
      "Know who provides the information, who sells the equipment and whether a link is tracked.",
      "Află cine oferă informația, cine vinde echipamentul și dacă un link este urmărit.",
    ),
    sections: [
      s(
        "Current status",
        "Starea actuală",
        "Renogy EU is the first intended affiliate merchant. Approval is not confirmed; we do not claim an official partnership, dealership or stock ownership. Current catalog links point directly to ordinary supplier pages, with no configured Impact attribution.",
        "Renogy EU este primul comerciant vizat pentru afiliere. Aprobarea nu este confirmată; nu pretindem parteneriat oficial, statut de dealer sau proprietate asupra stocului. Linkurile actuale duc direct la pagini normale, fără atribuire Impact configurată.",
      ),
      s(
        "After approval",
        "După aprobare",
        "If an affiliate program is approved and activated, some qualifying purchases may earn M Air Electro AI a commission. Activation requires explicit approval status and the actual provider-issued Impact link configuration. The disclosure must be updated at activation. Editorial descriptions and factual comparisons remain separate from tracking configuration.",
        "Dacă programul este aprobat și activat, unele achiziții eligibile pot aduce comision platformei. Activarea cere statut explicit de aprobare și configurația Impact emisă de furnizor. Politica trebuie actualizată la activare. Descrierile și comparațiile rămân separate de urmărire.",
      ),
      s(
        "Buying and verification",
        "Cumpărare și verificare",
        "The external merchant sets price, stock, taxes, shipping, warranty and return conditions. Confirm the exact model and delivery to Romania before ordering. Our catalog is not a live merchant feed. Illustrations are original schematics, and equipment-class records are not claims that a specific product exists or is available.",
        "Comerciantul extern stabilește prețul, stocul, taxele, livrarea, garanția și retururile. Confirmă modelul și livrarea în România înainte de comandă. Catalogul nu este flux comercial live. Ilustrațiile sunt scheme originale, iar clasele nu pretind existența sau disponibilitatea unui produs specific.",
      ),
    ],
  },
  privacy: {
    title: b("Privacy and data use", "Confidențialitate și utilizarea datelor"),
    intro: b(
      "This notice describes the current discovery and calculation experience and its optional connected services.",
      "Această informare descrie experiența actuală de descoperire și calcul și serviciile conectate opționale.",
    ),
    sections: [
      s(
        "Browsing and local preferences",
        "Navigare și preferințe locale",
        "Language is stored in the mr-electro-locale cookie. Comparison selections and optional home-energy profiles are stored in your browser's local storage; clear site data to remove them. Search and comparison parameters appear in URLs and may be included in browser history or hosting request logs. Avoid entering personal or sensitive information in product searches.",
        "Limba se salvează în cookie-ul mr-electro-locale. Selecțiile pentru comparație și profilul energetic opțional se păstrează local în browser; ștergerea datelor site-ului le elimină. Parametrii căutării și comparației apar în URL, istoric sau jurnalele găzduirii. Nu introduce date personale ori sensibile în căutarea produselor.",
      ),
      s(
        "Accounts and optional tools",
        "Conturi și instrumente opționale",
        "If you use configured authentication, Supabase processes the account and session information needed for sign-in. Optional AI or document tools can send the information you explicitly submit to their configured service providers. The public marketplace does not require an account. Do not upload confidential technical or personal material without authority to share it.",
        "Dacă folosești autentificarea configurată, Supabase procesează datele de cont și sesiune necesare. Instrumentele opționale AI sau documente pot trimite informația introdusă explicit către furnizorii configurați. Marketplace-ul public nu cere cont. Nu încărca documente confidențiale sau date personale fără dreptul de partajare.",
      ),
      s(
        "External sites and requests",
        "Site-uri externe și solicitări",
        "Following a supplier link opens an external website with its own privacy and cookie policies. Ordinary links are currently used for Renogy EU. Contact us about access, correction or deletion of information you supplied; use the configured contact channel and avoid posting personal data in public issue reports. Retention of hosting and provider logs follows the configured service policies.",
        "Linkul către furnizor deschide un site extern cu propriile politici. Pentru Renogy EU folosim acum linkuri normale. Contactează-ne pentru acces, corectare sau ștergerea informației furnizate; folosește canalul configurat și evită date personale în sesizări publice. Păstrarea jurnalelor depinde de politicile serviciilor configurate.",
      ),
    ],
  },
  terms: {
    title: b("Terms of use", "Termeni de utilizare"),
    intro: b(
      "M Air Electro AI supports independent equipment research and preliminary calculations. Purchasing takes place with an external supplier.",
      "M Air Electro AI susține cercetarea independentă și calculele preliminare. Cumpărarea are loc la furnizorul extern.",
    ),
    sections: [
      s(
        "Scope and limits",
        "Scop și limite",
        "Calculators, guides and recommendations support planning. They are not certified designs, installation instructions or a substitute for qualified assessment. Verify inputs, product manuals, regional suitability and site requirements before purchase or installation. Do not work on energised equipment based on website content.",
        "Calculatoarele, ghidurile și recomandările susțin planificarea. Nu sunt proiecte certificate, instrucțiuni de instalare sau înlocuitor al evaluării calificate. Verifică datele, manualele, compatibilitatea regională și locația înainte de cumpărare ori montaj. Nu lucra sub tensiune pe baza site-ului.",
      ),
      s(
        "External purchases",
        "Achiziții externe",
        "We do not accept equipment orders, hold customer stock, collect product payments or administer merchant returns. The purchase contract is with the supplier you choose. Review the supplier's identity, delivery, warranty and return terms. Nothing in these website terms is intended to remove mandatory consumer rights that apply to your transaction.",
        "Nu primim comenzi de echipamente, nu deținem stoc, nu colectăm plăți pentru produse și nu gestionăm retururile comercianților. Contractul este cu furnizorul ales. Verifică identitatea, livrarea, garanția și retururile. Acești termeni nu urmăresc eliminarea drepturilor obligatorii aplicabile tranzacției.",
      ),
      s(
        "Accuracy and appropriate use",
        "Acuratețe și utilizare adecvată",
        "Catalog information has a review date and may change at the supplier. Report errors through Contact. Do not use the service to submit unlawful material, access other users' information or bypass security. Expert booking, inventory fulfilment and protected marketplace payment services are not currently offered.",
        "Informațiile au dată de revizuire și se pot schimba la furnizor. Raportează erorile prin Contact. Nu trimite materiale ilegale, nu accesa datele altora și nu ocoli securitatea. Rezervarea experților, livrarea din stoc și plățile protejate marketplace nu sunt oferite acum.",
      ),
    ],
  },
  methodology: {
    title: b(
      "Calculation and editorial methodology",
      "Metodologia calculelor și conținutului",
    ),
    intro: b(
      "We keep equations, assumptions, editorial judgments and supplier facts distinct.",
      "Separăm ecuațiile, ipotezele, evaluările editoriale și datele furnizorilor.",
    ),
    sections: [
      s(
        "Deterministic calculations",
        "Calcule deterministe",
        "Energy is the sum of load watts multiplied by operating hours. Battery sizing divides required delivered energy by usable discharge fraction and conversion efficiency. Solar sizing divides daily energy by peak-sun-hours and a declared yield factor. Power and surge checks are separate. Defaults are illustrative and must be replaced with measured or justified inputs.",
        "Energia este suma puterilor înmulțite cu orele. Bateria rezultă prin împărțire la fracția utilizabilă și randament. Solarul rezultă din energia zilnică împărțită la ore echivalente și factor declarat. Puterea și vârful se verifică separat. Valorile implicite sunt ilustrative și cer date măsurate ori justificate.",
      ),
      s(
        "Catalog evidence",
        "Dovezi în catalog",
        "Real products link to official model pages and carry only documented fields. Derived values, such as voltage multiplied by Ah, are labelled. Equipment classes describe procurement roles without invented models or specifications. Missing data remains unknown and is not treated as a negative or positive feature in comparison.",
        "Produsele reale trimit la pagini oficiale și includ doar câmpuri documentate. Valorile calculate, precum tensiune × Ah, sunt etichetate. Clasele descriu roluri fără modele sau specificații inventate. Datele lipsă rămân necunoscute și nu devin funcții prezente sau absente.",
      ),
      s(
        "Recommendation limits",
        "Limitele recomandării",
        "A matching category or product is a candidate for review, not a compatibility certificate. Final selection needs minimum operating voltage, continuous and timed surge ratings, charging limits, protection, environmental conditions and installation review. We do not infer prices, availability, ratings or certifications.",
        "Categoria sau produsul potrivit este candidat de verificat, nu certificat de compatibilitate. Selecția finală cere tensiune minimă, curenți continui și temporizați, încărcare, protecție, mediu și evaluare de montaj. Nu deducem prețuri, disponibilitate, evaluări ori certificări.",
      ),
    ],
  },
};

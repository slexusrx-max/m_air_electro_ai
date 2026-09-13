import Link from "next/link";
import { rootCategories } from "@/lib/marketplace/content";
import { solutions } from "@/lib/marketplace/solutions";
import { guides } from "@/lib/marketplace/guides";
import { catalog } from "@/lib/affiliate/catalog";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { ProductCard } from "./product-card";
import { LinkGrid } from "./shared";
import { AffiliateDisclosure } from "./affiliate-disclosure";
export async function DiscoveryHome({
  marketplace = false,
  requirements,
}: {
  marketplace?: boolean;
  requirements?: Record<string, string | undefined>;
}) {
  const locale = await getRequestLocale();
  const t = await getRequestDictionary();
  const ro = locale === "ro";
  return (
    <main className="commerce-page">
      <section className="discovery-hero">
        <div>
          <p className="eyebrow">M Air Electro AI · România / EU</p>
          <h1>
            {marketplace
              ? ro
                ? "Echipamentul potrivit începe cu cerințe clare."
                : "The right equipment starts with clear requirements."
              : ro
                ? "Calculează necesarul. Compară echipamentele."
                : "Size your system. Compare your equipment."}
          </h1>
          <p>
            {ro
              ? "Panouri solare, baterii, invertoare și rezervă de energie. Înțelege sistemul, explorează opțiunile și alege informat înainte de a vizita furnizorul."
              : "Solar panels, batteries, inverters and backup power. Understand the system, explore the options and make an informed choice before visiting a supplier."}
          </p>
          <div className="action-row">
            <Link
              className="button-primary"
              href={
                marketplace ? "/marketplace/find-my-solution" : "/marketplace"
              }
            >
              {marketplace
                ? ro
                  ? "Găsește soluția"
                  : "Find My Solution"
                : ro
                  ? "Explorează marketplace"
                  : "Explore marketplace"}
            </Link>
            <Link
              className="button-outline"
              href={marketplace ? "/compare" : "/marketplace/find-my-solution"}
            >
              {marketplace
                ? ro
                  ? "Compară echipamente"
                  : "Compare equipment"
                : ro
                  ? "Găsește soluția"
                  : "Find My Solution"}
            </Link>
          </div>
          <form action="/search" className="hero-search">
            <label className="sr-only" htmlFor="hero-query">
              {ro ? "Caută echipamente" : "Search equipment"}
            </label>
            <input
              id="hero-query"
              name="q"
              placeholder={
                ro
                  ? "Caută 100 Ah, 200 W, Renogy…"
                  : "Search 100 Ah, 200 W, Renogy…"
              }
              maxLength={120}
            />
            <button type="submit">{ro ? "Caută" : "Search"} →</button>
          </form>
        </div>
        <aside className="hero-system">
          <p>{ro ? "DE LA NEVOIE LA ALEGERE" : "FROM NEED TO CHOICE"}</p>
          <div className="system-flow">
            <span>
              01 <strong>{ro ? "Consum & autonomie" : "Load & runtime"}</strong>
            </span>
            <span>
              02{" "}
              <strong>
                {ro ? "Baterie & invertor" : "Battery & inverter"}
              </strong>
            </span>
            <span>
              03{" "}
              <strong>{ro ? "Solar & încărcare" : "Solar & charging"}</strong>
            </span>
            <span>
              04{" "}
              <strong>{ro ? "Compară & verifică" : "Compare & verify"}</strong>
            </span>
          </div>
          <p className="small-copy">
            {ro
              ? "Calcule explicabile. Specificații cu surse. Fără prețuri sau stocuri inventate."
              : "Transparent calculations. Sourced specifications. No invented prices or inventory."}
          </p>
        </aside>
      </section>
      {requirements && (requirements.batteryKwh || requirements.inverterKw) && (
        <section className="content-panel">
          <h2>
            {ro
              ? "Cerințe primite din calculator"
              : "Requirements received from calculator"}
          </h2>
          <p>
            {ro ? "Baterie" : "Battery"}: {requirements.batteryKwh ?? "—"} kWh ·{" "}
            {ro ? "Invertor" : "Inverter"}: {requirements.inverterKw ?? "—"} kW
            · {ro ? "Vârf" : "Surge"}: {requirements.surgeKw ?? "—"} kW ·{" "}
            {requirements.region ?? "EU"}
          </p>
          <p>
            {ro
              ? "Aceste valori descriu sistemul necesar, nu compatibilitatea automată a unui produs."
              : "These values describe the system requirement, not automatic product compatibility."}
          </p>
          <Link href="/marketplace/batteries">
            {ro ? "Verifică baterii" : "Review batteries"} →
          </Link>
        </section>
      )}
      <section>
        <div className="section-line">
          <div>
            <p className="eyebrow">Marketplace</p>
            <h2>
              {ro ? "Explorează după componentă" : "Explore by component"}
            </h2>
          </div>
          <Link href="/search">
            {ro ? "Toate echipamentele" : "All equipment"} →
          </Link>
        </div>
        <LinkGrid
          locale={locale}
          items={rootCategories.map((c) => ({
            href: `/marketplace/${c.path}`,
            title: c.title,
            summary: c.summary,
          }))}
        />
      </section>
      <section className="solution-banner">
        <div>
          <p className="eyebrow">
            {ro ? "Nu știi de unde să începi?" : "Not sure where to start?"}
          </p>
          <h2>
            {ro
              ? "Spune ce vrei să alimentezi."
              : "Tell us what you need to power."}
          </h2>
          <p>
            {ro
              ? "Locuință, rulotă, ambarcațiune sau afacere. Introdu puterea și autonomia pentru o estimare transparentă."
              : "Home, RV, boat or business. Enter load and runtime for a transparent starting estimate."}
          </p>
        </div>
        <Link className="button-primary" href="/marketplace/find-my-solution">
          {ro ? "Găsește soluția" : "Find My Solution"} →
        </Link>
      </section>
      <section>
        <div className="section-line">
          <h2>
            {ro ? "Soluții pentru situația ta" : "Solutions for your setting"}
          </h2>
          <Link href="/solutions">
            {ro ? "Toate soluțiile" : "All solutions"} →
          </Link>
        </div>
        <LinkGrid
          locale={locale}
          items={solutions
            .slice(0, 4)
            .map((s) => ({
              href: `/solutions/${s.slug}`,
              title: s.title,
              summary: s.summary,
            }))}
        />
      </section>
      <section>
        <div className="section-line">
          <h2>
            {ro
              ? "Modele documentate, selecție independentă"
              : "Documented models, independent selection"}
          </h2>
          <Link href="/search?kind=product">
            {ro ? "Vezi modelele" : "View models"} →
          </Link>
        </div>
        <div className="product-grid">
          {catalog
            .filter((p) => p.kind === "product")
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.id} product={p} dictionary={t} />
            ))}
        </div>
      </section>
      <section className="content-panel">
        <h2>
          {ro
            ? "Cum funcționează M Air Electro AI"
            : "How M Air Electro AI works"}
        </h2>
        <ol className="journey">
          <li>
            <strong>{ro ? "Calculează" : "Calculate"}</strong>
            <p>
              {ro
                ? "Separă puterea de energie și stabilește autonomia."
                : "Separate power from energy and define runtime."}
            </p>
          </li>
          <li>
            <strong>{ro ? "Înțelege" : "Understand"}</strong>
            <p>
              {ro
                ? "Verifică tensiunile, curenții și compatibilitatea."
                : "Check voltages, currents and compatibility."}
            </p>
          </li>
          <li>
            <strong>{ro ? "Compară" : "Compare"}</strong>
            <p>
              {ro
                ? "Compară câmpurile documentate și limitele."
                : "Compare documented fields and limitations."}
            </p>
          </li>
          <li>
            <strong>{ro ? "Vizitează furnizorul" : "Visit supplier"}</strong>
            <p>
              {ro
                ? "Confirmă modelul, livrarea și condițiile înainte de comandă."
                : "Confirm the model, delivery and terms before ordering."}
            </p>
          </li>
        </ol>
      </section>
      <section className="two-columns">
        <div className="content-panel">
          <p className="eyebrow">
            {ro ? "Calcule pentru alegere" : "Calculate before choosing"}
          </p>
          <h2>{ro ? "De la Wh la componente" : "From Wh to components"}</h2>
          <div className="link-stack">
            <Link href="/calculators/battery">
              {ro
                ? "Capacitate și autonomie baterie"
                : "Battery capacity & runtime"}{" "}
              →
            </Link>
            <Link href="/calculators/solar">
              {ro ? "Puterea panourilor solare" : "Solar array sizing"} →
            </Link>
            <Link href="/backup-calculator">
              {ro ? "Sistem de rezervă" : "Backup system sizing"} →
            </Link>
            <Link href="/calculators/cable-sizing">
              {ro
                ? "Cabluri și cădere de tensiune"
                : "Cable sizing & voltage drop"}{" "}
              →
            </Link>
          </div>
        </div>
        <div className="content-panel">
          <p className="eyebrow">
            {ro ? "Învață înainte să cumperi" : "Learn before you buy"}
          </p>
          <h2>
            {ro
              ? "Specificațiile au nevoie de context."
              : "Specifications need context."}
          </h2>
          <p>
            {ro
              ? "100 Ah nu exprimă singur energia. 2000 W nu descriu durata unui vârf. Ghidurile explică diferențele care contează la alegere."
              : "100 Ah alone does not express energy. 2000 W does not describe surge duration. Our guides explain the differences that matter when choosing."}
          </p>
          <Link href="/learn">
            {ro ? "Deschide centrul de ghiduri" : "Open the learning centre"} →
          </Link>
        </div>
      </section>
      <section>
        <h2>{ro ? "Ghiduri de început" : "Start with these guides"}</h2>
        <LinkGrid
          locale={locale}
          items={guides
            .slice(0, 6)
            .map((g) => ({
              href: `/learn/${g.slug}`,
              title: g.title,
              summary: g.intro,
            }))}
        />
      </section>
      <section className="solution-banner">
        <div>
          <h2>
            {ro
              ? "Pregătește discuția cu instalatorul."
              : "Prepare the conversation with your installer."}
          </h2>
          <p>
            {ro
              ? "Folosește calculele și lista de cerințe pentru o evaluare profesională. Rețeaua de experți este în dezvoltare; nu publicăm profiluri fictive."
              : "Use calculations and a requirements brief for a professional assessment. The expert network is being developed; we do not publish fictional profiles."}
          </p>
        </div>
        <Link href="/experts" className="button-outline">
          {ro ? "Ajutor profesional" : "Professional help"} →
        </Link>
      </section>
      <AffiliateDisclosure dictionary={t} />
    </main>
  );
}

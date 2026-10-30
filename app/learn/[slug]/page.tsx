import { EditorialRecord } from "@/components/editorial-record";
import { EnergyExample } from "@/components/marketplace/energy-example";
import Link from "@/components/localized-link";
import { notFound } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import {
  Breadcrumbs,
  Intro,
  LinkGrid,
  Faq,
} from "@/components/marketplace/shared";
import { ProductCard } from "@/components/marketplace/product-card";
import { guides, learnHubs } from "@/lib/marketplace/guides";
import { categoryByPath, local } from "@/lib/marketplace/content";
import { catalog } from "@/lib/affiliate/catalog";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const g = guides.find((g) => g.slug === slug);
  const hub = learnHubs.find((h) => h.slug === slug);
  if (!g && !hub) notFound();
  const locale = await getRequestLocale();
  return buildMetadata({
    locale,
    title: g ? local(g.title, locale) : `${local(hub!.title, locale)} — ${locale === "ro" ? "bibliotecă de ghiduri" : "guide library"}`,
    description: g
      ? `${local(g.title, locale)}. ${local(g.intro, locale)}`
      : `${local(hub!.title, locale)} — ${locale === "ro" ? "ghiduri, calcule și echipamente pentru alegerea sistemului." : "guides, calculations and equipment for system planning."}`,
    path: `/learn/${slug}`,
  });
}
export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  const t = await getRequestDictionary();
  const g = guides.find((g) => g.slug === slug);
  const hub = learnHubs.find((h) => h.slug === slug);
  if (!g && !hub) notFound();
  if (hub)
    return (
      <PlatformShell>
        <main className="commerce-page">
          <Breadcrumbs
            items={[
              { name: ro ? "Ghiduri" : "Learn", path: "/learn" },
              { name: local(hub.title, locale), path: `/learn/${slug}` },
            ]}
          />
          <Intro
            title={local(hub.title, locale)}
            description={
              ro
                ? "Alege un ghid, verifică exemplul și continuă cu un calculator sau o categorie de echipamente."
                : "Choose a guide, check the worked example and continue to a calculator or equipment category."
            }
          />
          <LinkGrid
            locale={locale}
            items={guides
              .filter((g) => g.hub === slug || g.level === slug)
              .map((g) => ({
                href: `/learn/${g.slug}`,
                title: g.title,
                summary: g.intro,
              }))}
          />
          <Link href="/learn">{ro ? "Toate ghidurile" : "All guides"} →</Link>
        </main>
      </PlatformShell>
    );
  if (!g) notFound();
  const category = categoryByPath(g.category)!;
  const equipmentGroups = g.equipmentGroups?.map(group => ({
    ...group,
    products: group.productIds.flatMap(id => {
      const product = catalog.find(p => p.id === id && p.kind === "product" && p.availability !== "unavailable");
      return product ? [product] : [];
    }),
  })).filter(group => group.products.length > 0);

  return (
    <PlatformShell>
      <main className="commerce-page">

        <Breadcrumbs
          items={[
            { name: ro ? "Ghiduri" : "Learn", path: "/learn" },
            {
              name: local(
                learnHubs.find((h) => h.slug === g.hub)!.title,
                locale,
              ),
              path: `/learn/${g.hub}`,
            },
            { name: local(g.title, locale), path: `/learn/${slug}` },
          ]}
        />
        <div className="article-layout">
          <article className="content-panel article-body">
            <Intro
              title={local(g.title, locale)}
              description={local(g.intro, locale)}
            />
            <EditorialRecord path={`/learn/${slug}`} title={local(g.title, locale)} ro={ro} sources={g.sources} />
            {g.sections.map((s, i) => (
              <section id={`section-${i + 1}`} key={s.title.en}>
                <h2>{local(s.title, locale)}</h2>
                <p>{local(s.body, locale)}</p>
              </section>
            ))}
            {(["how-to-size-backup-battery", "battery-runtime-calculation", "apartment-backup-system"].includes(slug) || slug === "rv-solar-basics") && <EnergyExample kind={slug === "rv-solar-basics" ? "rv" : "apartment"} ro={ro} />}
            {slug === "how-to-size-backup-battery" && <section id="choose-backup-path" className="content-panel">
              <h2>{ro ? "Alege următorul pas" : "Choose your next step"}</h2>
              <p>{ro
                ? "Pentru o stație AC gata de utilizare, începe cu aparatele și autonomia în selector. Pentru o baterie separată, verifică întregul sistem și manualele componentelor. Rezultatele selectorului sunt o verificare preliminară, nu o confirmare a compatibilității sau a livrării."
                : "For a ready-to-use AC station, start with your appliances and runtime in the finder. For a separate battery, check the complete system and component manuals. Finder results are an initial screening, not confirmation of compatibility or delivery."}</p>
              <div className="action-row">
                <Link className="button-primary" href="/marketplace/find-my-solution">{ro ? "Găsește o stație pentru consumatorii tăi" : "Find a station for your loads"} →</Link>
                <Link href="/marketplace/backup-power">{ro ? "Explorează alimentarea de rezervă" : "Explore backup power"} →</Link>
                <Link href="/marketplace/batteries">{ro ? "Explorează bateriile separate" : "Explore separate batteries"} →</Link>
              </div>
            </section>}
            <section>
              <h2>
                {ro
                  ? "Transformă explicația într-o listă de achiziție"
                  : "Turn the explanation into a procurement brief"}
              </h2>
              <p>
                {ro
                  ? "Notează consumatorii incluși și excluși, tensiunea sistemului, puterea simultană, vârful și durata necesară. Păstrează ipotezele de randament și sezon lângă rezultat. Compară numai valori documentate pentru modelul exact; un câmp lipsă în catalog înseamnă că trebuie verificat, nu că funcția există. Cere furnizorului manualul, condițiile de livrare în România și procedura de garanție înainte de comandă."
                  : "Record included and excluded loads, system voltage, simultaneous power, starting demand and required duration. Keep efficiency and seasonal assumptions beside the result. Compare only documented values for the exact model; a missing catalog field means it needs verification, not that a feature exists. Ask the supplier for the manual, Romania delivery terms and warranty procedure before ordering."}
              </p>
              <p>
                {ro
                  ? "După alegerea componentelor, un instalator calificat trebuie să verifice cablurile, protecțiile, separarea surselor, ventilația și condițiile locației. Nu folosi exemplul de calcul drept instrucțiune de cablare. La schimbarea unui consumator sau a bateriei, refă atât bugetul energetic, cât și verificarea de putere. Un test de funcționare supravegheat trebuie să confirme ipotezele fără depășirea limitelor producătorului."
                  : "After selecting components, a qualified installer should verify cables, protection, source isolation, ventilation and site conditions. Do not use a worked energy example as wiring instructions. When changing a load or battery, revisit both the energy budget and power check. A supervised operating test should confirm assumptions without exceeding manufacturer limits."}
              </p>
            </section>
            <section>
              <h2>
                {ro
                  ? "Surse și lectură tehnică"
                  : "Sources and technical reading"}
              </h2>
              <ul>
                {g.sources.map((url, i) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url.includes("europa")
                        ? "European Commission · PVGIS"
                        : url.includes("cpsc.gov") ? "U.S. Consumer Product Safety Commission · Carbon monoxide"
                        : "Victron Energy · Technical information / Wiring Unlimited"}{" "}
                      {i > 0 ? "↗" : "↗"}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="small-copy">
                {ro
                  ? "Explicație editorială independentă. Exemplele numerice sunt calcule ilustrative, nu specificații atribuite unui produs."
                  : "Independent editorial explanation. Numerical examples are illustrative calculations, not specifications attributed to a product."}
              </p>
            </section>
          </article>
          <aside className="article-aside">
            <div className="content-panel">
              <h2>{ro ? "În acest ghid" : "In this guide"}</h2>
              {g.sections.map((s, i) => (
                <a key={s.title.en} href={`#section-${i + 1}`}>
                  {local(s.title, locale)}
                </a>
              ))}
              <Link className="button-primary" href={g.calculator}>
                {ro ? "Deschide calculatorul" : "Open calculator"}
              </Link>
              <Link href={`/marketplace/${g.category}`}>
                {local(category.title, locale)} →
              </Link>
              <Link href={`/solutions/${g.solution}`}>
                {ro ? "Soluție asociată" : "Related solution"} →
              </Link>
            </div>
          </aside>
        </div>
        <h2>{ro ? "Echipamente de explorat" : "Equipment to explore"}</h2>
        {equipmentGroups ? <div id="equipment-paths">{equipmentGroups.map(group => <section key={group.title.en} className="content-panel">
          <h3>{local(group.title, locale)}</h3>
          <p>{local(group.description, locale)}</p>
          <div className="product-grid">{group.products.map(product => <ProductCard key={product.id} product={product} dictionary={t} />)}</div>
          {group.products.length >= 2 && <Link className="button-outline" href={`/compare?ids=${encodeURIComponent(group.products.map(product => product.id).join(","))}`}>{ro ? "Compară aceste modele" : "Compare these models"} →</Link>}
        </section>)}</div> : <>
        <div className="product-grid">
          {catalog
            .filter((p) => p.paths.includes(g.category))
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.id} product={p} dictionary={t} />
            ))}
        </div>
        </>}
        <h2>{ro ? "Continuă lectura" : "Continue reading"}</h2>
        <LinkGrid
          locale={locale}
          items={guides
            .filter(
              (n) =>
                n.slug !== g.slug &&
                (n.hub === g.hub || n.solution === g.solution),
            )
            .slice(0, 3)
            .map((n) => ({ href: `/learn/${n.slug}`, title: n.title }))}
        />
        <Faq ro={ro} />
      </main>
    </PlatformShell>
  );
}

import Link from "@/components/localized-link";
import { LinkGrid } from "./shared";
import { waterSelectionRoutes } from "@/lib/marketplace/water-guide-content";

/** Water-specific planning replaces the electrical procurement text on this guide only. */
export function WaterGuideSupport({ ro }: { ro: boolean }) {
  return <section id="water-selection-brief" data-testid="water-selection-brief">
    <h2>{ro ? "Pregătește lista de cerințe pentru apă" : "Build your water selection brief"}</h2>
    <ul>
      <li>{ro ? "Sursa: raportul rețelei sau analiza sursei private, cu data și substanțele măsurate." : "Source: the utility report or private-source analysis, with its date and measured substances."}</li>
      <li>{ro ? "Utilizarea: apa pentru băut și gătit, un singur robinet sau întreaga locuință." : "Use: drinking and cooking, one tap or the whole property."}</li>
      <li>{ro ? "Capacitatea: litri pe zi, volumul necesar într-o singură utilizare și timpul disponibil pentru reumplere." : "Capacity: litres per day, demand in a single use and available refill time."}</li>
      <li>{ro ? "Instalarea: spațiu, racorduri, presiune, electricitate, evacuare și acces pentru întreținere, după manualul exact." : "Installation: space, connections, pressure, electricity, drainage and maintenance access, checked against the exact manual."}</li>
    </ul>
    <h3>{ro ? "Exemplu de capacitate: 12 litri pe zi" : "Capacity example: 12 litres per day"}</h3>
    <p>{ro
      ? "Pentru un necesar ipotetic de 12 L/zi și un volum util ipotetic de 4 L de apă tratată per lot, sunt necesare 12 ÷ 4 = 3 loturi pe zi. Nu sunt valori atribuite unui produs sau recomandări de consum. Verifică volumul util după tratare, timpul de producție, apa evacuată și rutina de reumplere; volumul rezervorului de alimentare poate fi diferit."
      : "For an illustrative demand of 12 L/day and an illustrative usable treated-water batch of 4 L, 12 ÷ 4 = 3 batches per day are needed. These are not product specifications or consumption recommendations. Check usable volume after treatment, production time, drain water and the refill routine; the feed-water tank may have a different volume."}</p>
    <h3>{ro ? "Continuă cu formatul potrivit" : "Continue with the relevant format"}</h3>
    <LinkGrid locale={ro ? "ro" : "en"} items={waterSelectionRoutes} />
    <div className="action-row">
      <Link className="button-primary" href="/marketplace/water#finder">{ro ? "Folosește selectorul de apă" : "Use the water selection checklist"} →</Link>
      <Link href="/marketplace/water/under-sink">{ro ? "Verifică montajul sub chiuvetă" : "Check under-sink installation"} →</Link>
    </div>
    <p className="safety-note">{ro
      ? "Modelele Waterdrop de mai jos sunt exemple pentru compararea formatului și a valorilor documentate. Ofertele afiliate Waterdrop DE rămân blocate pentru România; existența unui model în catalog nu confirmă livrarea sau eligibilitatea pentru comision. Alegerea unui format nu confirmă potabilitatea apei."
      : "The Waterdrop models below are examples for comparing format and documented ratings. Waterdrop DE affiliate offers remain blocked for Romania; a catalog entry does not confirm delivery or commission eligibility. Choosing a format does not establish that the water is safe to drink."}</p>
  </section>;
}

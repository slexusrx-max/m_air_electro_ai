import Link from "@/components/localized-link";

export function HomeBuyingGuide({ ro }: { ro: boolean }) {
  const cards = [
    {
      title: ro ? "Cum alegi stația sau sistemul solar" : "How to choose a power station or solar system",
      body: ro
        ? "Începe cu utilizarea: alimentare directă pentru câteva aparate, rezervă pentru circuite esențiale sau producție solară fixă. Sunt soluții diferite, cu cerințe diferite de instalare și protecție."
        : "Start with the job: direct power for a few appliances, backup for essential circuits, or a fixed solar installation. These are different solutions with different installation and protection requirements.",
      href: "/learn/how-to-choose-portable-power-station",
      link: ro ? "Ghid de alegere" : "Selection guide",
    },
    {
      title: ro ? "Calculul puterii și autonomiei" : "Power and runtime calculation",
      body: ro
        ? "Energia se estimează în Wh: putere × ore. Puterea continuă, vârful de pornire, pierderile și rezerva se verifică separat. Calculatorul transformă aceste ipoteze într-un necesar explicabil."
        : "Energy is estimated in Wh: watts × hours. Continuous power, startup surge, losses, and reserve are checked separately. The calculator turns those assumptions into an explainable requirement.",
      href: "/marketplace/find-my-solution",
      link: ro ? "Calculează sistemul" : "Size your system",
    },
    {
      title: ro ? "Tipuri de acumulatoare" : "Battery types",
      body: ro
        ? "LiFePO4 și plumb-acid diferă prin energia utilizabilă, greutate, încărcare, temperatură și cicluri. Chimia singură nu confirmă compatibilitatea cu invertorul, încărcătorul sau instalația."
        : "LiFePO4 and lead-acid differ in usable energy, weight, charging, temperature limits, and cycle life. Chemistry alone does not confirm compatibility with the inverter, charger, or installation.",
      href: "/learn/lifepo4-vs-lead-acid",
      link: ro ? "Compară tehnologiile" : "Compare technologies",
    },
    {
      title: ro ? "Exemple de calcul reproductibile" : "Reproducible worked examples",
      body: ro
        ? "Scenariile pentru locuință, rulotă și sisteme off-grid arată ipotezele și formulele pas cu pas. Sunt exemple educaționale, nu proiecte executate și nici confirmări de compatibilitate."
        : "Home, RV, and off-grid scenarios show assumptions and formulas step by step. They are educational examples, not completed customer projects or compatibility confirmations.",
      href: "/learn/home-backup-system",
      link: ro ? "Vezi exemplul pentru locuință" : "See the home example",
    },
  ];

  return <section className="home-buying-guide" aria-labelledby="home-buying-guide-title">
    <div className="home-buying-guide-intro">
      <p className="eyebrow">{ro ? "GHID PRACTIC" : "PRACTICAL GUIDE"}</p>
      <h2 id="home-buying-guide-title">{ro ? "Alege pe baza consumului, nu a reclamelor." : "Choose from your actual loads, not marketing claims."}</h2>
      <p>{ro ? "Un punct de plecare structurat pentru stații portabile, baterii, invertoare și sisteme fotovoltaice." : "A structured starting point for portable power stations, batteries, inverters, and photovoltaic systems."}</p>
    </div>
    <div className="home-buying-guide-grid">
      {cards.map(card => <article key={card.href}>
        <h3>{card.title}</h3>
        <p>{card.body}</p>
        <Link href={card.href}>{card.link} <span aria-hidden="true">→</span></Link>
      </article>)}
    </div>
    <nav className="home-learning-links" aria-label={ro ? "Ghiduri recomandate" : "Recommended guides"}>
      <Link href="/learn/how-to-choose-portable-power-station">{ro ? "Cum alegi o stație" : "How to choose a power station"}</Link>
      <Link href="/learn/solar-system-payback">{ro ? "Recuperarea investiției" : "Solar payback"}</Link>
      <Link href="/faq">{ro ? "Întrebări frecvente" : "Frequently asked questions"}</Link>
    </nav>
  </section>;
}

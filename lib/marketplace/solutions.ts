import { bilingual as b, type LocalText } from "./content";
export type Solution = {
  slug: string;
  title: LocalText;
  summary: LocalText;
  loads: LocalText;
  architecture: LocalText;
  example: LocalText;
  solar: LocalText;
  caution: LocalText;
  categories: string[];
  guides: string[];
  watts: number;
  hours: number;
};
export const solutions: Solution[] = [
  {
    slug: "apartment-backup",
    title: b("Apartment backup", "Rezervă pentru apartament"),
    summary: b(
      "For residents keeping internet, lighting and a small workstation running without rebuilding the whole electrical installation.",
      "Pentru locatarii care vor internet, iluminat și un birou funcțional fără refacerea întregii instalații.",
    ),
    loads: b(
      "Measure router, optical-network terminal, laptop and LED lights individually. A refrigerator cycles and adds compressor starting demand. Keep electric heating, cooking and water heating outside a compact backup budget.",
      "Măsoară separat routerul, terminalul optic, laptopul și luminile LED. Frigiderul funcționează intermitent și adaugă vârf de pornire. Exclude încălzirea, gătitul și boilerul dintr-un buget compact.",
    ),
    architecture: b(
      "A portable battery with AC outputs can feed individual appliances. A fixed essential-circuit board needs installer-designed isolation and transfer. For equipment that cannot tolerate interruption, check a documented UPS transfer time and test recovery.",
      "O baterie portabilă cu ieșiri AC poate alimenta aparate individuale. Un tablou fix pentru circuite esențiale necesită separare și transfer proiectate. Pentru sarcini fără întrerupere, verifică timpul UPS documentat și testează revenirea.",
    ),
    example: b(
      "Illustrative envelope: 100–500 W of essentials for 2–6 hours. At 250 W for 4 hours, AC energy is 1 kWh; with 80% usable depth and 92% conversion, storage is about 1.36 kWh before ageing reserve. Inverter surge must still be checked separately.",
      "Exemplu orientativ: 100–500 W esențiali pentru 2–6 ore. La 250 W timp de 4 ore, energia AC este 1 kWh; cu 80% utilizare și 92% conversie, stocarea este circa 1,36 kWh înainte de rezerva pentru îmbătrânire. Verifică separat vârful invertorului.",
    ),
    solar: b(
      "Balcony solar depends on permission, secure mounting, orientation and shade. It is not assumed to recharge the system daily. A combustion generator is not an indoor or balcony backup solution.",
      "Solarul pe balcon depinde de permisiuni, fixare, orientare și umbrire. Nu presupune reîncărcare zilnică. Generatorul cu ardere nu este soluție de rezervă în interior sau pe balcon.",
    ),
    caution: b(
      "Never feed a wall socket from an inverter output. Preserve ventilation, escape routes and manufacturer clearances.",
      "Nu alimenta o priză de perete din ieșirea invertorului. Păstrează ventilația, căile de evacuare și distanțele producătorului.",
    ),
    categories: ["backup-power", "batteries", "inverters"],
    guides: ["apartment-backup-system", "battery-runtime-calculation"],
    watts: 250,
    hours: 4,
  },
  {
    slug: "home-backup",
    title: b("Home backup", "Rezervă pentru casă"),
    summary: b(
      "For homeowners separating essential circuits from whole-home demand and planning a safe return to grid supply.",
      "Pentru proprietarii care separă circuitele esențiale de consumul întregii case și planifică revenirea sigură la rețea.",
    ),
    loads: b(
      "Inventory refrigeration, communications, heating controls, circulation pumps and selected sockets. Measure simultaneous load and motor starts. An electric boiler can dominate the energy budget even when used briefly.",
      "Inventariază frigiderul, comunicațiile, comenzile încălzirii, pompele și prizele selectate. Măsoară consumul simultan și pornirile. Boilerul electric poate domina bugetul energetic.",
    ),
    architecture: b(
      "Battery → protected DC bus → inverter/charger → approved transfer arrangement → essential circuits. Earthing, neutral switching, residual-current protection and grid separation must be designed together for the chosen equipment.",
      "Baterie → magistrală DC protejată → invertor/încărcător → transfer adecvat → circuite esențiale. Împământarea, comutarea neutrului, protecția diferențială și separarea rețelei se proiectează împreună.",
    ),
    example: b(
      "Illustrative envelope: 500–2000 W of essential demand for 4–8 hours. A 1 kW average load for 4 hours requires 4 kWh AC, or roughly 5.43 kWh stored with 80% usable depth and 92% efficiency. Starting power is an independent constraint.",
      "Exemplu: 500–2000 W esențiali pentru 4–8 ore. O medie de 1 kW timp de 4 ore necesită 4 kWh AC, circa 5,43 kWh stocați la 80% utilizare și 92% randament. Puterea de pornire este o constrângere separată.",
    ),
    solar: b(
      "Existing grid-tied PV may disconnect during outages. Confirm backup-mode solar compatibility rather than assuming roof panels keep producing for the house. Generator charging is possible only within charger and transfer specifications.",
      "PV conectat la rețea se poate opri la întreruperi. Confirmă compatibilitatea solară în mod rezervă. Încărcarea din generator este posibilă numai în limitele încărcătorului și transferului.",
    ),
    caution: b(
      "A preliminary energy estimate does not establish compliance or authorize grid connection. Have a qualified installer assess the site.",
      "Estimarea energiei nu stabilește conformitatea și nu autorizează conectarea la rețea. Solicită evaluarea instalației de un profesionist.",
    ),
    categories: [
      "backup-power",
      "batteries",
      "inverters",
      "electrical-components",
    ],
    guides: ["home-backup-system", "inverter-surge-power"],
    watts: 1000,
    hours: 4,
  },
  {
    slug: "solar-battery",
    title: b("Solar + battery", "Solar + baterie"),
    summary: b(
      "For shifting daytime production into evening loads or supporting an off-grid energy budget.",
      "Pentru mutarea producției de zi spre consumul de seară sau alimentarea independentă.",
    ),
    loads: b(
      "Separate daytime direct consumption from evening storage demand. Record daily energy across seasons; winter lighting and heating controls can increase demand as solar production falls.",
      "Separă consumul direct de zi de cel de seară. Notează energia zilnică pe anotimpuri; iarna cererea poate crește când producția solară scade.",
    ),
    architecture: b(
      "PV array → controller or compatible hybrid inverter → battery → DC or AC loads. DC-coupled and AC-coupled designs have different operating limits, especially when disconnected from the grid.",
      "Panouri PV → regulator sau invertor hibrid compatibil → baterie → consumatori DC sau AC. Cuplarea DC și AC are limite diferite, mai ales fără rețea.",
    ),
    example: b(
      "For an illustrative 3 kWh/day load, 3.5 peak-sun-hours and a 75% system yield factor imply about 1.15 kW of PV. These are example inputs, not a Romania forecast. Storage for one day at 80% usable depth and 92% conversion is about 4.08 kWh.",
      "Pentru 3 kWh/zi, 3,5 ore solare echivalente și factor 75%, rezultă circa 1,15 kW PV. Sunt ipoteze de exemplu, nu prognoză pentru România. Stocarea unei zile la 80% utilizare și 92% conversie este circa 4,08 kWh.",
    ),
    solar: b(
      "Use location-specific monthly PVGIS data and include shade, tilt and cable losses. Add a recovery strategy for several low-yield days; oversizing the battery cannot create missing energy.",
      "Folosește date PVGIS lunare pentru locație și include umbrirea, înclinarea și pierderile. Prevede recuperarea după zile slabe; o baterie mai mare nu creează energia lipsă.",
    ),
    caution: b(
      "Check cold-corrected PV voltage and battery charge acceptance; array wattage alone cannot select a controller.",
      "Verifică tensiunea PV la rece și curentul de încărcare permis; puterea panourilor nu alege singură regulatorul.",
    ),
    categories: ["solar", "solar/controllers", "batteries"],
    guides: ["solar-panel-sizing", "mppt-vs-pwm"],
    watts: 500,
    hours: 6,
  },
  {
    slug: "rv-caravan",
    title: b("RV / caravan", "Rulotă / autorulotă"),
    summary: b(
      "For travel systems combining house loads, limited roof area, alternator charging and campsite power.",
      "Pentru călătorii cu baterie de servicii, plafon limitat, alternator și alimentare în camping.",
    ),
    loads: b(
      "Count refrigeration duty cycle, water pump, lights, ventilation and device charging over a full day. A kettle has high power but short use; compressor refrigeration has lower power over many hours.",
      "Calculează ciclul frigiderului, pompa, luminile, ventilația și încărcarea dispozitivelor pe zi. Fierbătorul are putere mare pe timp scurt; frigiderul consumă mai puțin, multe ore.",
    ),
    architecture: b(
      "Alternator → DC-DC charger and PV → MPPT → house battery → fused DC distribution / inverter. Keep engine starting reserve separate. Shore AC charging needs a compatible charging profile.",
      "Alternator → încărcător DC-DC și PV → MPPT → baterie servicii → distribuție DC protejată / invertor. Păstrează rezerva de pornire separată. Încărcarea de la camping necesită profil compatibil.",
    ),
    example: b(
      "A 1.5 kWh daily budget and 80% usable storage suggest at least 1.88 kWh for direct DC loads before additional losses. For AC delivery at 92% efficiency this becomes about 2.04 kWh. Choose an inverter around measured simultaneous AC demand.",
      "Un buget de 1,5 kWh/zi și utilizare 80% sugerează minimum 1,88 kWh pentru consum direct DC, înaintea pierderilor. Pentru AC la 92%, circa 2,04 kWh. Alege invertorul după consumul AC simultan.",
    ),
    solar: b(
      "Roof shade from vents and parked trees can reduce output. Portable panels add setup work but can be aimed independently. Alternator input must leave thermal capacity for the vehicle itself.",
      "Umbra de la trape și copaci reduce producția. Panourile portabile cer montaj zilnic, dar se pot orienta separat. Alternatorul trebuie să păstreze rezervă termică pentru vehicul.",
    ),
    caution: b(
      "Secure battery mass and cables for vibration and collision loads. Respect charging-temperature limits during winter travel.",
      "Fixează masa bateriei și cablurile pentru vibrații și solicitări. Respectă temperaturile de încărcare iarna.",
    ),
    categories: ["solar/kits", "batteries", "chargers/dc-dc"],
    guides: ["rv-solar-basics", "dc-dc-charger-guide"],
    watts: 250,
    hours: 6,
  },
  {
    slug: "marine",
    title: b("Marine house power", "Energie la bord"),
    summary: b(
      "For anchorage autonomy, navigation support and charging a vessel's house bank.",
      "Pentru autonomie la ancoră, navigație și încărcarea bateriilor de servicii.",
    ),
    loads: b(
      "Audit refrigeration, navigation, communications, lighting, pumps and instruments in separate anchorage and passage budgets. Safety-critical loads require a documented backup strategy beyond a shopping recommendation.",
      "Evaluează frigiderul, navigația, comunicațiile, luminile, pompele și instrumentele separat la ancoră și în mers. Consumatorii critici cer strategie documentată de rezervă.",
    ),
    architecture: b(
      "Separate starting and house banks; combine alternator, suitable solar control and shore charger through approved charging paths. Put monitoring where it measures the intended bank current rather than only one branch.",
      "Separă bateriile de pornire și servicii; combină alternatorul, solarul și încărcătorul de cheu prin circuite adecvate. Montează monitorizarea să măsoare curentul bancului, nu doar o ramură.",
    ),
    example: b(
      "At 2 kWh/day, an 80% usable storage assumption requires 2.5 kWh before conversion and reserve. Add navigation hours, weather delays and the appropriate critical-load redundancy. Inverter capacity follows simultaneous AC appliances.",
      "La 2 kWh/zi, utilizarea de 80% cere 2,5 kWh înainte de conversie și rezervă. Adaugă navigația, întârzierile meteo și redundanța necesară. Invertorul urmează consumatorii AC simultani.",
    ),
    solar: b(
      "Rigging shadows and limited deck area make realistic solar measurements valuable. Shore charging and generator charging must respect battery acceptance and the vessel's isolation scheme.",
      "Umbra greementului și puntea limitată fac utile măsurătorile solare reale. Încărcarea de la cheu sau generator trebuie să respecte bateria și schema de izolare a navei.",
    ),
    caution: b(
      "Bonding, galvanic corrosion, wet locations and shore AC require marine-qualified design. Do not replace a starting battery with a house battery without explicit suitability.",
      "Legăturile de protecție, coroziunea galvanică, umiditatea și AC de la cheu cer proiectare navală calificată. Nu înlocui bateria de pornire fără compatibilitate explicită.",
    ),
    categories: ["marine", "batteries", "chargers"],
    guides: ["marine-battery-system", "12v-vs-24v-vs-48v"],
    watts: 250,
    hours: 8,
  },
  {
    slug: "off-grid-cabin",
    title: b("Off-grid cabin", "Cabană independentă"),
    summary: b(
      "For a cabin where every consumed kWh must be generated, stored or brought in as fuel.",
      "Pentru cabana unde fiecare kWh consumat trebuie produs, stocat sau adus ca combustibil.",
    ),
    loads: b(
      "Build separate summer and winter budgets. Water pumping, refrigeration and communications often dominate essential electricity; resistive space heating can overwhelm a modest solar system.",
      "Construiește bugete de vară și iarnă. Pomparea apei, frigiderul și comunicațiile domină adesea consumul; încălzirea rezistivă poate depăși un sistem solar modest.",
    ),
    architecture: b(
      "Solar → charge controller → protected battery bank → inverter and selected DC loads. A generator/charger can replenish storage during extended poor weather, with safe transfer and source interlocking.",
      "Solar → regulator → banc protejat → invertor și consumatori DC selectați. Generatorul/încărcătorul poate reface stocarea pe vreme nefavorabilă, cu transfer și interblocare sigure.",
    ),
    example: b(
      "A 3 kWh/day AC budget with two days of autonomy needs about 8.15 kWh nominal storage at 80% usable depth and 92% conversion. This does not size the solar array: it must supply loads and recover the energy deficit.",
      "Un buget AC de 3 kWh/zi cu două zile autonomie cere circa 8,15 kWh nominali la 80% utilizare și 92% conversie. Panourile trebuie dimensionate separat pentru consum și recuperarea deficitului.",
    ),
    solar: b(
      "Use the weakest occupied month for design. Size recovery energy over an explicit number of good days. Generator operation must be outdoors away from occupied spaces and openings.",
      "Dimensionează după cea mai slabă lună de utilizare. Definește zilele bune necesare recuperării. Generatorul funcționează afară, departe de spații ocupate și deschideri.",
    ),
    caution: b(
      "Remote sites need maintenance access, low-temperature charging protection and a plan for failure of a single key component.",
      "Locațiile izolate cer acces de mentenanță, protecție la încărcare rece și plan pentru defectarea unei componente esențiale.",
    ),
    categories: ["solar", "batteries", "generators"],
    guides: ["solar-panel-sizing", "generator-vs-battery-backup"],
    watts: 500,
    hours: 6,
  },
  {
    slug: "workshop",
    title: b("Workshop", "Atelier"),
    summary: b(
      "For tools, motors and controls whose starting behaviour matters as much as energy consumption.",
      "Pentru scule, motoare și comenzi unde pornirea contează la fel de mult ca energia.",
    ),
    loads: b(
      "Separate lighting and electronics from compressors, extraction, welders and machine tools. Record single- versus three-phase supply and startup sequences rather than assuming every motor starts together.",
      "Separă luminile și electronica de compresoare, exhaustare, sudură și utilaje. Notează alimentarea mono/trifazată și secvența pornirilor.",
    ),
    architecture: b(
      "Use an essential-control backup where full machine backup is impractical. Any motor supply, VFD or generator interface needs compatible phase configuration and protection; emergency-stop behaviour must remain safe after power returns.",
      "Folosește rezervă pentru comenzi când alimentarea utilajelor nu este practică. Motoarele, VFD și generatorul cer faze și protecții compatibile; oprirea de urgență trebuie să rămână sigură la revenire.",
    ),
    example: b(
      "A 300 W control-and-lighting load for 2 hours is 0.6 kWh AC, about 0.82 kWh nominal at the example loss factors. A 3 kW motor is a separate power and starting-current problem, not simply another 3 kWh battery requirement.",
      "Comenzi și lumini de 300 W timp de 2 ore înseamnă 0,6 kWh AC, circa 0,82 kWh nominal la factorii exemplului. Un motor de 3 kW este separat o problemă de putere și pornire.",
    ),
    solar: b(
      "Solar can offset daytime energy but does not remove the inverter or grid starting-power constraint. A generator must be checked for the load step and power quality required by controls.",
      "Solarul poate reduce energia de zi, dar nu elimină limita de pornire. Generatorul trebuie verificat pentru treapta de sarcină și calitatea energiei cerută de comenzi.",
    ),
    caution: b(
      "Machine safety, earthing, EMC and protective coordination need a qualified industrial assessment.",
      "Siguranța utilajelor, împământarea, EMC și coordonarea protecțiilor necesită evaluare industrială calificată.",
    ),
    categories: ["industrial", "electrical-components", "inverters"],
    guides: ["industrial-motor-planning", "inverter-surge-power"],
    watts: 300,
    hours: 2,
  },
  {
    slug: "business-backup",
    title: b("Business continuity", "Continuitate pentru afaceri"),
    summary: b(
      "For small businesses prioritising transaction systems, networking, refrigeration or orderly shutdown.",
      "Pentru afaceri mici care prioritizează vânzările, rețeaua, refrigerarea sau oprirea controlată.",
    ),
    loads: b(
      "Rank services by acceptable downtime. POS and networking may need seconds-level continuity while selected equipment can restart later. Validate actual daily schedules and refrigeration duty with measurements.",
      "Ordonează serviciile după întreruperea acceptată. POS și rețeaua pot necesita continuitate de ordinul secundelor; alte aparate pot reporni ulterior. Verifică programul și ciclurile prin măsurători.",
    ),
    architecture: b(
      "Separate UPS-backed electronics from longer-duration battery or generator circuits. Document transfer, automatic restart, alarms and periodic test responsibilities. Avoid a single untested system feeding every business function.",
      "Separă electronica pe UPS de circuitele cu baterie sau generator de durată. Documentează transferul, repornirea, alarmele și responsabilitatea testelor. Evită o singură sursă netestată pentru toate funcțiile.",
    ),
    example: b(
      "An illustrative 800 W essential load for 3 hours requires 2.4 kWh AC, about 3.26 kWh stored at 80% usable depth and 92% efficiency, plus any justified reserve. Refrigeration startup and UPS transfer must be assessed separately.",
      "800 W esențiali timp de 3 ore cer 2,4 kWh AC, circa 3,26 kWh stocați la 80% utilizare și 92% randament, plus rezerva justificată. Pornirea refrigerării și transferul UPS se verifică separat.",
    ),
    solar: b(
      "Daytime solar may lower recharge energy from the grid but cannot guarantee outage coverage. Longer outages may justify generator integration only after fuel, access, noise and safe siting are considered.",
      "Solarul poate reduce energia din rețea, dar nu garantează acoperirea întreruperilor. Generatorul pentru întreruperi lungi cere evaluarea combustibilului, accesului, zgomotului și amplasării.",
    ),
    caution: b(
      "The platform does not provide an uptime SLA, business-loss insurance or certified project design. Confirm the procurement brief with your installer.",
      "Platforma nu oferă SLA de disponibilitate, asigurare de pierderi sau proiect certificat. Confirmă cerințele cu instalatorul.",
    ),
    categories: ["backup-power", "inverters", "generators"],
    guides: ["home-backup-system", "how-many-kwh-do-i-need"],
    watts: 800,
    hours: 3,
  },
];

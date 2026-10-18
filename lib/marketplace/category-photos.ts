// Category examples only. Never use this mapping to identify a named product.
export type CategoryPhoto = {
  src: string; width: number; height: number;
  subject: { en: string; ro: string };
  credit: string; source: string;
  license?: { name: string; url: string };
};
const partner = (src: string, size: number, en: string, ro: string, brand: string, source: string): CategoryPhoto => ({
  src, width: size, height: size, subject: { en, ro }, credit: brand, source,
});
export const categoryPhotos: Record<string, CategoryPhoto> = {
  solar: partner("/product-photos/renogy-panel-200.jpg", 1280, "Renogy 200 W solar panel", "Panou solar Renogy de 200 W", "Renogy", "https://eu.renogy.com/products/renogy-16bb-n-type-200-watt-24v-solar-panel?variant=46435567796481"),
  batteries: partner("/product-photos/renogy-mini-100.jpg", 1280, "Renogy Core Mini 100 Ah battery", "Baterie Renogy Core Mini de 100 Ah", "Renogy", "https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery?variant=46545423761665"),
  inverters: partner("/product-photos/renogy-inverter-1000.jpg", 1600, "Renogy 1000 W inverter", "Invertor Renogy de 1000 W", "Renogy", "https://eu.renogy.com/products/1000w-12v-pure-sine-wave-inverter-with-ups-function"),
  chargers: partner("/product-photos/renogy-dcc50.jpg", 600, "Renogy 50 A DC-DC charger", "Încărcător Renogy DC-DC de 50 A", "Renogy", "https://eu.renogy.com/products/dcc50s-12v-50a-dc-dc-on-board-battery-charger-with-mppt-new-version?variant=46740803715329"),
  "backup-power": partner("/category-photos/renogy-portable-power.jpg", 600, "Renogy portable power station", "Stație portabilă Renogy", "Renogy", "https://eu.renogy.com/products/renogy-portable-power-station-camping-998wh-backup-lithium-battery-of-1hour-80-fast-recharging"),
  marine: partner("/category-photos/renogy-marine-kit.jpg", 386, "Renogy flexible solar marine kit", "Kit solar flexibil Renogy pentru aplicații navale", "Renogy", "https://eu.renogy.com/products/400w-12v-flexible-solar-marine-kit-w-rover-li-40-amp-mppt-solar-charge-controller"),
  water: partner("/product-photos/waterdrop-g3p800.png", 1024, "Waterdrop G3P800 water filtration system", "Sistem de filtrare a apei Waterdrop G3P800", "Waterdrop", "https://www.waterdropfilter.de/products/umkehrosmoseanlage-g3p800"),
  generators: { src: "/category-photos/generators.jpg", width: 384, height: 216,
    subject: { en: "Honda EU20i portable generator", ro: "Generator portabil Honda EU20i" }, credit: "Petra19783",
    source: "https://commons.wikimedia.org/wiki/File:Notstromaggregat.jpg",
    license: { name: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" } },
  "ev-charging": { src: "/category-photos/ev-charging.jpg", width: 384, height: 512,
    subject: { en: "ChargePoint home charging point", ro: "Punct de încărcare auto ChargePoint" }, credit: "Ken Fields — www.kenfields.net",
    source: "https://commons.wikimedia.org/wiki/File:ChargePoint_Home_Charger.jpg",
    license: { name: "CC BY-SA 2.0", url: "https://creativecommons.org/licenses/by-sa/2.0/" } },
  "electrical-components": { src: "/category-photos/electrical.jpg", width: 384, height: 312,
    subject: { en: "Schneider DIN-rail tariff switch", ro: "Întreruptor tarifar Schneider pe șină DIN" }, credit: "SweetWood",
    source: "https://commons.wikimedia.org/wiki/File:Tarifschalter_1x(Schneider_C60H-TA25_3P_MGNTA253EP)_000.jpg",
    license: { name: "CC0 1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" } },
  industrial: { src: "/category-photos/industrial.jpg", width: 384, height: 258,
    subject: { en: "Industrial electrical control cabinets", ro: "Dulapuri electrice industriale" }, credit: "Poly-protech",
    source: "https://commons.wikimedia.org/wiki/File:Control_cabinets_2.jpg",
    license: { name: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" } },
};
export function categoryPhoto(category: string): CategoryPhoto | undefined {
  const aliases: Record<string, string> = {
    "lithium-batteries": "batteries", "solar-panels": "solar",
    "industrial-electrical": "industrial", "marine-electrical": "marine",
    "electrical-accessories": "electrical-components",
  };
  return categoryPhotos[aliases[category] ?? category] ?? categoryPhotos[category.split("/")[0]];
}

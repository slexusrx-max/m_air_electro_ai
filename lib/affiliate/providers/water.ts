/** Editorial supplier registry. These are ordinary links, with no tracking or approval implied. */
export const waterSuppliers = [
  { id: "waterdrop-eu", name: "Waterdrop Europe", url: "https://www.waterdropfilter.eu/", phase: "initial", affiliateApproved: false },
  { id: "lifestraw-eu", name: "LifeStraw Europe", url: "https://eu.lifestraw.com/en-en", phase: "initial", affiliateApproved: false },
  { id: "aquatru-eu", name: "AquaTru Europe", url: "https://aquatruwater.eu/", phase: "initial", affiliateApproved: false },
  { id: "zerowater-eu", name: "ZeroWater Europe", url: null, phase: "future", affiliateApproved: false },
  { id: "pure-filters", name: "Pure Filters", url: null, phase: "future", affiliateApproved: false },
  { id: "katadyn", name: "Katadyn", url: null, phase: "future", affiliateApproved: false },
] as const;
export type WaterSupplierId = typeof waterSuppliers[number]["id"];

// World tracker helpers. Earlier versions stored 2-letter codes for 24 countries;
// the full world map uses ISO 3166-1 alpha-3 codes. Old saved selections are
// migrated on load so no one loses their visited countries.

export const LEGACY_ISO2_TO_ISO3: Record<string, string> = {
  BD: 'BGD', IN: 'IND', NP: 'NPL', BT: 'BTN', TH: 'THA', MY: 'MYS', SG: 'SGP', ID: 'IDN',
  SA: 'SAU', AE: 'ARE', TR: 'TUR', MV: 'MDV', LK: 'LKA', QA: 'QAT', GB: 'GBR', US: 'USA',
  CA: 'CAN', AU: 'AUS', JP: 'JPN', DE: 'DEU', FR: 'FRA', IT: 'ITA', CH: 'CHE', EG: 'EGY',
};

export function migrateCountryIds(ids: Iterable<string>): Set<string> {
  const out = new Set<string>();
  for (const id of ids) out.add(LEGACY_ISO2_TO_ISO3[id] ?? id);
  return out;
}

export const CONTINENTS: { id: string; bn: string }[] = [
  { id: 'as', bn: 'এশিয়া' },
  { id: 'eu', bn: 'ইউরোপ' },
  { id: 'af', bn: 'আফ্রিকা' },
  { id: 'na', bn: 'উত্তর ও মধ্য আমেরিকা' },
  { id: 'sa', bn: 'দক্ষিণ আমেরিকা' },
  { id: 'oc', bn: 'ওশেনিয়া' },
];

export interface WorldCountry {
  i: string;
  b: string;
  n: string;
  ct: string;
  c: [number, number];
  d: string;
  sm?: number;
}

export interface WorldData {
  w: number;
  h: number;
  bg: string;
  f: WorldCountry[];
}

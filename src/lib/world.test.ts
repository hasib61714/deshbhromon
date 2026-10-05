import { describe, expect, it } from 'vitest';
import fs from 'fs';
import { LEGACY_ISO2_TO_ISO3, migrateCountryIds, CONTINENTS } from './world';

const world = JSON.parse(fs.readFileSync('public/world.json', 'utf8'));

describe('world helpers', () => {
  it('maps every legacy code to a country that exists in the map', () => {
    const ids = new Set(world.f.map((c: any) => c.i));
    for (const iso3 of Object.values(LEGACY_ISO2_TO_ISO3)) expect(ids.has(iso3), iso3).toBe(true);
  });
  it('migrates old codes, keeps new ones and removes duplicates', () => {
    expect([...migrateCountryIds(['BD', 'IN', 'FRA', 'BGD'])].sort()).toEqual(['BGD', 'FRA', 'IND']);
  });
  it('covers every continent in the data', () => {
    const ct = new Set(world.f.map((c: any) => c.ct));
    for (const c of ct) expect(CONTINENTS.some((x) => x.id === c)).toBe(true);
  });
});

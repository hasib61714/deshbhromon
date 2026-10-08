import { describe, expect, it } from 'vitest';
import { districtFromPath, districtPath, districtSlug } from './districtRoutes';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';

const ids = Object.keys(DISTRICT_DETAILS);

describe('district routes', () => {
  it('gives every one of the 64 districts a unique address', () => {
    expect(new Set(ids.map(districtSlug)).size).toBe(ids.length);
    expect(districtPath("Cox's Bazar")).toBe('/district/coxs-bazar/');
  });
  it('maps an address back to the district and rejects anything else', () => {
    for (const id of ids) expect(districtFromPath(districtPath(id), ids)).toBe(id);
    expect(districtFromPath('/district/sylhet', ids)).toBe('Sylhet');
    expect(districtFromPath('/district/nowhere/', ids)).toBeNull();
    expect(districtFromPath('/', ids)).toBeNull();
    expect(districtFromPath('/district/../x/', ids)).toBeNull();
  });
});

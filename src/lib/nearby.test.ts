import { describe, expect, it } from 'vitest';
import { nearestDistricts } from './nearby';
import { DATA } from './../data/map-data';

describe('nearby districts', () => {
  it('returns the 5 closest districts, never itself, and nothing for an unknown id', () => {
    const n = nearestDistricts('Dhaka', DATA.f);
    expect(n).toHaveLength(5);
    expect(n).not.toContain('Dhaka');
    expect(n).toContain('Gazipur');
    expect(nearestDistricts('Nowhere', DATA.f)).toEqual([]);
  });
});

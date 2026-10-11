import { describe, expect, it } from 'vitest';
import { passportNumber, passportPages, stampStyle, stampsOnPage, STAMPS_PER_PAGE, STAMP_COLORS } from './passport';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';

describe('travel passport', () => {
  it('gives each district the same stamp every time, with a mix of shapes and colours across districts', () => {
    const ids = Object.keys(DISTRICT_DETAILS);
    for (const id of ids) expect(stampStyle(id)).toEqual(stampStyle(id));
    expect(new Set(ids.map((i) => stampStyle(i).shape)).size).toBe(4);
    expect(new Set(ids.map((i) => stampStyle(i).color)).size).toBeGreaterThanOrEqual(6);
    for (const id of ids) {
      const s = stampStyle(id);
      expect(STAMP_COLORS).toContain(s.color);
      expect(Math.abs(s.rotation)).toBeLessThan(0.2);
    }
  });
  it('splits stamps into pages of 12', () => {
    expect(passportPages(0)).toBe(1);
    expect(passportPages(12)).toBe(1);
    expect(passportPages(13)).toBe(2);
    expect(passportPages(64)).toBe(6);
    const ids = Array.from({ length: 30 }, (_, i) => `d${i}`);
    expect(stampsOnPage(ids, 1)).toHaveLength(STAMPS_PER_PAGE);
    expect(stampsOnPage(ids, 3)).toEqual(['d24', 'd25', 'd26', 'd27', 'd28', 'd29']);
  });
  it('makes a stable DB + 6 digit number from the name', () => {
    expect(passportNumber('রহিম')).toMatch(/^DB\d{6}$/);
    expect(passportNumber(' রহিম ')).toBe(passportNumber('রহিম'));
    expect(passportNumber('করিম')).not.toBe(passportNumber('রহিম'));
    expect(passportNumber('')).toMatch(/^DB\d{6}$/);
  });
});

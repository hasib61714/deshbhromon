import { describe, expect, it } from 'vitest';
import { decodeVisited, encodeVisited, challengeUrl, readChallenge, cleanName } from './challenge';
import { parseBest, suggestDistricts } from './suggest';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';
import fs from 'fs';

const ids = Object.keys(DISTRICT_DETAILS).sort();
const places = JSON.parse(fs.readFileSync('public/places.json', 'utf8'));

describe('challenge links', () => {
  it('round-trips a visited set through the link code', () => {
    const v = new Set(['Dhaka', 'Sylhet', "Cox's Bazar", 'Thakurgaon']);
    const back = decodeVisited(encodeVisited(v, ids), ids)!;
    expect([...back].sort()).toEqual([...v].sort());
    expect(decodeVisited(encodeVisited(new Set(), ids), ids)!.size).toBe(0);
  });
  it('rejects broken or hostile codes and cleans names', () => {
    expect(decodeVisited('abc', ids)).toBeNull();
    expect(decodeVisited('<script>', ids)).toBeNull();
    expect(readChallenge('?c=%%%', ids)).toBeNull();
    expect(cleanName('  <b>রহিম</b>\n' + 'x'.repeat(50)).length).toBeLessThanOrEqual(30);
    expect(cleanName('<b>রহিম')).toBe('bরহিম');
  });
  it('builds a link that reads back to the same name and districts', () => {
    const url = challengeUrl('https://x.test', new Set(['Dhaka']), 'রহিম', ids);
    const got = readChallenge(new URL(url).search, ids)!;
    expect(got.name).toBe('রহিম');
    expect([...got.visited]).toEqual(['Dhaka']);
  });
});

describe('where-to-go suggester', () => {
  it('reads season ranges, including ones that wrap around the year', () => {
    expect([...(parseBest('নভেম্বর–মার্চ') as Set<number>)].sort((a, b) => a - b)).toEqual([0, 1, 2, 10, 11]);
    expect(parseBest('সারা বছর; বিকেল')).toBe('all');
    expect((parseBest('জুন–অক্টোবর (বর্ষায় পানি বেশি)') as Set<number>).has(7)).toBe(true);
    expect(parseBest('অজানা')).toBeNull();
    expect(parseBest(undefined)).toBeNull();
  });
  it('only suggests districts within the day limit, and only places that fit the month', () => {
    const s = suggestDistricts({ month: 0, days: 1, places });
    expect(s.length).toBeGreaterThan(0);
    for (const x of s) {
      expect(x.km).toBeLessThanOrEqual(150);
      expect(x.spots.length).toBeGreaterThan(0);
    }
    const winter = suggestDistricts({ month: 0, days: 5, places, limit: 64 });
    const summer = suggestDistricts({ month: 6, days: 5, places, limit: 64 });
    expect(winter.map((x) => x.id)).not.toEqual(summer.map((x) => x.id));
  });
  it('can hide districts already visited', () => {
    const all = suggestDistricts({ month: 0, days: 5, places, limit: 64 });
    const hidden = suggestDistricts({ month: 0, days: 5, places, limit: 64, visited: new Set([all[0].id]), hideVisited: true });
    expect(hidden.some((x) => x.id === all[0].id)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { buildCaption, buildCardData, cardAltText, isCustomPlan, routeLabel } from './travelCard';
import { defaultPlanner } from './tripPlan';
import type { TravelLog } from '../types';

const log = (over: Partial<TravelLog>): TravelLog => ({
  id: '1', districtId: 'Sylhet', date: '2025-01', companions: 'solo', rating: 4, notes: 'চা বাগানের সবুজ', ...over,
});
const base = {
  name: '  রহিম  ',
  visited: new Set(['Dhaka', 'Sylhet', 'Nowhere']),
  wishlist: new Set(['Bandarban', 'Atlantis']),
  countries: new Set(['IND']),
  logs: [] as TravelLog[],
  planner: null,
  options: { showPlan: true, showQuote: true },
};

describe('travel card data', () => {
  it('counts only real districts and the divisions they belong to', () => {
    const d = buildCardData(base);
    expect(d.visitedCount).toBe(2);
    expect(d.visited).toEqual(['Dhaka', 'Sylhet']);
    expect(d.divisionsCovered.sort()).toEqual(['Dhaka', 'Sylhet']);
    expect(d.percent).toBe(3);
    expect(d.wishlistCount).toBe(1);
    expect(d.countryCount).toBe(1);
    expect(d.name).toBe('রহিম');
  });

  it('is safe with nothing marked', () => {
    const d = buildCardData({ ...base, name: '', visited: new Set(), wishlist: new Set(), countries: new Set() });
    expect(d.visitedCount).toBe(0);
    expect(d.hasName).toBe(false);
    expect(d.diary).toBeNull();
    expect(d.plan).toBeNull();
    expect(buildCaption(d, 'x.example')).toContain('০টি ঘোরা');
  });

  it('picks the best-rated, most recent memory; the quote only appears when asked for', () => {
    const logs = [log({ id: 'a', rating: 5, date: '2024-02', districtId: 'Bandarban', notes: 'প্রথম' }), log({ id: 'b', rating: 5, date: '2025-03', districtId: 'Khulna', notes: 'গোপন  কথা\nনতুন' }), log({ id: 'c', rating: 2, notes: 'ভালো না' })];
    const off = buildCardData({ ...base, logs, options: { showPlan: false, showQuote: false } });
    expect(off.diary?.count).toBe(3);
    expect(off.diary?.best?.districtId).toBe('Khulna');
    expect(off.quote).toBeNull();
    expect(buildCaption(off, 's')).not.toContain('গোপন');
    const on = buildCardData({ ...base, logs, options: { showPlan: false, showQuote: true } });
    expect(on.quote).toBe('গোপন কথা নতুন');
  });

  it('ignores blank diary entries and clamps odd ratings', () => {
    const d = buildCardData({ ...base, logs: [log({ notes: '   ' }), log({ id: '2', rating: 99 })] });
    expect(d.diary?.count).toBe(1);
    expect(d.diary?.best?.rating).toBe(5);
    expect(d.diary?.avgRating).toBe(5);
  });

  it('does not present the planner\'s starting sample as the traveller\'s next trip', () => {
    expect(isCustomPlan(null)).toBe(false);
    expect(isCustomPlan(defaultPlanner())).toBe(false);
    const mine = { ...defaultPlanner(), stops: ['Sylhet'], days: 3 };
    expect(isCustomPlan(mine)).toBe(true);
    expect(buildCardData({ ...base, planner: defaultPlanner() }).plan).toBeNull();
    const d = buildCardData({ ...base, planner: mine });
    expect(d.plan).toEqual({ route: ['Dhaka', 'Sylhet'], days: 3, travelers: 2 });
    expect(routeLabel(d.plan!.route)).toBe('ঢাকা → সিলেট');
    expect(buildCardData({ ...base, planner: mine, options: { showPlan: false, showQuote: false } }).plan).toBeNull();
    expect(buildCaption(d, 'x')).toContain('পরবর্তী যাত্রা: ঢাকা → সিলেট');
  });

  it('builds a Bangla caption with the site and hashtags, and an alt text', () => {
    const d = buildCardData(base);
    const c = buildCaption(d, 'deshbhromon.vercel.app');
    expect(c).toContain('রহিম-এর বাংলাদেশ ভ্রমণ কার্ড');
    expect(c).toContain('deshbhromon.vercel.app');
    expect(c).toContain('#DeshBhromon');
    expect(cardAltText(d)).toContain('২টি');
  });
});

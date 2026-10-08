// "Where should I go?": suggests districts from the app's own verified place data (public/places.json).
// A spot's "best time" text (e.g. "অক্টোবর–মার্চ; বিকেল") decides whether it fits the chosen month; distance from Dhaka
// limits how far a 1- or 2-day trip can reasonably go. The limits are rough rules of thumb, shown as such in the UI.

export const MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

export interface SuggestSpot {
  n: string;
  best?: string;
  top?: number;
}
export interface SuggestPlace {
  km?: number;
  time?: string;
  cost?: string;
  spots?: SuggestSpot[];
}

// Months (0-11) in which the spot's first stated season applies; 'all' for year-round; null when it cannot be read
export function parseBest(best: string | undefined): Set<number> | 'all' | null {
  if (!best) return null;
  const first = best.split(/[;(]/)[0].trim();
  if (first.startsWith('সারা বছর')) return 'all';
  const parts = first.split(/[–-]/).map((p) => MONTHS_BN.indexOf(p.trim()));
  if (parts.length === 2 && parts[0] >= 0 && parts[1] >= 0) {
    const out = new Set<number>();
    for (let m = parts[0]; ; m = (m + 1) % 12) {
      out.add(m);
      if (m === parts[1]) break;
    }
    return out;
  }
  return null;
}

export const MAX_KM_BY_DAYS: Record<number, number> = { 1: 150, 2: 300 };

export interface Suggestion {
  id: string;
  km: number;
  time?: string;
  cost?: string;
  spots: { n: string; best: string; seasonal: boolean }[];
  score: number;
}

export function suggestDistricts(opts: {
  month: number;
  days: number;
  places: Record<string, SuggestPlace>;
  visited?: Set<string>;
  hideVisited?: boolean;
  limit?: number;
}): Suggestion[] {
  const { month, days, places, visited, hideVisited, limit = 6 } = opts;
  const maxKm = MAX_KM_BY_DAYS[days] ?? Infinity;
  const out: Suggestion[] = [];
  for (const [id, p] of Object.entries(places)) {
    if (hideVisited && visited?.has(id)) continue;
    const km = p.km ?? 0;
    if (km > maxKm) continue;
    const spots: Suggestion['spots'] = [];
    let score = 0;
    for (const s of p.spots ?? []) {
      const b = parseBest(s.best);
      if (b === null) continue;
      const seasonal = b !== 'all';
      if (b === 'all' || b.has(month)) {
        // Spots that are actually at their best this month count double compared with year-round ones
        score += (seasonal ? 2 : 1) * (s.top ? 2 : 1);
        spots.push({ n: s.n, best: s.best ?? '', seasonal });
      }
    }
    if (spots.length === 0) continue;
    spots.sort((a, b) => Number(b.seasonal) - Number(a.seasonal));
    out.push({ id, km, time: p.time, cost: p.cost, spots: spots.slice(0, 3), score });
  }
  return out.sort((a, b) => b.score - a.score || a.km - b.km).slice(0, limit);
}

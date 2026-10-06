// Pure data layer for the personal Travel Card: everything on the card comes from data the traveller
// already created in the app (visited districts, wishlist, world map, diary, trip planner).
import { DISTRICT_DETAILS, DIVISIONS, getTravelerBadge, toBengaliNumber } from '../data/bangladesh-data';
import type { TravelLog } from '../types';
import { defaultPlanner, type PlannerState } from './tripPlan';

export interface CardOptions {
  showPlan: boolean;
  showQuote: boolean;
}

export interface CardData {
  name: string;
  hasName: boolean;
  visited: string[];
  visitedCount: number;
  percent: number;
  divisionsCovered: string[]; // division ids with at least one visited district
  wishlistCount: number;
  countryCount: number;
  badge: { title: string; en: string };
  diary: { count: number; avgRating: number; best: { districtId: string; rating: number; date: string } | null } | null;
  plan: { route: string[]; days: number; travelers: number } | null;
  quote: string | null;
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** A plan only counts as "the traveller's next trip" once it differs from the sample the planner starts with. */
export function isCustomPlan(p: PlannerState | null): p is PlannerState {
  if (!p) return false;
  const d = defaultPlanner();
  return (
    p.startDistrict !== d.startDistrict ||
    p.days !== d.days ||
    p.travelers !== d.travelers ||
    p.stops.length !== d.stops.length ||
    p.stops.some((s, i) => s !== d.stops[i])
  ) && p.stops.length > 0;
}

export function buildCardData(input: {
  name: string;
  visited: Set<string>;
  wishlist: Set<string>;
  countries: Set<string>;
  logs: TravelLog[];
  planner: PlannerState | null;
  options: CardOptions;
}): CardData {
  const { logs, planner, options } = input;
  const visited = [...input.visited].filter((d) => d in DISTRICT_DETAILS).sort();
  const name = input.name.trim().slice(0, 60);
  const badge = getTravelerBadge(visited.length);

  const divisionsCovered = DIVISIONS.map((d) => d.id as string).filter((id) => visited.some((v) => DISTRICT_DETAILS[v].dv === id));

  let diary: CardData['diary'] = null;
  let quote: string | null = null;
  const valid = logs.filter((l) => l.notes.trim() && Number.isFinite(l.rating));
  if (valid.length) {
    const best = [...valid].sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))[0];
    diary = {
      count: valid.length,
      avgRating: Math.round((valid.reduce((s, l) => s + Math.min(5, Math.max(1, l.rating)), 0) / valid.length) * 10) / 10,
      best: { districtId: best.districtId, rating: Math.min(5, Math.max(1, Math.round(best.rating))), date: best.date },
    };
    if (options.showQuote) quote = clip(best.notes.trim().replace(/\s+/g, ' '), 110);
  }

  const plan =
    options.showPlan && isCustomPlan(planner)
      ? { route: [planner.startDistrict, ...planner.stops], days: planner.days, travelers: planner.travelers }
      : null;

  return {
    name,
    hasName: name.length > 0,
    visited,
    visitedCount: visited.length,
    percent: Math.round((visited.length / 64) * 100),
    divisionsCovered,
    wishlistCount: [...input.wishlist].filter((d) => d in DISTRICT_DETAILS).length,
    countryCount: input.countries.size,
    badge: { title: badge.title, en: badge.en },
    diary,
    plan,
    quote,
  };
}

export const routeLabel = (route: string[]) => route.map((d) => DISTRICT_DETAILS[d]?.bn ?? d).join(' → ');

/** Ready-to-paste Facebook caption (Bangla), built from the same data as the image. */
export function buildCaption(d: CardData, site: string): string {
  const who = d.hasName ? `${d.name}-এর` : 'আমার';
  const lines = [
    `🇧🇩 ${who} বাংলাদেশ ভ্রমণ কার্ড`,
    `৬৪টি জেলার মধ্যে ${toBengaliNumber(d.visitedCount)}টি ঘোরা হয়েছে (${toBengaliNumber(d.percent)}%) · ${d.badge.title}`,
    `${toBengaliNumber(d.divisionsCovered.length)}টি বিভাগ ছুঁয়েছি`,
  ];
  if (d.diary) lines.push(`ডায়েরিতে ${toBengaliNumber(d.diary.count)}টি স্মৃতি লিখেছি`);
  if (d.plan) lines.push(`পরবর্তী যাত্রা: ${routeLabel(d.plan.route)} (${toBengaliNumber(d.plan.days)} দিন)`);
  lines.push('', `তোমার ভ্রমণ কার্ড বানাও: ${site}`, '#DeshBhromon #দেশভ্রমণ #বাংলাদেশ');
  return lines.join('\n');
}

export function cardAltText(d: CardData): string {
  return `${d.hasName ? d.name : 'ভ্রমণকারী'}-এর দেশভ্রমণ ট্রাভেল কার্ড: ৬৪টি জেলার মধ্যে ${toBengaliNumber(d.visitedCount)}টি ঘোরা, ${d.badge.title}`;
}

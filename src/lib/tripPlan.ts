import { DISTRICT_DETAILS } from '../data/bangladesh-data';
import { readObject, writeObject } from './storage';

export type BudgetTier = 'budget' | 'standard' | 'luxury';
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface PlannerState {
  startDistrict: string;
  stops: string[];
  days: number;
  travelers: number;
  budgetTier: BudgetTier;
  notes: string;
  transportCost: number;
  foodCostPerPersonDay: number;
  lodgingCostPerNight: number;
  roomCount: number;
  otherCost: number;
  checklist: ChecklistItem[];
}

export const PLANNER_KEY = 'trip_planner';

export const defaultChecklist = (): ChecklistItem[] => [
  { id: '1', text: 'জাতীয় পরিচয়পত্র / স্টুডেন্ট আইডি', done: true },
  { id: '2', text: 'মোবাইল চার্জার ও পাওয়ার ব্যাংক', done: true },
  { id: '3', text: 'জরুরি ফার্স্ট এইড ও প্রয়োজনীয় ওষুধ', done: false },
  { id: '4', text: 'আরামদায়ক হাঁটার জুতো বা স্নিকার্স', done: false },
  { id: '5', text: 'বৃষ্টির জন্য ছাতা বা রেইনকোট', done: false },
  { id: '6', text: 'ক্যাশ টাকা (কিছু দুর্গম এলাকায় এটিএম বা অনলাইন নাও পেতে পারে)', done: false },
];

export const defaultPlanner = (): PlannerState => ({
  startDistrict: 'Dhaka',
  stops: ["Cox's Bazar", 'Bandarban'],
  days: 4,
  travelers: 2,
  budgetTier: 'standard',
  notes: '',
  transportCost: 3600,
  foodCostPerPersonDay: 650,
  lodgingCostPerNight: 2400,
  roomCount: 1,
  otherCost: 1200,
  checklist: defaultChecklist(),
});

const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

function int(x: unknown, min: number, max: number, fallback: number): number {
  return typeof x === 'number' && Number.isFinite(x) ? Math.min(max, Math.max(min, Math.round(x))) : fallback;
}

// Field-by-field salvage: a valid field is kept, an invalid one falls back to its default.
// A value that is not an object at all is rejected (null) so the caller can back it up.
export function parsePlanner(x: unknown): PlannerState | null {
  if (!isRecord(x)) return null;
  const d = defaultPlanner();
  const start =
    typeof x.startDistrict === 'string' && x.startDistrict in DISTRICT_DETAILS ? x.startDistrict : d.startDistrict;
  const stops = Array.isArray(x.stops)
    ? [...new Set(x.stops.filter((s): s is string => typeof s === 'string' && s in DISTRICT_DETAILS))].filter(
        (s) => s !== start,
      )
    : d.stops.filter((s) => s !== start);
  const checklist = Array.isArray(x.checklist)
    ? x.checklist
        .filter(isRecord)
        .filter((i) => typeof i.id === 'string' && typeof i.text === 'string' && typeof i.done === 'boolean')
        .map((i) => ({ id: i.id as string, text: i.text as string, done: i.done as boolean }))
    : d.checklist;
  return {
    startDistrict: start,
    stops,
    days: int(x.days, 1, 30, d.days),
    travelers: int(x.travelers, 1, 50, d.travelers),
    budgetTier: x.budgetTier === 'budget' || x.budgetTier === 'standard' || x.budgetTier === 'luxury' ? x.budgetTier : d.budgetTier,
    notes: typeof x.notes === 'string' ? x.notes.slice(0, 2000) : '',
    transportCost: int(x.transportCost, 0, 1e9, d.transportCost),
    foodCostPerPersonDay: int(x.foodCostPerPersonDay, 0, 1e9, d.foodCostPerPersonDay),
    lodgingCostPerNight: int(x.lodgingCostPerNight, 0, 1e9, d.lodgingCostPerNight),
    roomCount: int(x.roomCount, 1, 20, d.roomCount),
    otherCost: int(x.otherCost, 0, 1e9, d.otherCost),
    checklist,
  };
}

export const loadPlanner = (): PlannerState => readObject(PLANNER_KEY, parsePlanner) ?? defaultPlanner();
export const savePlanner = (s: PlannerState): boolean => writeObject(PLANNER_KEY, s);

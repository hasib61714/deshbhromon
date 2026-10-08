import { DISTRICT_DETAILS, DIVISIONS } from '../data/bangladesh-data';
import { ICONIC_FOODS } from '../data/food-data';

export const shuffle = <T,>(a: T[], rnd: () => number = Math.random): T[] => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

const ids = Object.keys(DISTRICT_DETAILS);
const bn = (id: string) => DISTRICT_DETAILS[id].bn;

// Clue game: "what is this district known for?" -> pick the district. The clue never contains the district's own name.
export interface ClueRound { clue: string; answer: string; options: string[] }
export function clueRounds(n = 10, rnd: () => number = Math.random): ClueRound[] {
  const usable = ids.filter((id) => !DISTRICT_DETAILS[id].fam.includes(bn(id)));
  return shuffle(usable, rnd).slice(0, n).map((id) => ({
    clue: DISTRICT_DETAILS[id].fam,
    answer: id,
    options: shuffle([id, ...shuffle(ids.filter((x) => x !== id), rnd).slice(0, 3)], rnd),
  }));
}

// True/false game, generated only from the app's own data (district -> division, district -> what it is known for)
export interface TfRound { statement: string; truth: boolean }
export function trueFalseRounds(n = 10, rnd: () => number = Math.random): TfRound[] {
  const out: TfRound[] = [];
  for (const id of shuffle(ids, rnd).slice(0, n)) {
    const d = DISTRICT_DETAILS[id];
    const truth = rnd() < 0.5;
    if (rnd() < 0.5) {
      const other = shuffle(DIVISIONS.filter((v) => v.bn !== d.dvBn), rnd)[0].bn;
      out.push({ statement: `${d.bn} জেলা ${truth ? d.dvBn : other} বিভাগে অবস্থিত।`, truth });
    } else {
      const other = shuffle(ids.filter((x) => x !== id && DISTRICT_DETAILS[x].fam !== d.fam), rnd)[0];
      out.push({ statement: `${d.bn} জেলার পরিচিতি: ${truth ? d.fam : DISTRICT_DETAILS[other].fam}।`, truth });
    }
  }
  return out;
}

// Memory game: pairs of (food, its district)
export interface MemoryCard { key: string; pair: string; label: string; kind: 'food' | 'district' }
export function memoryDeck(pairs = 6, rnd: () => number = Math.random): MemoryCard[] {
  const foods = shuffle(ICONIC_FOODS.filter((f) => f.districtId !== 'ALL' && DISTRICT_DETAILS[f.districtId]), rnd);
  const seen = new Set<string>();
  const picked = foods.filter((f) => (seen.has(f.districtId) ? false : (seen.add(f.districtId), true))).slice(0, pairs);
  return shuffle(
    picked.flatMap((f) => [
      { key: `${f.id}-f`, pair: f.id, label: f.nameBn, kind: 'food' as const },
      { key: `${f.id}-d`, pair: f.id, label: bn(f.districtId), kind: 'district' as const },
    ]),
    rnd,
  );
}

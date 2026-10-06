import { describe, expect, it } from 'vitest';
import fs from 'fs';
import { DISTRICT_DETAILS, DIVISIONS } from './bangladesh-data';
import { DATA } from './map-data';
import { DISTRICT_COORDS } from './district-coords';
import { DISTRICT_IMAGES } from './landmark-images';
import { DISTRICT_ART_DATA } from './landmark-art';
import { ICONIC_FOODS } from './food-data';
import { SEASON_PHOTOS } from './season-photos';
import { QUIZ_QUESTIONS } from './quiz-questions';
import { ANAGRAM_PUZZLES, FOOD_MATCH_PAIRS, PHOTO_MYSTERY_ITEMS } from './quiz-games';

const places = JSON.parse(fs.readFileSync('public/places.json', 'utf8')) as Record<string, any>;
const world = JSON.parse(fs.readFileSync('public/world.json', 'utf8')) as { f: any[] };

// Official administrative divisions of Bangladesh (64 districts / 8 divisions)
const OFFICIAL: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishorganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Rajshahi: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
};
const ids = Object.keys(DISTRICT_DETAILS);

describe('districts and divisions', () => {
  it('has 64 districts and 8 divisions', () => {
    expect(ids).toHaveLength(64);
    expect(DIVISIONS).toHaveLength(8);
  });
  it('matches the official division membership', () => {
    for (const [dv, list] of Object.entries(OFFICIAL)) {
      for (const d of list) expect(DISTRICT_DETAILS[d]?.dv, d).toBe(dv);
    }
  });
  it('keeps every dataset keyed by the same 64 district ids', () => {
    for (const keys of [DATA.f.map((f) => f.n), Object.keys(DISTRICT_COORDS), Object.keys(DISTRICT_IMAGES), Object.keys(places)]) {
      expect([...keys].sort()).toEqual([...ids].sort());
    }
    for (const k of Object.keys(DISTRICT_ART_DATA)) expect(ids, k).toContain(k);
    for (const f of DATA.f) expect(f.dv, f.n).toBe(DISTRICT_DETAILS[f.n].dv);
  });
});

describe('places.json', () => {
  const spots = Object.entries(places).flatMap(([d, p]) => p.spots.map((s: any) => ({ d, s })));
  it('has at least one spot per district with the required fields', () => {
    for (const [d, p] of Object.entries<any>(places)) {
      expect(p.spots.length, d).toBeGreaterThan(0);
      for (const k of ['intro', 'go', 'cost', 'food', 'fam', 'nm']) expect(p[k], `${d}.${k}`).toBeTruthy();
    }
    for (const { d, s } of spots) {
      for (const k of ['n', 'd', 'h', 'how', 'best', 'dur', 'cost', 'tips', 'w']) expect(s[k], `${d}/${s.n}.${k}`).toBeTruthy();
    }
  });
  it('has no duplicate Bangla spot names', () => {
    const names = spots.map(({ s }) => s.n);
    expect(new Set(names).size).toBe(names.length);
  });
  it('credits every photo (author, licence and Commons source)', () => {
    const imgs: any[] = [];
    for (const p of Object.values<any>(places)) {
      for (const f of p.fam) if (f[2]) imgs.push(f[2]);
      for (const s of p.spots) { if (s.img) imgs.push(s.img); imgs.push(...(s.gal ?? [])); }
    }
    expect(imgs.length).toBeGreaterThan(800);
    for (const i of imgs) {
      expect(i.by).toBeTruthy();
      expect(i.lic).toBeTruthy();
      expect(i.src).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });
  it('contains known-wrong images no more', () => {
    const text = JSON.stringify(places);
    for (const bad of ['Atchafalaya_Basin', 'Aichi_Triennale', 'Bayt_al_Mukarram']) expect(text).not.toContain(bad);
  });
  it('uses one spelling for contested Bangla words', () => {
    const all = JSON.stringify(places) + fs.readFileSync('src/data/quiz-questions.ts', 'utf8') + fs.readFileSync('src/data/food-data.ts', 'utf8');
    expect(all).not.toContain('মুন্সিগঞ্জ');
    expect(all).not.toContain('পুন্ড্র');
    expect(all).not.toContain('রসমলাই');
  });
});

describe('food', () => {
  it('has unique ids, valid districts and complete fields', () => {
    expect(new Set(ICONIC_FOODS.map((f) => f.id)).size).toBe(ICONIC_FOODS.length);
    for (const f of ICONIC_FOODS) {
      if (f.districtId !== 'ALL') expect(DISTRICT_DETAILS[f.districtId], f.id).toBeDefined(); // 'ALL' = known all over Bangladesh
      expect(f.nameBn.length).toBeGreaterThan(3);
      expect(f.desc.length).toBeGreaterThan(20);
      expect(['sweet', 'main', 'snack', 'fruit']).toContain(f.category);
    }
  });
});

describe('quiz', () => {
  it('has unique ids and questions with a valid answer', () => {
    expect(new Set(QUIZ_QUESTIONS.map((q) => q.id)).size).toBe(QUIZ_QUESTIONS.length);
    expect(new Set(QUIZ_QUESTIONS.map((q) => q.question)).size).toBe(QUIZ_QUESTIONS.length);
    for (const q of QUIZ_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size, `q${q.id} options`).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.districtId && DISTRICT_DETAILS[q.districtId], `q${q.id}`).toBeTruthy();
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });
  it('photo-mystery answers are among the options and match the district', () => {
    for (const p of PHOTO_MYSTERY_ITEMS) {
      expect(p.options).toContain(p.correct);
      expect(DISTRICT_DETAILS[p.districtId].bn).toBe(p.correct);
    }
  });
  it('food-match pairs agree with the district names', () => {
    for (const p of FOOD_MATCH_PAIRS) expect(DISTRICT_DETAILS[p.districtId].bn).toBe(p.district);
  });
  it('every anagram can be solved from its tiles and names a real district', () => {
    for (const a of ANAGRAM_PUZZLES) {
      expect(Object.values(DISTRICT_DETAILS).some((d) => d.bn === a.solution), a.solution).toBe(true);
      const solve = (left: string[], acc: string): boolean =>
        acc === a.solution || left.some((t, i) => (a.solution.startsWith(acc + t) ? solve(left.filter((_, j) => j !== i), acc + t) : false));
      expect(solve(a.letters, ''), a.solution).toBe(true);
    }
  });
});

describe('world.json', () => {
  it('has unique ISO3 codes and English/Bangla names', () => {
    for (const k of ['i', 'n', 'b']) expect(new Set(world.f.map((c) => c[k])).size).toBe(world.f.length);
    for (const c of world.f) expect(c.i).toMatch(/^[A-Z]{3}$/);
    expect(world.f.some((c) => c.i === 'BGD')).toBe(true);
  });
});

describe('emergency numbers', () => {
  // Only numbers confirmed from public sources may appear anywhere in the UI source.
  const VERIFIED = new Set(['999', '131', '16163', '1090', '01320222222', '01887878787']);
  const norm = (n: string) => n.replace(/-/g, '');
  it('every phone number in the safety UI is on the verified list', () => {
    for (const file of ['src/components/EmergencyHelpModal.tsx', 'src/components/TravelSafetyAndSeasons.tsx']) {
      const src = fs.readFileSync(file, 'utf8');
      const found = [...src.matchAll(/(?:phone|number|tel): '([0-9-]+)'/g)].map((m) => norm(m[1]));
      expect(found.length, file).toBeGreaterThan(2);
      for (const n of found) expect(VERIFIED.has(n), `${file}: ${n}`).toBe(true);
    }
  });
});

describe('content security policy', () => {
  const csp = (JSON.parse(fs.readFileSync('vercel.json', 'utf8')).headers[0].headers as { key: string; value: string }[]).find(
    (h) => h.key === 'Content-Security-Policy',
  )!.value;
  const dir = (n: string) => csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(n + ' ')) ?? '';
  it('lets photos load through every host of the Wikimedia redirect chain, and nothing wider', () => {
    // Special:FilePath on commons redirects to upload.* or thumb.* (CSP is checked on every hop).
    expect(dir('img-src').split(' ').slice(1).sort()).toEqual(
      ["'self'", 'blob:', 'data:', 'https://commons.wikimedia.org', 'https://thumb.wikimedia.org', 'https://upload.wikimedia.org'].sort(),
    );
  });
  it('keeps scripts and connections locked down', () => {
    expect(dir('script-src')).toBe("script-src 'self'");
    // Commons API (CORS) is how the downloaded district card gets an exportable photo
    expect(dir('connect-src')).toBe("connect-src 'self' https://api.open-meteo.com https://commons.wikimedia.org");
  });
});

describe('photos reused from places.json', () => {
  const all = new Map<string, { by: string; lic: string }>();
  for (const p of Object.values<any>(places)) {
    for (const f of p.fam) if (f[2]) all.set(f[2].src, f[2]);
    for (const s of p.spots) { if (s.img) all.set(s.img.src, s.img); for (const g of s.gal ?? []) all.set(g.src, g); }
  }
  const same = (a: { src: string; by: string; lic: string }) => {
    const o = all.get(a.src);
    return !!o && o.by === a.by && o.lic === a.lic;
  };

  it('every food photo is an already-credited places.json photo with identical author and licence', () => {
    const withPhoto = ICONIC_FOODS.filter((f) => f.img);
    expect(withPhoto.length).toBeGreaterThanOrEqual(35);
    for (const f of withPhoto) expect(same(f.img!), `${f.id} ${f.nameBn}`).toBe(true);
  });

  it('the food list kept every original food and added many more', () => {
    expect(ICONIC_FOODS.length).toBeGreaterThanOrEqual(45);
    for (let i = 1; i <= 20; i++) expect(ICONIC_FOODS.some((f) => f.id === `f${i}`), `f${i}`).toBe(true);
  });

  it('never shows a photo that is plainly from outside Bangladesh or of another product', () => {
    for (const f of ICONIC_FOODS) expect(f.img?.src ?? '', f.id).not.toMatch(/Siliguri|West_Bengal|Butterschmalz|Kolkata/i);
  });

  it('every season has its own credited photo from places.json', () => {
    expect(Object.keys(SEASON_PHOTOS).sort()).toEqual(['autumn', 'monsoon', 'spring', 'summer', 'winter']);
    for (const [k, p] of Object.entries(SEASON_PHOTOS)) expect(same(p), k).toBe(true);
  });
});

describe('food coverage', () => {
  it('every district has at least one traditional food', () => {
    const covered = new Set(ICONIC_FOODS.map((f) => f.districtId));
    const missing = ids.filter((d) => !covered.has(d));
    expect(missing).toEqual([]);
  });
  it('has a nationwide group and uses only the four known categories', () => {
    expect(ICONIC_FOODS.filter((f) => f.districtId === 'ALL').length).toBeGreaterThanOrEqual(30);
    for (const f of ICONIC_FOODS) expect(['sweet', 'main', 'snack', 'fruit'], f.id).toContain(f.category);
  });
  it('the photo-finder wishlist points at real foods without a photo yet', () => {
    const wish = JSON.parse(fs.readFileSync('scripts/food-wishlist.json', 'utf8')) as { id: string }[];
    expect(new Set(wish.map((w) => w.id)).size).toBe(wish.length);
    expect(wish.filter((w) => w.id.startsWith('season-')).length).toBe(5);
    for (const w of wish.filter((x) => !x.id.startsWith('season-'))) {
      const f = ICONIC_FOODS.find((x) => x.id === w.id);
      expect(f, w.id).toBeDefined();
      expect(f!.img, `${w.id} already has a photo`).toBeUndefined();
    }
  });
});

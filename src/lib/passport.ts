// Travel passport: one stamp per visited district, 12 stamps a page. All of it is drawn on the traveller's own device.
export const STAMPS_PER_PAGE = 12;

export type StampShape = 'circle' | 'rounded' | 'hex' | 'oval';
export interface StampStyle {
  shape: StampShape;
  color: string;
  rotation: number; // radians
}

export const STAMP_COLORS = ['#0f766e', '#1d4ed8', '#9f1239', '#6d28d9', '#b45309', '#15803d', '#be123c', '#0e7490'];
const SHAPES: StampShape[] = ['circle', 'rounded', 'hex', 'oval'];

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// The same district always gets the same stamp look
export function stampStyle(districtId: string): StampStyle {
  const h = hash(districtId);
  return {
    shape: SHAPES[h % SHAPES.length],
    color: STAMP_COLORS[(h >>> 3) % STAMP_COLORS.length],
    rotation: (((h >>> 7) % 17) - 8) * (Math.PI / 180),
  };
}

export const passportPages = (stampCount: number): number => Math.max(1, Math.ceil(stampCount / STAMPS_PER_PAGE));

export function stampsOnPage(ids: string[], page: number): string[] {
  return ids.slice((page - 1) * STAMPS_PER_PAGE, page * STAMPS_PER_PAGE);
}

// Stable-looking passport number from the traveller's name (not a real document number)
export function passportNumber(name: string): string {
  const n = String(hash(name.trim().toLowerCase() || 'deshbhromon') % 1000000).padStart(6, '0');
  return `DB${n}`;
}

export const COVERS = {
  green: { id: 'green', bn: 'সবুজ', en: 'Green', from: '#0b4f3a', to: '#052e22' },
  blue: { id: 'blue', bn: 'নীল', en: 'Blue', from: '#1e3a8a', to: '#0f1f4d' },
  maroon: { id: 'maroon', bn: 'মেরুন', en: 'Maroon', from: '#7f1d2d', to: '#4a0f19' },
} as const;
export type CoverId = keyof typeof COVERS;

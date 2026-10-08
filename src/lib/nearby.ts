// "Nearby districts": the districts whose map centres are closest to this one (straight-line distance on the district map).
export interface CentroidFeature {
  n: string;
  c: [number, number];
}

export function nearestDistricts(id: string, features: CentroidFeature[], k = 5): string[] {
  const me = features.find((f) => f.n === id);
  if (!me) return [];
  return features
    .filter((f) => f.n !== id)
    .map((f) => ({ n: f.n, d: Math.hypot(f.c[0] - me.c[0], f.c[1] - me.c[1]) }))
    .sort((a, b) => a.d - b.d || a.n.localeCompare(b.n))
    .slice(0, k)
    .map((x) => x.n);
}

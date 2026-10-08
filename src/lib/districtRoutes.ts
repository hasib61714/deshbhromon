// Every district has its own shareable address, e.g. /district/sylhet/ . The build step writes a static page for
// each one (so search engines and Facebook previews see the district), and the app opens that district on load.
export const districtSlug = (id: string): string =>
  id.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const districtPath = (id: string): string => `/district/${districtSlug(id)}/`;

// Returns the district id for a pathname like "/district/sylhet/" (or null)
export function districtFromPath(pathname: string, ids: string[]): string | null {
  const m = /^\/district\/([a-z0-9-]+)\/?$/.exec(pathname);
  if (!m) return null;
  return ids.find((id) => districtSlug(id) === m[1]) ?? null;
}

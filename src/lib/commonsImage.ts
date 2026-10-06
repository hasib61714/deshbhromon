// Loads a Wikimedia Commons photo so it can be drawn on a canvas and exported as PNG.
// A canvas is only exportable if the image was fetched with CORS. Special:FilePath works for a plain
// <img> but its redirect does not allow CORS, so the exact thumbnail URL is asked from the Commons API
// (CORS-enabled with origin=*) and that upload.wikimedia.org URL is loaded with crossOrigin.

export const commonsFileName = (photoUrl: string): string | null => {
  const m = photoUrl.match(/Special:FilePath\/([^?]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
};

function loadCors(url: string, timeoutMs: number): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img.naturalWidth > 0 ? img : null);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

export async function loadCommonsImageForCanvas(photoUrl: string, width = 1200, timeoutMs = 15000): Promise<HTMLImageElement | null> {
  const file = commonsFileName(photoUrl);
  if (!file) return null;
  try {
    const api =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url' +
      `&iiurlwidth=${width}&titles=${encodeURIComponent(`File:${file}`)}&origin=*`;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    const res = await fetch(api, { signal: ac.signal }).finally(() => clearTimeout(timer));
    if (!res.ok) return null;
    const json = (await res.json()) as { query?: { pages?: Record<string, { imageinfo?: { thumburl?: string; url?: string }[] }> } };
    const info = Object.values(json.query?.pages ?? {})[0]?.imageinfo?.[0];
    const urls = [info?.thumburl, info?.url].filter((u): u is string => !!u && /^https:\/\/upload\.wikimedia\.org\//.test(u));
    for (const u of urls) {
      const img = await loadCors(u, timeoutMs);
      if (img) return img;
    }
  } catch {
    /* network / CORS / abort: the caller falls back to the illustrated card */
  }
  return null;
}

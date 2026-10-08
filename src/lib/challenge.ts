// Friend challenge: a shareable link that carries the sender's name and visited districts, so a friend can compare.
// Everything is in the link itself (no server, no account). The code is a bitmask of the 64 districts in a fixed order.
export const MAX_NAME = 30;

const b64url = (bytes: number[]) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s: string) => Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

export function encodeVisited(visited: Set<string>, orderedIds: string[]): string {
  const bytes = new Array(Math.ceil(orderedIds.length / 8)).fill(0);
  orderedIds.forEach((id, i) => {
    if (visited.has(id)) bytes[i >> 3] |= 1 << (i & 7);
  });
  return b64url(bytes);
}

export function decodeVisited(code: string, orderedIds: string[]): Set<string> | null {
  try {
    if (!/^[A-Za-z0-9_-]{1,16}$/.test(code)) return null;
    const bytes = unb64url(code);
    if (bytes.length !== Math.ceil(orderedIds.length / 8)) return null;
    const out = new Set<string>();
    orderedIds.forEach((id, i) => {
      if (bytes[i >> 3] & (1 << (i & 7))) out.add(id);
    });
    return out;
  } catch {
    return null;
  }
}

export const cleanName = (n: string | null | undefined) =>
  Array.from(n ?? '')
    .filter((ch) => ch.charCodeAt(0) >= 32 && ch !== '<' && ch !== '>')
    .join('')
    .trim()
    .slice(0, MAX_NAME);

export function challengeUrl(origin: string, visited: Set<string>, name: string, orderedIds: string[]): string {
  const p = new URLSearchParams({ c: encodeVisited(visited, orderedIds) });
  const n = cleanName(name);
  if (n) p.set('n', n);
  return `${origin}/?${p.toString()}#home`;
}

export function readChallenge(search: string, orderedIds: string[]): { name: string; visited: Set<string> } | null {
  const p = new URLSearchParams(search);
  const code = p.get('c');
  if (!code) return null;
  const visited = decodeVisited(code, orderedIds);
  return visited ? { name: cleanName(p.get('n')), visited } : null;
}

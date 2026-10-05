// Safe wrappers around localStorage: they never throw (private mode, quota,
// blocked storage) and validate shapes read back from disk.

const PREFIX = 'deshbhromon_';

export function readString(key: string, fallback: string): string {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key: string, value: string): boolean {
  try {
    localStorage.setItem(PREFIX + key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function readStringSet(key: string, fallback: string[] = []): Set<string> {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return new Set(fallback);
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    }
  } catch {
    /* fall through */
  }
  return new Set(fallback);
}

export function writeStringSet(key: string, value: Set<string>): boolean {
  return writeString(key, JSON.stringify([...value]));
}

export function readList<T>(key: string, isItem: (x: unknown) => x is T): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(isItem);
  } catch {
    /* fall through */
  }
  return [];
}

export function writeList<T>(key: string, value: T[]): boolean {
  return writeString(key, JSON.stringify(value));
}

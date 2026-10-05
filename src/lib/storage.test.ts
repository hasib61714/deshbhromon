import { beforeEach, describe, expect, it } from 'vitest';
import { readList, readString, readStringSet, writeString, writeStringSet } from './storage';

function installStorage(opts: { throws?: boolean } = {}) {
  const data = new Map<string, string>();
  const fail = () => {
    throw new Error('blocked');
  };
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => (opts.throws ? fail() : data.get(k) ?? null),
    setItem: (k: string, v: string) => (opts.throws ? fail() : void data.set(k, v)),
    removeItem: (k: string) => void data.delete(k),
  } as unknown as Storage;
  return data;
}

describe('storage helpers', () => {
  beforeEach(() => installStorage());

  it('round-trips string sets under the deshbhromon_ prefix', () => {
    const data = installStorage();
    writeStringSet('visited', new Set(['Dhaka', 'Sylhet']));
    expect(data.has('deshbhromon_visited')).toBe(true);
    expect([...readStringSet('visited')].sort()).toEqual(['Dhaka', 'Sylhet']);
  });

  it('starts empty for new users', () => {
    expect(readStringSet('visited').size).toBe(0);
    expect(readString('traveler_name', '')).toBe('');
  });

  it('ignores corrupt or wrongly-shaped data', () => {
    const data = installStorage();
    data.set('deshbhromon_visited', '{not json');
    expect(readStringSet('visited').size).toBe(0);
    data.set('deshbhromon_visited', JSON.stringify(['Dhaka', 5, null]));
    expect([...readStringSet('visited')]).toEqual(['Dhaka']);
    data.set('deshbhromon_logs', JSON.stringify([{ a: 1 }, 'x']));
    expect(readList('logs', (x): x is { a: number } => typeof x === 'object' && x !== null && 'a' in x)).toEqual([{ a: 1 }]);
  });

  it('keeps a backup of unreadable data instead of silently losing it', () => {
    const data = installStorage();
    data.set('deshbhromon_visited', '{broken');
    expect(readStringSet('visited').size).toBe(0);
    expect(data.get('deshbhromon_visited_unreadable_backup')).toBe('{broken');
    data.set('deshbhromon_logs', '"not an array"');
    expect(readList('logs', (x): x is string => typeof x === 'string')).toEqual([]);
    expect(data.get('deshbhromon_logs_unreadable_backup')).toBe('"not an array"');
  });

  it('survives a full-storage (quota) error on write', () => {
    installStorage({ throws: true });
    expect(writeStringSet('visited', new Set(['Dhaka']))).toBe(false);
  });

  it('never throws when storage is blocked', () => {
    installStorage({ throws: true });
    expect(readStringSet('visited').size).toBe(0);
    expect(writeString('x', 'y')).toBe(false);
  });
});

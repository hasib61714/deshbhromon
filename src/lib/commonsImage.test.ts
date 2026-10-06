// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commonsFileName, loadCommonsImageForCanvas } from './commonsImage';

const URL_IN = 'https://commons.wikimedia.org/wiki/Special:FilePath/Sixty_Dome_Mosque%2CBagerhat.jpg?width=800';

describe('commonsFileName', () => {
  it('extracts and decodes the Commons file name', () => {
    expect(commonsFileName(URL_IN)).toBe('Sixty_Dome_Mosque,Bagerhat.jpg');
    expect(commonsFileName('https://example.com/a.jpg')).toBeNull();
  });
});

describe('loadCommonsImageForCanvas', () => {
  const loaded: string[] = [];
  beforeEach(() => {
    loaded.length = 0;
    // Minimal Image stand-in: succeeds for upload.wikimedia.org URLs unless they contain "bad"
    class FakeImage {
      crossOrigin = '';
      naturalWidth = 1200;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(v: string) {
        loaded.push(`${this.crossOrigin}|${v}`);
        queueMicrotask(() => (v.includes('bad') ? this.onerror?.() : this.onload?.()));
      }
    }
    vi.stubGlobal('Image', FakeImage);
  });
  afterEach(() => vi.unstubAllGlobals());

  const api = (info: unknown) => vi.fn().mockResolvedValue({ ok: true, json: async () => ({ query: { pages: { '1': { imageinfo: [info] } } } }) });

  it('asks the CORS-enabled API for the exact thumbnail and loads it with crossOrigin', async () => {
    const fetchMock = api({ thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/1200px-X.jpg', url: 'https://upload.wikimedia.org/o.jpg' });
    vi.stubGlobal('fetch', fetchMock);
    const img = await loadCommonsImageForCanvas(URL_IN, 1200);
    expect(img).not.toBeNull();
    const called = String(fetchMock.mock.calls[0][0]);
    expect(called).toContain('origin=*');
    expect(called).toContain('iiurlwidth=1200');
    expect(called).toContain(encodeURIComponent('File:Sixty_Dome_Mosque,Bagerhat.jpg'));
    expect(loaded[0]).toBe('anonymous|https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/1200px-X.jpg');
  });

  it('falls back to the original file URL, then to null', async () => {
    vi.stubGlobal('fetch', api({ thumburl: 'https://upload.wikimedia.org/bad.jpg', url: 'https://upload.wikimedia.org/original.jpg' }));
    expect(await loadCommonsImageForCanvas(URL_IN)).not.toBeNull();
    expect(loaded.map((l) => l.split('|')[1])).toEqual(['https://upload.wikimedia.org/bad.jpg', 'https://upload.wikimedia.org/original.jpg']);
    vi.stubGlobal('fetch', api({ thumburl: 'https://upload.wikimedia.org/bad.jpg' }));
    expect(await loadCommonsImageForCanvas(URL_IN)).toBeNull();
  });

  it('never loads URLs from other hosts and survives API failures', async () => {
    vi.stubGlobal('fetch', api({ thumburl: 'https://evil.example/x.jpg' }));
    expect(await loadCommonsImageForCanvas(URL_IN)).toBeNull();
    expect(loaded).toEqual([]);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('blocked')));
    expect(await loadCommonsImageForCanvas(URL_IN)).toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect(await loadCommonsImageForCanvas(URL_IN)).toBeNull();
  });
});

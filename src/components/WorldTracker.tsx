import React, { useEffect, useMemo, useState } from 'react';
import { toBengaliNumber } from '../data/bangladesh-data';
import { CONTINENTS, WorldData } from '../lib/world';
import { Globe, Search, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';

interface WorldTrackerProps {
  visitedCountries: Set<string>;
  onToggleCountry: (country: string) => void;
  onClearCountries: () => void;
}

export const WorldTracker: React.FC<WorldTrackerProps> = ({
  visitedCountries,
  onToggleCountry,
  onClearCountries,
}) => {
  const [world, setWorld] = useState<WorldData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [search, setSearch] = useState<string>('');
  const [continent, setContinent] = useState<string>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/world.json')
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<WorldData>;
      })
      .then((data) => {
        if (cancelled) return;
        setWorld(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const countries = useMemo(
    () => (world ? [...world.f].sort((a, b) => a.b.localeCompare(b.b, 'bn')) : []),
    [world]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return countries.filter(
      (c) =>
        (continent === 'all' || c.ct === continent) &&
        (!q || c.b.includes(search.trim()) || c.n.toLowerCase().includes(q))
    );
  }, [countries, search, continent]);

  const total = countries.length;
  const visitedList = countries.filter((c) => visitedCountries.has(c.i));
  const percent = total ? Math.round((visitedList.length / total) * 100) : 0;
  const hoveredCountry = hovered ? countries.find((c) => c.i === hovered) : null;

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="relative text-white rounded-3xl p-5 sm:p-8 shadow-xl overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url('/assets/hero/world-poster.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/80" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>আন্তর্জাতিক ভ্রমণ ট্র্যাকার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">বিশ্ব ভ্রমণ মানচিত্র</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              বাংলাদেশের বাইরে যে দেশগুলোতে গিয়েছেন, মানচিত্রে বা তালিকা থেকে চিহ্নিত করুন। আপনার তথ্য শুধু এই ব্রাউজারে সংরক্ষিত থাকে।
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl shrink-0 shadow-inner">
            <div className="text-center">
              <span className="block text-[10px] text-blue-200 font-bold uppercase tracking-wider">ঘোরা দেশ</span>
              <strong className="text-2xl font-black text-white">{toBengaliNumber(visitedList.length)}</strong>
              <span className="text-xs text-blue-200"> / {toBengaliNumber(total || 195)}</span>
            </div>
            <div className="text-center border-l border-white/20 pl-4">
              <span className="block text-[10px] text-blue-200 font-bold uppercase tracking-wider">বিশ্বের</span>
              <strong className="text-2xl font-black text-white">{toBengaliNumber(percent)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {status === 'loading' && (
        <div role="status" aria-live="polite" className="min-h-[100svh] pt-16 text-center text-sm text-stone-500">
          মানচিত্র লোড হচ্ছে…
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="py-12 text-center space-y-3">
          <p className="text-sm text-stone-700">বিশ্ব মানচিত্র লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>
          <button
            type="button"
            onClick={() => {
              setStatus('loading');
              setAttempt((a) => a + 1);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {status === 'ready' && world && (
        <>
          {/* Map */}
          <section aria-labelledby="world-map-title" className="bg-white border border-stone-200 rounded-3xl p-3 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-2 px-1">
              <h2 id="world-map-title" className="text-sm font-bold text-stone-900">মানচিত্রে ট্যাপ করে চিহ্নিত করুন</h2>
              <span className="text-xs text-stone-500 min-h-4 truncate" aria-hidden="true">
                {hoveredCountry ? hoveredCountry.b : ''}
              </span>
            </div>
            <svg
              viewBox={`0 0 ${world.w} ${world.h}`}
              className="w-full h-auto rounded-2xl bg-sky-50"
              role="img"
              aria-label={`বিশ্ব মানচিত্র, ${toBengaliNumber(visitedList.length)}টি দেশ চিহ্নিত`}
            >
              <path d={world.bg} fill="#e2e8f0" />
              {world.f.map((c) => {
                const isVisited = visitedCountries.has(c.i);
                return (
                  <path
                    key={c.i}
                    d={c.d}
                    fill={isVisited ? '#2563eb' : '#cbd5e1'}
                    stroke={isVisited ? '#1e3a8a' : '#f8fafc'}
                    strokeWidth={0.5}
                    className="cursor-pointer transition-colors hover:fill-emerald-500"
                    onClick={() => onToggleCountry(c.i)}
                    onMouseEnter={() => setHovered(c.i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <title>{`${c.b} (${c.n})`}</title>
                  </path>
                );
              })}
              {world.f
                .filter((c) => c.sm)
                .map((c) => {
                  const isVisited = visitedCountries.has(c.i);
                  return (
                    <circle
                      key={`m-${c.i}`}
                      cx={c.c[0]}
                      cy={c.c[1]}
                      r={3}
                      fill={isVisited ? '#2563eb' : '#94a3b8'}
                      stroke="#fff"
                      strokeWidth={0.8}
                      className="cursor-pointer"
                      onClick={() => onToggleCountry(c.i)}
                    >
                      <title>{`${c.b} (${c.n})`}</title>
                    </circle>
                  );
                })}
            </svg>
            <div className="flex flex-wrap items-center gap-4 mt-3 px-1 text-xs text-stone-600">
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-600" />ঘুরেছি</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-300" />এখনো না</span>
            </div>
          </section>

          {/* Continent progress */}
          <section aria-label="মহাদেশ অনুযায়ী অগ্রগতি" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CONTINENTS.map((ct) => {
              const all = countries.filter((c) => c.ct === ct.id);
              const done = all.filter((c) => visitedCountries.has(c.i)).length;
              return (
                <div key={ct.id} className="bg-white border border-stone-200 rounded-2xl p-3">
                  <div className="text-[11px] font-bold text-stone-600 truncate">{ct.bn}</div>
                  <div className="text-lg font-black text-stone-900">
                    {toBengaliNumber(done)}
                    <span className="text-xs font-semibold text-stone-400"> / {toBengaliNumber(all.length)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-100 mt-1.5 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${all.length ? (done / all.length) * 100 : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </section>

          {/* List */}
          <section aria-labelledby="world-list-title" className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 id="world-list-title" className="text-sm font-bold text-stone-900 sm:mr-2">দেশের তালিকা</h2>
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" aria-hidden="true" />
                <input
                  type="search"
                  aria-label="দেশের নাম খুঁজুন"
                  placeholder="দেশের নাম খুঁজুন (যেমন: ভারত, Thailand)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
              {visitedCountries.size > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('ঘোরা সব দেশের চিহ্ন মুছে ফেলবেন?')) onClearCountries();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>সব মুছুন</span>
                </button>
              )}
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="মহাদেশ ফিল্টার">
              {[{ id: 'all', bn: 'সব' }, ...CONTINENTS].map((ct) => (
                <button
                  key={ct.id}
                  type="button"
                  aria-pressed={continent === ct.id}
                  onClick={() => setContinent(ct.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    continent === ct.id
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {ct.bn}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-stone-500">এই নামে কোনো দেশ পাওয়া যায়নি।</p>
            ) : (
              <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filtered.map((c) => {
                  const isVisited = visitedCountries.has(c.i);
                  return (
                    <li key={c.i}>
                      <button
                        type="button"
                        aria-pressed={isVisited}
                        onClick={() => onToggleCountry(c.i)}
                        className={`w-full min-h-12 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isVisited
                            ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400/30'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="min-w-0">
                          <strong className={`block text-sm font-bold truncate ${isVisited ? 'text-blue-900' : 'text-stone-800'}`}>{c.b}</strong>
                          <span className="block text-[11px] text-stone-500 truncate">{c.n}</span>
                        </span>
                        {isVisited ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-stone-300 shrink-0" aria-hidden="true" />
                        )}
                        <span className="sr-only">{isVisited ? 'ঘুরেছি' : 'ঘুরিনি'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};

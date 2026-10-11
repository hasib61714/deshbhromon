import React, { useEffect, useMemo, useState } from 'react';
import { Bus, Car, Navigation, Plane, Search, Ship, TrainFront } from 'lucide-react';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';
import { useLang } from '../i18n/LangContext';
import type { DistrictPlaceData, TransportMode } from '../types';

const MODES: { id: TransportMode; label: string; icon: React.ElementType }[] = [
  { id: 'bus', label: 'বাস', icon: Bus },
  { id: 'train', label: 'ট্রেন', icon: TrainFront },
  { id: 'launch', label: 'লঞ্চ / নৌপথ', icon: Ship },
  { id: 'air', label: 'বিমান', icon: Plane },
  { id: 'car', label: 'গাড়ি', icon: Car },
  { id: 'local', label: 'শহরের ভেতরে', icon: Navigation },
];

interface RoutesExplorerProps {
  onOpenDistrict: (districtId: string) => void;
}

// How to get to every district from Dhaka, with the fares written in the district guide data (approximate)
export const RoutesExplorer: React.FC<RoutesExplorerProps> = ({ onOpenDistrict }) => {
  const { lang, tr, n } = useLang();
  const [places, setPlaces] = useState<Record<string, DistrictPlaceData> | null>(null);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<TransportMode | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'near' | 'far'>('near');

  useEffect(() => {
    let live = true;
    fetch('/places.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => live && setPlaces(d))
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const rows = useMemo(() => {
    if (!places) return [];
    const term = q.trim().toLowerCase();
    return Object.entries(DISTRICT_DETAILS)
      .filter(([id, d]) => !term || id.toLowerCase().includes(term) || d.bn.includes(q.trim()))
      .map(([id, d]) => ({ id, bn: d.bn, p: places[id] }))
      .filter((r) => r.p?.go?.some(([m]) => mode === 'all' || m === mode))
      .sort((a, b) => ((a.p.km ?? 0) - (b.p.km ?? 0)) * (sort === 'near' ? 1 : -1));
  }, [places, mode, q, sort]);

  return (
    <div className="py-6 sm:py-8 space-y-6" data-routes>
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
          <Bus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{tr('ঢাকা থেকে যাওয়ার উপায়')}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">{tr('যাতায়াত ও ভাড়া')}</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
          {tr('কোন জেলায় বাস, ট্রেন, লঞ্চ বা বিমানে যাবেন আর ভাড়া আনুমানিক কত, এক জায়গায় দেখুন।')}
        </p>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={tr('যানবাহনের ধরন')}>
          {[{ id: 'all' as const, label: 'সব' }, ...MODES.filter((m) => m.id !== 'local')].map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 min-h-11 rounded-full text-sm font-bold border transition-colors cursor-pointer ${mode === m.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
            >
              {tr(m.label)}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label={tr('জেলার নাম খুঁজুন')}
              placeholder={tr('জেলার নাম খুঁজুন')}
              className="w-full pl-9 pr-3 py-2.5 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm"
            />
          </div>
          <label className="text-xs font-bold text-stone-600 flex items-center gap-2">
            {tr('সাজান:')}
            <select value={sort} onChange={(e) => setSort(e.target.value as 'near' | 'far')} className="px-3 py-2 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm">
              <option value="near">{tr('কাছের আগে')}</option>
              <option value="far">{tr('দূরের আগে')}</option>
            </select>
          </label>
        </div>
      </div>

      {failed ? (
        <p className="text-sm text-stone-600">{tr('তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।')}</p>
      ) : !places ? (
        <p className="text-sm text-stone-500" role="status">{tr('লোড হচ্ছে…')}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-stone-600" role="status">{tr('কিছু পাওয়া যায়নি')}</p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rows.map((r) => (
            <li key={r.id} data-route-card className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-extrabold text-stone-900">{lang === 'en' ? r.id : r.bn}</h2>
                <span className="text-xs font-semibold text-stone-500">
                  {r.p.km ? (lang === 'en' ? `about ${r.p.km} km` : `প্রায় ${n(r.p.km)} কিমি`) : tr('ঢাকা শহরেই')}
                  {r.p.time ? ` · ${r.p.time}` : ''}
                </span>
              </div>
              <ul className="space-y-2">
                {r.p.go!
                  .filter(([m]) => mode === 'all' || m === mode)
                  .map(([m, text], i) => {
                    const meta = MODES.find((x) => x.id === m) ?? MODES[0];
                    const Icon = meta.icon;
                    return (
                      <li key={i} className="flex gap-2.5 text-sm text-stone-700 leading-relaxed">
                        <Icon className="w-4 h-4 mt-1 shrink-0 text-emerald-700" aria-hidden="true" />
                        <span><strong className="text-stone-900">{tr(meta.label)}:</strong> {text}</span>
                      </li>
                    );
                  })}
              </ul>
              <button
                type="button"
                onClick={() => onOpenDistrict(r.id)}
                className="px-4 py-2 min-h-11 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                {tr('গাইড দেখুন')}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-stone-400 leading-relaxed">
        {tr('ভাড়া ও সময়সূচি আনুমানিক এবং বদলাতে পারে। যাওয়ার আগে পরিবহন সংস্থা বা স্টেশনে যাচাই করে নিন।')}
      </p>
    </div>
  );
};

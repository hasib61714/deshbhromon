import React, { useMemo, useState } from 'react';
import { Search, Shuffle } from 'lucide-react';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';
import { ICONIC_FOODS } from '../data/food-data';
import type { NavTabId } from './Navbar';

interface QuickFinderProps {
  visited: Set<string>;
  onOpenDistrict: (districtId: string) => void;
  onNavigate: (tab: NavTabId) => void;
}

const DISTRICTS = Object.entries(DISTRICT_DETAILS).map(([id, d]) => ({ id, bn: d.bn, dv: d.dvBn }));

// One search box for the whole site (districts and foods) plus a "surprise me" button
export const QuickFinder: React.FC<QuickFinderProps> = ({ visited, onOpenDistrict, onNavigate }) => {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (term.length < 1) return null;
    const districts = DISTRICTS.filter((d) => d.bn.toLowerCase().includes(term) || d.id.toLowerCase().includes(term)).slice(0, 5);
    const foods = ICONIC_FOODS.filter((f) => f.nameBn.toLowerCase().includes(term)).slice(0, 4);
    return { districts, foods };
  }, [term]);

  const surprise = () => {
    const pool = DISTRICTS.filter((d) => !visited.has(d.id));
    const list = pool.length ? pool : DISTRICTS;
    onOpenDistrict(list[Math.floor(Math.random() * list.length)].id);
  };

  return (
    <div className="max-w-xl space-y-2 pt-2">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="জেলা বা খাবার খুঁজুন"
          placeholder="জেলা বা খাবার খুঁজুন (যেমন: সিলেট, ইলিশ)"
          className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white text-stone-900 placeholder:text-stone-400 text-sm font-semibold border border-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        {results && (
          <div data-quick-results className="absolute z-20 left-0 right-0 mt-2 rounded-2xl bg-white text-stone-900 shadow-2xl border border-stone-200 overflow-hidden">
            {results.districts.length === 0 && results.foods.length === 0 ? (
              <p className="px-4 py-3 text-sm text-stone-500">কিছু পাওয়া যায়নি</p>
            ) : (
              <ul>
                {results.districts.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => { setQ(''); onOpenDistrict(d.id); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-bold">{d.bn}</span>
                      <span className="text-xs text-stone-500">জেলা · {d.dv}</span>
                    </button>
                  </li>
                ))}
                {results.foods.map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => { setQ(''); onNavigate('food'); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-bold">{f.nameBn}</span>
                      <span className="text-xs text-stone-500">খাবার</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={surprise}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/25 text-white text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer"
      >
        <Shuffle className="w-4 h-4" aria-hidden="true" />
        আমাকে একটা নতুন জেলা দেখাও
      </button>
    </div>
  );
};

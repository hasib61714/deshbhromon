import React, { Suspense, lazy, useState } from 'react';
import { NEW_GAMES } from './MoreGames';
import { useLang } from '../i18n/LangContext';

const TravelQuiz = lazy(() => import('./TravelQuiz').then((m) => ({ default: m.TravelQuiz })));

// One "খেলা" page: the original quiz & puzzles first, then the extra games and the leaderboard
export const GamesHub: React.FC = () => {
  const { tr } = useLang();
  const [active, setActive] = useState<string>('classic');
  const tabs = [{ id: 'classic', label: '🧠 কুইজ ও ধাঁধা' }, ...NEW_GAMES.map(({ id, label }) => ({ id, label }))];
  const current = NEW_GAMES.find((g) => g.id === active);
  return (
    <div>
      <div role="tablist" aria-label={tr('খেলার ধরন')} className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`shrink-0 px-4 py-2 min-h-11 rounded-full text-sm font-bold border transition-colors cursor-pointer ${active === t.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
          >
            {tr(t.label)}
          </button>
        ))}
      </div>
      {active === 'classic' ? (
        <Suspense fallback={<div role="status" className="py-10 text-center text-sm text-stone-500">{tr('লোড হচ্ছে…')}</div>}>
          <TravelQuiz />
        </Suspense>
      ) : (
        <div className="mt-4 bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs">{current?.node}</div>
      )}
    </div>
  );
};

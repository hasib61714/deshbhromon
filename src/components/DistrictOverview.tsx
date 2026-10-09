import { useLang } from '../i18n/LangContext';
import React from 'react';
import { Bus, Car, Coins, Hotel, Info, MapPin, Navigation, Plane, Ship, TrainFront, Utensils, Clock } from 'lucide-react';
import type { DistrictPlaceData, TransportMode } from '../types';

const MODES: Record<TransportMode, { label: string; icon: React.ElementType }> = {
  bus: { label: 'বাস', icon: Bus },
  train: { label: 'ট্রেন', icon: TrainFront },
  launch: { label: 'লঞ্চ / নৌপথ', icon: Ship },
  air: { label: 'বিমান', icon: Plane },
  car: { label: 'গাড়ি', icon: Car },
  local: { label: 'শহরের ভেতরে', icon: Navigation },
};

const Section: React.FC<{ icon: React.ElementType; title: string; tone: string; children: React.ReactNode }> = ({ icon: Icon, title, tone, children }) => (
  <section className="rounded-2xl border border-stone-200 bg-white p-4">
    <h3 className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${tone}`}>
        <Icon className="w-4 h-4" aria-hidden="true" />
      </span>
      {title}
    </h3>
    <div className="mt-2.5 text-sm text-stone-700 leading-relaxed">{children}</div>
  </section>
);

// Practical overview of a district built only from the dataset. Missing data is
// shown as missing instead of being filled with guesses.
export const DistrictOverview: React.FC<{ data: DistrictPlaceData }> = ({ data }) => {
  const { tr, n } = useLang();
  const hasDistance = typeof data.km === 'number' && data.km > 0;
  return (
    <div className="space-y-3">
      {data.intro && <p className="text-base text-stone-800 leading-relaxed font-medium">{data.intro}</p>}

      <div className="grid grid-cols-2 gap-2.5">
        {hasDistance && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {tr('ঢাকা থেকে (আনুমানিক)')}
            </span>
            <strong className="block text-lg font-black text-emerald-950 mt-1">{n(data.km as number)} {tr('কিমি')}</strong>
            {data.time && <span className="block text-xs text-emerald-900/80">{data.time}</span>}
          </div>
        )}
        {data.cost && (
          <div className={`rounded-2xl bg-amber-50 border border-amber-200 p-3 ${hasDistance ? '' : 'col-span-2'}`}>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
              <Coins className="w-3.5 h-3.5" aria-hidden="true" /> {tr('আনুমানিক খরচ')}
            </span>
            <strong className="block text-sm font-extrabold text-amber-950 mt-1 leading-snug">{data.cost}</strong>
          </div>
        )}
      </div>

      {data.go && data.go.length > 0 && (
        <Section icon={Car} title={data.go[0][0] === 'local' ? tr('শহরের ভেতরে চলাচল') : tr('ঢাকা থেকে যাওয়ার উপায়')} tone="bg-blue-50 text-blue-700">
          <ul className="space-y-2.5">
            {data.go.map(([mode, text], i) => {
              const m = MODES[mode] ?? MODES.bus;
              const Icon = m.icon;
              return (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="block text-xs text-stone-500 font-bold">{tr(m.label)}</strong>
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {data.food && (
          <Section icon={Utensils} title={tr('কী খাবেন')} tone="bg-amber-50 text-amber-700">
            {data.food}
          </Section>
        )}
        <Section icon={Hotel} title={tr('কোথায় থাকবেন')} tone="bg-indigo-50 text-indigo-700">
          {data.stay && data.stay.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {data.stay.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <span className="text-stone-500">{tr('এই জেলার জন্য থাকার তথ্য এখনো যোগ করা হয়নি। যাওয়ার আগে অনলাইনে বা স্থানীয়ভাবে খোঁজ নিন।')}</span>
          )}
        </Section>
      </div>

      {data.fam && data.fam.length > 0 && (
        <Section icon={Clock} title={tr('যে জিনিসের জন্য পরিচিত')} tone="bg-rose-50 text-rose-700">
          <ul className="flex flex-wrap gap-2">
            {data.fam.map(([emoji, name], i) => (
              <li key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800">
                <span aria-hidden="true">{emoji}</span>
                {name}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.nm && (
        <details className="rounded-2xl border border-stone-200 bg-stone-50 p-4 group">
          <summary className="cursor-pointer text-sm font-bold text-stone-800 flex items-center gap-2 list-none">
            <Info className="w-4 h-4 text-stone-500" aria-hidden="true" />
            {tr('নামের উৎস')}
          </summary>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed">{data.nm}</p>
        </details>
      )}
    </div>
  );
};

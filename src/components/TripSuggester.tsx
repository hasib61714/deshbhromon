import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DISTRICT_DETAILS, toBengaliNumber } from '../data/bangladesh-data';
import { useLang } from '../i18n/LangContext';
import { MONTHS_BN, suggestDistricts, type SuggestPlace } from '../lib/suggest';

interface TripSuggesterProps {
  visited: Set<string>;
  onOpenDistrict: (districtId: string) => void;
}

// "কোথায় যাবেন?": picks districts from the app's own place data by month and number of days
export const TripSuggester: React.FC<TripSuggesterProps> = ({ visited, onOpenDistrict }) => {
  const { lang, tr, n } = useLang();
  const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [month, setMonth] = useState<number>(() => new Date().getMonth());
  const [days, setDays] = useState<number>(2);
  const [hideVisited, setHideVisited] = useState(true);
  const [places, setPlaces] = useState<Record<string, SuggestPlace> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch('/places.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => live && setPlaces(d))
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const results = useMemo(
    () => (places ? suggestDistricts({ month, days, places, visited, hideVisited }) : []),
    [places, month, days, visited, hideVisited],
  );

  return (
    <section aria-labelledby="suggest-title" className="mt-12" data-trip-suggester>
      <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>{tr('কোথায় যাবেন, ঠিক করতে পারছেন না?')}</span>
        </div>
        <h2 id="suggest-title" className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">{tr('মাস আর দিন বলুন, জায়গা বেছে দিই')}</h2>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-xs font-bold text-stone-600">
            {tr('কোন মাসে যাবেন')}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="block mt-1 px-3 py-2 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900"
            >
              {MONTHS_BN.map((m, i) => (
                <option key={m} value={i}>{lang === 'en' ? MONTHS_EN[i] : m}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-stone-600">
            {tr('কত দিনের ট্রিপ')}
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="block mt-1 px-3 py-2 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900"
            >
              <option value={1}>{tr('১ দিন')}</option>
              <option value={2}>{tr('২ দিন')}</option>
              <option value={3}>{tr('৩ দিন বা বেশি')}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-stone-600 min-h-11">
            <input type="checkbox" checked={hideVisited} onChange={(e) => setHideVisited(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
            {tr('যে জেলায় গিয়েছি তা বাদ দিন')}
          </label>
        </div>

        {failed ? (
          <p className="mt-4 text-sm text-stone-600">{tr('তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।')}</p>
        ) : !places ? (
          <p className="mt-4 text-sm text-stone-500" role="status">{tr('লোড হচ্ছে…')}</p>
        ) : results.length === 0 ? (
          <p className="mt-4 text-sm text-stone-600" role="status">{tr('এই মাস ও দিনের জন্য কোনো মিল পাওয়া যায়নি। দিন বাড়িয়ে বা বাদ-দেওয়া টিক তুলে চেষ্টা করুন।')}</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-live="polite">
            {results.map((r) => (
              <li key={r.id} data-suggestion className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60 flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-extrabold text-stone-900">{lang === 'en' ? r.id : DISTRICT_DETAILS[r.id]?.bn ?? r.id}</h3>
                  <span className="text-[11px] text-stone-500">{r.km > 0 ? (lang === 'en' ? `about ${r.km} km from Dhaka` : `ঢাকা থেকে প্রায় ${toBengaliNumber(r.km)} কিমি`) : tr('ঢাকা শহরেই')}</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1">
                  {r.spots.map((s) => (
                    <li key={s.n}>
                      <span className="font-bold">{s.n}</span>
                      <span className="text-stone-500"> — {s.seasonal ? tr('এই সময়েই সবচেয়ে ভালো') : tr('সারা বছর ঘোরা যায়')}</span>
                    </li>
                  ))}
                </ul>
                {r.time && <p className="text-[11px] text-stone-500">{tr('যেতে লাগে:')} {r.time}</p>}
                {r.cost && <p className="text-[11px] text-stone-500">{tr('খরচ:')} {r.cost}</p>}
                <button
                  type="button"
                  onClick={() => onOpenDistrict(r.id)}
                  className="mt-auto inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  {tr('গাইড দেখুন')} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-[11px] text-stone-400 leading-relaxed">
          {tr('সব তথ্য এই সাইটের নিজস্ব জেলা-গাইড থেকে। দূরত্ব ঢাকা থেকে আনুমানিক; ১ দিনের ট্রিপে ১৫০ কিমি ও ২ দিনের ট্রিপে ৩০০ কিমির মধ্যের জেলা ধরা হয়েছে। যাওয়ার আগে আবহাওয়া ও যাতায়াতের অবস্থা দেখে নিন।')}
        </p>
      </div>
    </section>
  );
};

import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { DISTRICT_DETAILS, getTravelerBadge, toBengaliNumber } from '../data/bangladesh-data';
import { readChallenge } from '../lib/challenge';
import type { NavTabId } from './Navbar';
import { useLang } from '../i18n/LangContext';

const ORDERED_IDS = Object.keys(DISTRICT_DETAILS).sort();

interface ChallengeBannerProps {
  visited: Set<string>;
  onNavigate: (tab: NavTabId) => void;
}

// Shown when someone opens a friend's challenge link (?c=...): compares the friend's map with the visitor's own
export const ChallengeBanner: React.FC<ChallengeBannerProps> = ({ visited, onNavigate }) => {
  const { lang, tr, n } = useLang();
  const ch = useMemo(() => readChallenge(window.location.search, ORDERED_IDS), []);
  if (!ch) return null;

  const theirs = ch.visited.size;
  const mine = visited.size;
  const badge = getTravelerBadge(theirs);
  const only = ORDERED_IDS.filter((id) => ch.visited.has(id) && !visited.has(id));
  const name = ch.name || tr('আপনার বন্ধু');
  const verdict = lang === 'en'
    ? (mine > theirs ? 'You are ahead!' : mine === theirs ? 'All square!' : `You are ${theirs - mine} districts behind.`)
    : (mine > theirs ? 'আপনি এগিয়ে!' : mine === theirs ? 'সমান সমান!' : `${toBengaliNumber(theirs - mine)}টি জেলা পিছিয়ে।`);

  return (
    <section aria-label={tr('বন্ধুর চ্যালেঞ্জ')} data-challenge className="mt-6">
      <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 to-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
          <Trophy className="w-4 h-4" aria-hidden="true" />
          <span>{tr('বন্ধুর চ্যালেঞ্জ')}</span>
        </div>
        <h2 className="mt-1 text-lg font-extrabold text-stone-900">
          {lang === 'en' ? `${name} has visited ${theirs}/64 districts` : `${name} ${toBengaliNumber(theirs)}/৬৪ জেলা ঘুরেছেন`} {badge.emoji} <span className="text-stone-500 font-semibold">({badge.title})</span>
        </h2>
        <p className="text-sm text-stone-700 mt-1">
          {lang === 'en' ? `So far you have marked ${mine} districts.` : `আপনি এখন পর্যন্ত ${toBengaliNumber(mine)}টি জেলা চিহ্নিত করেছেন।`} {verdict}
        </p>
        {only.length > 0 && (
          <p className="text-xs text-stone-600 mt-2">
            {lang === 'en' ? `${name} has been to, but you have not yet:` : `${name} গেছেন কিন্তু আপনি এখনও যাননি:`} {only.slice(0, 8).map((id) => (lang === 'en' ? id : DISTRICT_DETAILS[id].bn)).join(', ')}
            {only.length > 8 && (lang === 'en' ? ` and ${only.length - 8} more` : ` ও আরও ${toBengaliNumber(only.length - 8)}টি`)}
          </p>
        )}
        <button
          type="button"
          onClick={() => onNavigate('map')}
          className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
        >
          {tr('আমার ম্যাপ বানাই')}
        </button>
      </div>
    </section>
  );
};

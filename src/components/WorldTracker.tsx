import React, { useState, useEffect } from 'react';
import { toBengaliNumber } from '../data/bangladesh-data';
import { Globe, Search, CheckCircle2, Trash2 } from 'lucide-react';

interface WorldTrackerProps {
  visitedCountries: Set<string>;
  onToggleCountry: (country: string) => void;
  onClearCountries: () => void;
}

const POPULAR_COUNTRIES = [
  { id: 'BD', nameBn: 'বাংলাদেশ', nameEn: 'Bangladesh', continent: 'এশিয়া', flag: '🇧🇩' },
  { id: 'IN', nameBn: 'ভারত', nameEn: 'India', continent: 'এশিয়া', flag: '🇮🇳' },
  { id: 'NP', nameBn: 'নেপাল', nameEn: 'Nepal', continent: 'এশিয়া', flag: '🇳🇵' },
  { id: 'BT', nameBn: 'ভুটান', nameEn: 'Bhutan', continent: 'এশিয়া', flag: '🇧🇹' },
  { id: 'TH', nameBn: 'থাইল্যান্ড', nameEn: 'Thailand', continent: 'এশিয়া', flag: '🇹🇭' },
  { id: 'MY', nameBn: 'মালয়েশিয়া', nameEn: 'Malaysia', continent: 'এশিয়া', flag: '🇲🇾' },
  { id: 'SG', nameBn: 'সিঙ্গাপুর', nameEn: 'Singapore', continent: 'এশিয়া', flag: '🇸🇬' },
  { id: 'ID', nameBn: 'ইন্দোনেশিয়া', nameEn: 'Indonesia', continent: 'এশিয়া', flag: '🇮🇩' },
  { id: 'SA', nameBn: 'সৌদি আরব', nameEn: 'Saudi Arabia', continent: 'মধ্যপ্রাচ্য', flag: '🇸🇦' },
  { id: 'AE', nameBn: 'সংযুক্ত আরব আমিরাত (দুবাই)', nameEn: 'UAE', continent: 'মধ্যপ্রাচ্য', flag: '🇦🇪' },
  { id: 'TR', nameBn: 'তুরস্ক', nameEn: 'Turkey', continent: 'ইউরেশিয়া', flag: '🇹🇷' },
  { id: 'MV', nameBn: 'মালদ্বীপ', nameEn: 'Maldives', continent: 'এশিয়া', flag: '🇲🇻' },
  { id: 'LK', nameBn: 'শ্রীলঙ্কা', nameEn: 'Sri Lanka', continent: 'এশিয়া', flag: '🇱🇰' },
  { id: 'QA', nameBn: 'কাতার', nameEn: 'Qatar', continent: 'মধ্যপ্রাচ্য', flag: '🇶🇦' },
  { id: 'GB', nameBn: 'যুক্তরাজ্য (লন্ডন)', nameEn: 'United Kingdom', continent: 'ইউরোপ', flag: '🇬🇧' },
  { id: 'US', nameBn: 'যুক্তরাষ্ট্র (আমেরিকা)', nameEn: 'United States', continent: 'আমেরিকা', flag: '🇺🇸' },
  { id: 'CA', nameBn: 'কানাডা', nameEn: 'Canada', continent: 'আমেরিকা', flag: '🇨🇦' },
  { id: 'AU', nameBn: 'অস্ট্রেলিয়া', nameEn: 'Australia', continent: 'ওশেনিয়া', flag: '🇦🇺' },
  { id: 'JP', nameBn: 'জাপান', nameEn: 'Japan', continent: 'এশিয়া', flag: '🇯🇵' },
  { id: 'DE', nameBn: 'জার্মানি', nameEn: 'Germany', continent: 'ইউরোপ', flag: '🇩🇪' },
  { id: 'FR', nameBn: 'ফ্রান্স', nameEn: 'France', continent: 'ইউরোপ', flag: '🇫🇷' },
  { id: 'IT', nameBn: 'ইতালি', nameEn: 'Italy', continent: 'ইউরোপ', flag: '🇮🇹' },
  { id: 'CH', nameBn: 'সুইজারল্যান্ড', nameEn: 'Switzerland', continent: 'ইউরোপ', flag: '🇨🇭' },
  { id: 'EG', nameBn: 'মিশর', nameEn: 'Egypt', continent: 'আফ্রিকা', flag: '🇪🇬' },
];

export const WorldTracker: React.FC<WorldTrackerProps> = ({
  visitedCountries,
  onToggleCountry,
  onClearCountries,
}) => {
  const [search, setSearch] = useState<string>('');

  const filtered = POPULAR_COUNTRIES.filter(
    (c) =>
      c.nameBn.includes(search) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.continent.includes(search)
  );

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Hero Header with authentic World Poster */}
      <div className="relative text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden bg-slate-950">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              বিশ্ব ভ্রমণ মানচিত্র (World Travel Tracker)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              বাংলাদেশের পাশাপাশি বিশ্বের অন্যান্য যে দেশগুলোতে গিয়েছেন সেগুলো চিহ্নিত করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl shrink-0 shadow-inner">
            <div className="text-center">
              <span className="block text-[10px] text-blue-200 font-bold uppercase tracking-wider">ঘোরা দেশ</span>
              <strong className="text-2xl font-black text-white">
                {toBengaliNumber(visitedCountries.size)}
              </strong>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="দেশের নাম খুঁজুন (যেমন: ভারত, থাইল্যান্ড, যুক্তরাজ্য)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
          </div>

          {visitedCountries.size > 0 && (
            <button
              type="button"
              onClick={onClearCountries}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>সব মুছুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map((country) => {
          const isVisited = visitedCountries.has(country.id);
          return (
            <div
              key={country.id}
              onClick={() => onToggleCountry(country.id)}
              className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-between gap-2 ${
                isVisited
                  ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span className="text-3xl select-none">{country.flag}</span>
              <div>
                <strong className={`block text-xs font-bold ${isVisited ? 'text-blue-900' : 'text-stone-800'}`}>
                  {country.nameBn}
                </strong>
                <span className="text-[10px] text-stone-400 block">{country.nameEn}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isVisited
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {isVisited ? '✓ ঘুরেছি' : 'ঘুরিনি'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

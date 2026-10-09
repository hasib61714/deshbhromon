import React from 'react';
import { useLang } from '../i18n/LangContext';
import { Languages, Gem,
  Map,
  Compass,
  Route,
  Trophy,
  Globe,
  Utensils,
  BookOpen,
  LifeBuoy,
  PhoneCall,
  Home
} from 'lucide-react';

export type NavTabId = 'home' | 'map' | 'guide' | 'food' | 'diary' | 'plan' | 'quiz' | 'safety' | 'world' | 'gems';

interface NavbarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  onOpenEmergency?: () => void;
  visitedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  visitedCount,
}) => {
  const { lang, setLang, tr, n } = useLang();
  const tabs = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'guide', label: 'জেলা গাইড', icon: Compass },
    { id: 'map', label: 'আমার ম্যাপ', icon: Map },
    { id: 'plan', label: 'ট্রিপ প্ল্যানার', icon: Route },
    { id: 'diary', label: 'ভ্রমণ ডায়েরি', icon: BookOpen },
    { id: 'food', label: 'ফুড ট্র্যাকার', icon: Utensils },
    { id: 'safety', label: 'ঋতু ও নিরাপত্তা', icon: LifeBuoy },
    { id: 'quiz', label: 'কুইজ খেলা', icon: Trophy },
    { id: 'world', label: 'বিশ্ব ভ্রমণ', icon: Globe },
    { id: 'gems', label: 'আমার এলাকা', icon: Gem },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              aria-label={tr('দেশভ্রমণ হোম')}
              className="flex items-center gap-2.5 cursor-pointer group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Map className="w-5 h-5 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-stone-900">
                    {lang === 'en' ? 'DeshBhromon' : 'দেশভ্রমণ'}
                  </span>
                  <span className={`${lang === 'en' ? 'hidden' : ''} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200`}>
                    DeshBhromon
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-medium hidden md:inline">
                  {tr('বাংলাদেশ ভ্রমণ মানচিত্র ও ৬৪ জেলা গাইড')}
                </span>
              </div>
            </button>

          </div>

          {/* Desktop Navigation Tabs */}
          <nav aria-label={tr('প্রধান মেনু')} className="hidden 2xl:flex items-center gap-0.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.id as NavTabId)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{tr(tab.label)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {onOpenEmergency && (
              <button
                type="button"
                onClick={onOpenEmergency}
                title={tr('জরুরি ভ্রমণ হেল্পলাইন (ট্যুরিস্ট পুলিশ, ৯৯৯, ফায়ার সার্ভিস)')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 min-h-10 min-w-10 justify-center rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="hidden sm:inline">{tr('জরুরি হেল্পলাইন')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              aria-label={tr('ভাষা বদলান')}
              data-lang-toggle
              className="flex items-center gap-1.5 px-3 py-2 min-h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="whitespace-nowrap">{lang === 'en' ? 'Visited' : 'ঘুরেছি'}: <strong className="font-bold text-sm text-emerald-700">{n(visitedCount)}</strong> / {n(64)}</span>
            </div>

          </div>
        </div>

        {/* Mobile & Tablet Submenu Navigation */}
        <nav aria-label={tr('প্রধান মেনু (ছোট স্ক্রিন)')} className="flex 2xl:hidden overflow-x-auto py-2 gap-1 border-t border-stone-100 no-scrollbar lg:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id as NavTabId)}
                className={`flex items-center gap-1 px-3 py-2.5 min-h-10 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tr(tab.label)}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

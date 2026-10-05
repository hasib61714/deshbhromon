import React from 'react';
import { toBengaliNumber } from '../data/bangladesh-data';
import {
  Map,
  Compass,
  Route,
  Trophy,
  Globe,
  User,
  Sparkles,
  Utensils,
  BookOpen,
  LifeBuoy,
  PhoneCall,
  Siren,
  Home
} from 'lucide-react';

export type NavTabId = 'home' | 'map' | 'guide' | 'food' | 'diary' | 'plan' | 'quiz' | 'safety' | 'world';

interface NavbarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  onOpenAbout: () => void;
  onOpenEmergency?: () => void;
  visitedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAbout,
  onOpenEmergency,
  visitedCount,
}) => {
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
              aria-label="দেশভ্রমণ হোম"
              className="flex items-center gap-2.5 cursor-pointer group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Map className="w-5 h-5 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-stone-900">
                    দেশভ্রমণ
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    DeshBhromon
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-medium hidden md:inline">
                  বাংলাদেশ ভ্রমণ মানচিত্র ও ৬৪ জেলা গাইড
                </span>
              </div>
            </button>

            <button
              onClick={onOpenAbout}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-stone-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Created by মোঃ হাসিবুল হাসান</span>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav aria-label="প্রধান মেনু" className="hidden 2xl:flex items-center gap-0.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.id as NavTabId)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
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
                title="জরুরি ভ্রমণ হেল্পলাইন (ট্যুরিস্ট পুলিশ, ৯৯৯, ফায়ার সার্ভিস)"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="hidden sm:inline">জরুরি হেল্পলাইন</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="whitespace-nowrap">ঘুরেছি: <strong className="font-bold text-sm text-emerald-700">{toBengaliNumber(visitedCount)}</strong> / ৬৪</span>
            </div>

            <button
              onClick={onOpenAbout}
              title="ডেভেলপার প্রোফাইল ও পরিচিতি (মোঃ হাসিবুল হাসান)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-950 text-xs font-bold transition-all shadow-xs hover:scale-105 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                MH
              </div>
              <span className="hidden xl:inline font-bold">মোঃ হাসিবুল হাসান</span>
              <span className="hidden 2xl:inline text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                DEV
              </span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Submenu Navigation */}
        <nav aria-label="প্রধান মেনু (ছোট স্ক্রিন)" className="flex 2xl:hidden overflow-x-auto py-2 gap-1 border-t border-stone-100 no-scrollbar lg:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id as NavTabId)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

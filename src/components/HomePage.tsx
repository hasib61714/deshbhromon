import { SafeImage } from './SafeImage';
import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe,
  LifeBuoy,
  Map as MapIcon,
  PhoneCall,
  Route,
  Trophy,
  Utensils,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { DISTRICT_DETAILS, DIVISIONS, toBengaliNumber } from '../data/bangladesh-data';
import { getDistrictImage } from '../data/landmark-images';
import { ICONIC_FOODS } from '../data/food-data';
import { QUIZ_QUESTIONS } from '../data/quiz-questions';
import type { NavTabId } from './Navbar';
import { QuickFinder } from './QuickFinder';

interface HomePageProps {
  visited: Set<string>;
  wishlist: Set<string>;
  onNavigate: (tab: NavTabId) => void;
  onOpenDivision: (divisionId: string) => void;
  onOpenDistrict: (districtId: string) => void;
  onOpenEmergency: () => void;
  onOpenAbout: () => void;
}

type MapData = typeof import('../data/map-data').DATA;

// Real photographs for the homepage mosaic: well-known landmarks with credited Wikimedia Commons images
const SHOWCASE: { id: string; place: string; span: string }[] = [
  { id: "Cox's Bazar", place: 'কক্সবাজার সমুদ্র সৈকত', span: 'sm:col-span-2 sm:row-span-2' },
  { id: 'Bagerhat', place: 'ষাট গম্বুজ মসজিদ', span: '' },
  { id: 'Rangamati', place: 'কাপ্তাই লেক', span: '' },
  { id: 'Sylhet', place: 'রাতারগুল জলাবন', span: 'sm:row-span-2' },
  { id: 'Bandarban', place: 'নীলগিরি', span: '' },
  { id: 'Sunamganj', place: 'টাঙ্গুয়ার হাওর', span: '' },
  { id: 'Naogaon', place: 'পাহাড়পুর বৌদ্ধ বিহার', span: '' },
  { id: 'Panchagarh', place: 'তেঁতুলিয়া থেকে কাঞ্চনজঙ্ঘা', span: 'sm:col-span-2' },
];

const FEATURED = ["Cox's Bazar", 'Sylhet', 'Bandarban', 'Bagerhat', 'Panchagarh', 'Sunamganj'];

const FEATURES: { tab: NavTabId; title: string; text: string; icon: React.ElementType; stage: string }[] = [
  { tab: 'guide', title: 'জেলা গাইড', text: '৬৪ জেলার দর্শনীয় স্থান, যাতায়াত, খরচ ও খাবার।', icon: Compass, stage: 'আবিষ্কার' },
  { tab: 'map', title: 'আমার ম্যাপ', text: 'ঘোরা ও যেতে চাওয়া জেলা চিহ্নিত করে ম্যাপ ডাউনলোড করুন।', icon: MapIcon, stage: 'ট্র্যাক' },
  { tab: 'plan', title: 'ট্রিপ প্ল্যানার', text: 'দিন, সঙ্গী ও বাজেট ধরে ভ্রমণের আনুমানিক খরচ ও চেকলিস্ট।', icon: Route, stage: 'পরিকল্পনা' },
  { tab: 'diary', title: 'ভ্রমণ ডায়েরি', text: 'প্রতিটি ভ্রমণের স্মৃতি, রেটিং ও নোট লিখে রাখুন।', icon: BookOpen, stage: 'স্মরণ' },
  { tab: 'food', title: 'ফুড ট্র্যাকার', text: 'জেলার নামকরা খাবার খুঁজুন, যেগুলো চেখেছেন সেগুলো চিহ্নিত করুন।', icon: Utensils, stage: 'আবিষ্কার' },
  { tab: 'safety', title: 'ঋতু ও নিরাপত্তা', text: 'কোন ঋতুতে কোথায় যাবেন এবং ভ্রমণে সতর্কতা।', icon: LifeBuoy, stage: 'পরিকল্পনা' },
  { tab: 'quiz', title: 'কুইজ ও ধাঁধা', text: 'বাংলাদেশের জেলা ও স্থান নিয়ে কুইজ, ছবি-ধাঁধা ও বর্ণ সাজানো।', icon: Trophy, stage: 'খেলা' },
  { tab: 'world', title: 'বিশ্ব ভ্রমণ', text: 'বিশ্বের ১৯৫টি দেশের মানচিত্রে ঘোরা দেশ চিহ্নিত করুন।', icon: Globe, stage: 'ট্র্যাক' },
];

export const HomePage: React.FC<HomePageProps> = ({
  visited,
  wishlist,
  onNavigate,
  onOpenDivision,
  onOpenDistrict,
  onOpenEmergency,
  onOpenAbout,
}) => {
  const [mapData, setMapData] = useState<MapData | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('../data/map-data').then(({ DATA }) => {
      if (!cancelled) setMapData(DATA);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = Object.keys(DISTRICT_DETAILS).length;
  const percent = Math.round((visited.size / total) * 100);

  return (
    <div className="pb-4">
      {/* ===== Hero ===== */}
      <section
        aria-labelledby="home-title"
        className="relative -mx-4 sm:mx-0 sm:mt-6 sm:rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white"
      >
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_20%_20%,#fff_0,transparent_45%)]" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10 items-center px-5 sm:px-10 py-10 sm:py-14 lg:py-16">
          <div className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-emerald-100">
              <span aria-hidden="true">🇧🇩</span>
              <span>বাংলাদেশ ভ্রমণ সঙ্গী · DeshBhromon</span>
            </div>
            <h1 id="home-title" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              দেশভ্রমণ
            </h1>
            <p className="text-lg sm:text-xl text-emerald-50 leading-relaxed max-w-xl font-medium">
              বাংলাদেশের প্রতিটি জেলা, প্রতিটি গল্প, প্রতিটি ভ্রমণ — এক জায়গায়।
            </p>
            <p className="text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              কোথায় যাবেন, কী দেখবেন, কী খাবেন আর কত খরচ হবে জেনে নিন। তারপর ভ্রমণ সাজান, ঘুরে এসে স্মৃতি রাখুন, আর নিজের ভ্রমণ ম্যাপ বানান।
            </p>
            <div className="flex flex-col min-[420px]:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('guide')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 text-emerald-950 font-extrabold text-base hover:bg-amber-300 transition-colors shadow-lg shadow-black/20 cursor-pointer"
              >
                ভ্রমণ শুরু করুন
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/30 text-white font-bold text-base hover:bg-white/20 transition-colors cursor-pointer"
              >
                <MapIcon className="w-5 h-5" aria-hidden="true" />
                আমার ভ্রমণ ম্যাপ
              </button>
            </div>
            <QuickFinder visited={visited} onOpenDistrict={onOpenDistrict} onNavigate={onNavigate} />

            <dl className="grid grid-cols-3 gap-3 pt-3 max-w-md">
              {[
                [toBengaliNumber(total), 'জেলা'],
                [toBengaliNumber(DIVISIONS.length), 'বিভাগ'],
                [toBengaliNumber(ICONIC_FOODS.length), 'নামকরা খাবার'],
              ].map(([n, label]) => (
                <div key={label} className="rounded-2xl bg-white/10 border border-white/15 px-3 py-2.5">
                  <dd className="text-2xl font-black text-white leading-none">{n}</dd>
                  <dt className="text-[11px] text-emerald-200 mt-1">{label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Real Bangladesh map: the traveller's visited districts light up */}
          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[420px]">
            <div className="aspect-[600/828] w-full">
              {mapData ? (
                <svg
                  viewBox={`0 0 ${mapData.w} ${mapData.h}`}
                  className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  role="img"
                  aria-label={`বাংলাদেশের মানচিত্র, ${toBengaliNumber(visited.size)}টি জেলা চিহ্নিত`}
                >
                  {mapData.f.map((f) => {
                    const isVisited = visited.has(f.n);
                    const isWish = wishlist.has(f.n);
                    return (
                      <path
                        key={f.n}
                        d={f.d}
                        fill={isVisited ? '#fbbf24' : isWish ? '#6ee7b7' : 'rgba(255,255,255,0.16)'}
                        stroke="rgba(6,78,59,0.9)"
                        strokeWidth={0.8}
                        className="cursor-pointer transition-colors hover:fill-white/50"
                        onClick={() => onOpenDistrict(f.n)}
                      >
                        <title>{DISTRICT_DETAILS[f.n]?.bn ?? f.n}</title>
                      </path>
                    );
                  })}
                  {/* Saint Martin's Island belongs to Cox's Bazar district (approximate position, not to scale) */}
                  <g className="cursor-pointer" onClick={() => onOpenDistrict("Cox's Bazar")}>
                    <title>সেন্ট মার্টিন দ্বীপ (কক্সবাজার)</title>
                    <line x1="530" y1="809" x2="551" y2="822" stroke="rgba(255,255,255,0.7)" strokeWidth={1} strokeDasharray="2 2" />
                    <circle cx="524" cy="806" r="7" fill={visited.has("Cox's Bazar") ? '#fbbf24' : 'rgba(255,255,255,0.9)'} stroke="rgba(6,78,59,0.9)" strokeWidth={1.5} />
                    <text x="513" y="806" textAnchor="end" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#ecfdf5">সেন্ট মার্টিন</text>
                  </g>
                </svg>
              ) : (
                <div className="w-full h-full rounded-3xl bg-white/5 animate-pulse" aria-hidden="true" />
              )}
            </div>
            <p className="text-center text-xs text-emerald-200 mt-2">
              {visited.size > 0 ? (
                <>
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400 mr-1 align-middle" aria-hidden="true" />
                  আপনার ঘোরা জেলা · জেলায় ট্যাপ করলে গাইড খুলবে
                </>
              ) : (
                'কোনো জেলায় ট্যাপ করে তার গাইড দেখুন'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Personal progress (real data only) ===== */}
      <section aria-label="আপনার অগ্রগতি" className="mt-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 shadow-xs">
          <div className="flex-1 min-w-0">
            {visited.size === 0 ? (
              <>
                <h2 className="font-extrabold text-stone-900 text-base">আপনার ভ্রমণ এখানেই শুরু</h2>
                <p className="text-sm text-stone-600 mt-1">
                  কোন জেলাগুলোতে গিয়েছেন মানচিত্রে চিহ্নিত করুন। ৬৪টি জেলার মধ্যে কতটা ঘুরেছেন, এখানে দেখতে পাবেন।
                </p>
              </>
            ) : (
              <>
                <h2 className="font-extrabold text-stone-900 text-base">
                  আপনি {toBengaliNumber(visited.size)}/{toBengaliNumber(total)} জেলা ঘুরেছেন
                  {wishlist.size > 0 && <span className="text-stone-500 font-semibold"> · যেতে চান {toBengaliNumber(wishlist.size)}টি</span>}
                </h2>
                <div
                  className="h-2.5 rounded-full bg-stone-100 mt-3 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={visited.size}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-label="ঘোরা জেলার অগ্রগতি"
                >
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-amber-400" style={{ width: `${percent}%` }} />
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors cursor-pointer shrink-0"
          >
            {visited.size === 0 ? 'ম্যাপে চিহ্নিত করুন' : 'ম্যাপে দেখুন'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ===== Photo showcase ===== */}
      <section aria-labelledby="photo-title" className="mt-12">
        <SectionHead id="photo-title" kicker="বাংলাদেশের রূপ" title="সমুদ্র, পাহাড়, হাওর আর ইতিহাস" text="কয়েকটি পরিচিত স্থানের আসল ছবি। ছবিতে ট্যাপ করলে সেই জেলার গাইড খুলবে।" />
        <ul className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[9rem] sm:auto-rows-[11rem] gap-3">
          {SHOWCASE.map((t) => {
            const img = getDistrictImage(t.id);
            return (
              <li key={t.id} className={`${t.span} min-h-0`}>
                <button
                  type="button"
                  onClick={() => onOpenDistrict(t.id)}
                  className="group relative block w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-emerald-900 text-left cursor-pointer"
                >
                  <SafeImage
                    src={img.url}
                    alt={`${t.place}, ${DISTRICT_DETAILS[t.id].bn}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
                  <span className="absolute left-3 right-3 bottom-2.5 text-white">
                    <strong className="block text-sm sm:text-base font-extrabold leading-snug">{t.place}</strong>
                    <span className="block text-[11px] text-white/80">{DISTRICT_DETAILS[t.id].bn}</span>
                    {img.credit && <span className="hidden sm:block text-[9px] text-white/55 truncate mt-0.5">{img.credit}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-[11px] text-stone-500">ছবি: উইকিমিডিয়া কমন্সের আলোকচিত্রীরা (CC লাইসেন্স)। প্রতিটি ছবির কৃতজ্ঞতা জেলা গাইডে দেওয়া আছে।</p>
      </section>

      {/* ===== Divisions ===== */}
      <section aria-labelledby="div-title" className="mt-12">
        <SectionHead id="div-title" kicker="আবিষ্কার" title="আট বিভাগে বাংলাদেশ" text="একটি বিভাগ বেছে নিন, সেই বিভাগের সব জেলার গাইড দেখুন।" />
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DIVISIONS.map((dv) => {
            const list = Object.values(DISTRICT_DETAILS).filter((d) => d.dv === dv.id);
            const done = Object.entries(DISTRICT_DETAILS).filter(([id, d]) => d.dv === dv.id && visited.has(id)).length;
            return (
              <li key={dv.id}>
                <button
                  type="button"
                  onClick={() => onOpenDivision(dv.id)}
                  className="group w-full h-full text-left bg-white border border-stone-200 rounded-2xl p-4 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="block w-8 h-1.5 rounded-full mb-3" style={{ background: dv.color }} aria-hidden="true" />
                  <strong className="block text-base font-extrabold text-stone-900">{dv.bn}</strong>
                  <span className="block text-xs text-stone-500 mt-0.5">
                    {toBengaliNumber(list.length)}টি জেলা{done > 0 && ` · ${toBengaliNumber(done)}টি ঘোরা`}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:gap-2 transition-all">
                    জেলাগুলো দেখুন <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ===== Featured destinations ===== */}
      <section aria-labelledby="feat-title" className="mt-12">
        <SectionHead id="feat-title" kicker="যেখানে যাওয়া যায়" title="জনপ্রিয় গন্তব্য" text="সমুদ্র, পাহাড়, হাওর আর ইতিহাস। কয়েকটি পরিচিত জেলা দিয়ে শুরু করুন।" />
        <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED.map((id) => {
            const info = DISTRICT_DETAILS[id];
            const img = getDistrictImage(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onOpenDistrict(id)}
                  className="group relative block w-full h-52 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 to-teal-900 text-left cursor-pointer focus-visible:outline-offset-4"
                >
                  <SafeImage
                    src={img.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
                  <span className="absolute left-4 right-4 bottom-4 text-white">
                    <strong className="block text-xl font-extrabold">{info.bn}</strong>
                    <span className="block text-xs text-white/85 line-clamp-1">{info.fam}</span>
                    {img.credit && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/60">
                        <Camera className="w-3 h-3" aria-hidden="true" />
                        <span className="truncate">{img.credit}</span>
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ===== Journey ===== */}
      <section aria-labelledby="journey-title" className="mt-12">
        <SectionHead id="journey-title" kicker="একটি ভ্রমণের পুরো পথ" title="জানা থেকে স্মরণ পর্যন্ত" text="গন্তব্য খুঁজুন, ভ্রমণ সাজান, ঘুরে আসুন, তারপর স্মৃতি জমিয়ে রাখুন।" />
        <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.tab}>
                <button
                  type="button"
                  onClick={() => onNavigate(f.tab)}
                  className="group w-full h-full text-left bg-white border border-stone-200 rounded-2xl p-4 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 rounded-full px-2 py-0.5">{f.stage}</span>
                  </span>
                  <strong className="block mt-3 text-sm font-extrabold text-stone-900">{f.title}</strong>
                  <span className="block mt-1 text-xs text-stone-600 leading-relaxed">{f.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-stone-500">
          কুইজে {toBengaliNumber(QUIZ_QUESTIONS.length)}টি প্রশ্ন আছে। আপনার সব তথ্য শুধু এই ডিভাইসের ব্রাউজারে থাকে, কোনো অ্যাকাউন্ট লাগে না।
        </p>
      </section>

      {/* ===== Safety ===== */}
      <section aria-labelledby="safe-title" className="mt-12">
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 id="safe-title" className="font-extrabold text-rose-950">ভ্রমণে নিরাপদ থাকুন</h2>
            <p className="text-sm text-rose-900/80 mt-1">জরুরি নম্বর ৯৯৯। ট্যুরিস্ট পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের নম্বর এক জায়গায় রাখা আছে।</p>
          </div>
          <button
            type="button"
            onClick={onOpenEmergency}
            className="px-5 py-3 rounded-2xl bg-rose-700 text-white font-bold text-sm hover:bg-rose-800 transition-colors cursor-pointer"
          >
            জরুরি নম্বর দেখুন
          </button>
        </div>
      </section>

      {/* ===== About the project and its creator ===== */}
      <section aria-labelledby="about-title" className="mt-12">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7">
            <span className="text-xs font-bold text-emerald-700">প্রকল্প পরিচিতি</span>
            <h2 id="about-title" className="text-2xl font-extrabold text-stone-900 tracking-tight mt-0.5">দেশভ্রমণ সম্পর্কে</h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">
              দেশভ্রমণ বাংলাদেশ ঘোরার একটি বিনামূল্যের সঙ্গী। এখানে অ্যাকাউন্ট বা বিজ্ঞাপন নেই, আর আপনার ভ্রমণের তথ্য শুধু আপনার ব্রাউজারেই থাকে।
            </p>
            <ul className="mt-4 space-y-2 text-sm text-stone-700">
              <li className="flex gap-2"><span className="text-emerald-600" aria-hidden="true">●</span>খরচ, দূরত্ব ও সময় আনুমানিক। যাওয়ার আগে নিজে যাচাই করে নিন।</li>
              <li className="flex gap-2"><span className="text-emerald-600" aria-hidden="true">●</span>ছবিগুলো উইকিমিডিয়া কমন্স থেকে, আলোকচিত্রীর নাম ও লাইসেন্সসহ।</li>
              <li className="flex gap-2"><span className="text-emerald-600" aria-hidden="true">●</span>ভুল তথ্য চোখে পড়লে নির্মাতাকে জানাতে পারেন।</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">Designed &amp; developed by</span>
            <div className="flex items-center gap-3 mt-3">
              <span className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center font-black text-lg" aria-hidden="true">MH</span>
              <div>
                <strong className="block text-lg font-extrabold leading-tight">Md. Hasibul Hasan</strong>
                <span className="text-xs text-emerald-200">Software Engineer</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://hasibul-hasan-portfolio-main.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-950 text-sm font-bold hover:bg-emerald-50 transition-colors"
              >
                Portfolio <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
              </a>
              <a
                href="https://github.com/hasib61714"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/25 text-sm font-bold hover:bg-white/20 transition-colors"
              >
                GitHub <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
              </a>
              <button
                type="button"
                onClick={onOpenAbout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/25 text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer"
              >
                যোগাযোগ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionHead: React.FC<{ id: string; kicker: string; title: string; text: string }> = ({ id, kicker, title, text }) => (
  <div className="mb-5">
    <span className="text-xs font-bold text-emerald-700">{kicker}</span>
    <h2 id={id} className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">{title}</h2>
    <p className="text-sm text-stone-600 mt-1 max-w-2xl">{text}</p>
  </div>
);

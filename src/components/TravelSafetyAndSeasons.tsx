import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  CloudRain,
  Snowflake,
  Wind,
  Sun,
  Flower2,
  AlertTriangle,
  LifeBuoy,
  Compass
} from 'lucide-react';

export const TravelSafetyAndSeasons: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seasons' | 'safety'>('seasons');

  const helplines = [
    {
      title: 'জাতীয় জরুরি সেবা (সব বিভাগ)',
      number: '999',
      desc: 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স সেবার জন্য ২৪/৭ টোল ফ্রি হটলাইন।',
      badge: 'টোল ফ্রি',
    },
    {
      title: 'ট্যুরিস্ট পুলিশ বাংলাদেশ (Tourist Police)',
      number: '01320-222222',
      desc: 'কক্সবাজার, কুয়াকাটা, সাজেক, সুন্দরবনসহ পর্যটন কেন্দ্রসমূহে যেকোনো হেনস্তা বা সহযোগিতায়।',
      badge: '২৪ ঘণ্টা হটলাইন',
    },
    {
      title: 'ট্যুরিস্ট পুলিশ (বিকল্প নম্বর)',
      number: '01887-878787',
      desc: 'কক্সবাজার, কুয়াকাটা, সাজেক, সুন্দরবনসহ পর্যটন কেন্দ্রসমূহে যেকোনো হেনস্তা বা সহযোগিতায়।',
      badge: '২৪ ঘণ্টা হটলাইন',
    },
    {
      title: 'বাংলাদেশ রেলওয়ে সেবা ও তথ্য',
      number: '131',
      desc: 'ট্রেন সময়সূচি, টিকিট অনুসন্ধান ও ট্রেনের অবস্থান জানার হটলাইন।',
      badge: 'তথ্য সেবা',
    },
    {
      title: 'দুর্যোগের আগাম বার্তা ও আবহাওয়া',
      number: '1090',
      desc: 'সমুদ্রবন্দর বা নদীবন্দরের সতর্ক সংকেত ও সাইক্লোন সতর্কবার্তা জানার নম্বর।',
      badge: 'আবহাওয়া সংকেত',
    },
  ];

  type Season = {
    season: string;
    icon: typeof CloudRain;
    color: string;
    tag: string;
    destinations: { name: string; dist: string; note: string }[];
    // Climate-only facts (no destination list) with attribution. Used where a reliable
    // destination-by-season source was not established, so nothing is invented.
    facts?: string[];
    source?: string;
    tips: string;
  };

  const seasons: Season[] = [
    {
      season: 'গ্রীষ্মকাল (মধ্য এপ্রিল – মধ্য জুন)',
      icon: Sun,
      color: 'from-orange-600 to-red-500',
      tag: 'প্রচণ্ড গরম ও কালবৈশাখীর সময়',
      destinations: [],
      facts: [
        'বাংলা পঞ্জিকা অনুযায়ী গ্রীষ্মে আবহাওয়া গরম ও শুষ্ক থাকে, মাঝেমধ্যে প্রচণ্ড ঝড় হয়।',
        'এপ্রিল দেশের সবচেয়ে উষ্ণ মাস।',
        'মার্চ থেকে মে মাসে উত্তর-পশ্চিম দিক থেকে আসা বজ্রঝড় (কালবৈশাখী / নর’ওয়েস্টার) দেখা যায়; এই ঝড়ের মৌসুম বর্ষা শুরুর আগ পর্যন্ত চলে।',
      ],
      source: 'তথ্যসূত্র: বাংলাপিডিয়া (Season, Climate); “An Overview of Thunderstorms over Bangladesh”, Bangladesh Journal of Physics (BMD সংশ্লিষ্ট গবেষণা)।',
      tips: 'নির্ভরযোগ্য ঋতুভিত্তিক গন্তব্য-তালিকা যাচাই করা যায়নি, তাই এখানে দেওয়া হয়নি। যাত্রার আগে বাংলাদেশ আবহাওয়া অধিদপ্তরের পূর্বাভাস দেখে নিন।',
    },
    {
      season: 'বর্ষাকাল (জুন – আগস্ট)',
      icon: CloudRain,
      color: 'from-blue-600 to-cyan-500',
      tag: 'হাওর ও জলপ্রপাতের সেরা সময়',
      destinations: [
        { name: 'টাঙ্গুয়ার হাওর ও নীলাদ্রি লেক', dist: 'সুনামগঞ্জ', note: 'হাওর পানিতে টইটুম্বুর, বজরায় রাতযাপন।' },
        { name: 'নিকলী হাওর', dist: 'কিশোরগঞ্জ', note: 'বিস্তীর্ণ ঢেউ ও অলওয়েদার সড়কে বাইকিং।' },
        { name: 'রাতারগুল সোয়াম্প ফরেস্ট', dist: 'সিলেট', note: 'জলে নিমজ্জিত মিষ্টি পানির বন।' },
        { name: 'নাফাখুম ও অমিয়াখুম ঝর্ণা', dist: 'বান্দরবান', note: 'ঝর্ণার যৌবনরূপ ও রোমাঞ্চকর ট্র্যাকিং।' },
      ],
      tips: 'লাইফ জ্যাকেট অবশ্যই ব্যবহার করুন। দুর্গম পাহাড়ি ট্র্যাকে স্থানীয় অভিজ্ঞ গাইড সাথে রাখুন।',
    },
    {
      season: 'শীতকাল (নভেম্বর – ফেব্রুয়ারি)',
      icon: Snowflake,
      color: 'from-emerald-700 to-teal-600',
      tag: 'সমুদ্র সৈকত ও ক্যাম্পিং মৌসুম',
      destinations: [
        { name: 'সেন্টমার্টিন ও ছেঁড়া দ্বীপ', dist: 'কক্সবাজার', note: 'জাহাজ চলাচল শুরু হয়, নীল পানি ও প্রবাল।' },
        { name: 'কুয়াকাটা সাগরকন্যা', dist: 'পটুয়াখালী', note: 'একই সৈকতে সূর্যোদয় ও সূর্যাস্তের অসাধারণ রূপ।' },
        { name: 'সুন্দরবন ম্যানগ্রোভ সাফারি', dist: 'বাগেরহাট/খুলনা', note: 'হরিণ, বাঘের পদচিহ্ন ও পরিযায়ী পাখি।' },
        { name: 'তেঁতুলিয়া কাঞ্চনজঙ্ঘা দর্শন', dist: 'পঞ্চগড়', note: 'হিমালয়ের বরফাবৃত চূড়া দেখার সেরা সময়।' },
      ],
      tips: 'হোটেল ও ট্রাভেল টিকিট অন্তত ২ সপ্তাহ আগে বুকিং দিন। রাতে পর্যাপ্ত শীতবস্ত্র রাখুন।',
    },
    {
      season: 'শরৎ ও হেমন্ত (সেপ্টেম্বর – অক্টোবর)',
      icon: Wind,
      color: 'from-amber-600 to-yellow-500',
      tag: 'নীল আকাশ ও কাশফুল ভ্রমণ',
      destinations: [
        { name: 'সাজেক ভ্যালি (মেঘের উপত্যকা)', dist: 'রাঙ্গামাটি', note: 'মেঘের ভেলা চোখের সামনে ভেসে বেড়ায়।' },
        { name: 'শ্রীমঙ্গল ও লাউয়াছড়া', dist: 'মৌলভীবাজার', note: 'সবুজ চা বাগান ও স্নিগ্ধ শীতল আবহাওয়া।' },
        { name: 'বিরিশিরি ও সোমেশ্বরী নদী', dist: 'নেত্রকোণা', note: 'চীনামাটির নীল জলের হ্রদ ও পাহাড়।' },
      ],
      tips: 'আবহাওয়া খুবই আরামদায়ক থাকে, ডে ট্রিপ বা লং উইকেন্ড ট্যুরের জন্য সবচেয়ে উপযুক্ত।',
    },
    {
      season: 'বসন্তকাল (মধ্য ফেব্রুয়ারি – মধ্য এপ্রিল)',
      icon: Flower2,
      color: 'from-pink-600 to-rose-500',
      tag: 'শীত শেষে উষ্ণ হাওয়ার সময়',
      destinations: [],
      facts: [
        'বাংলা পঞ্জিকা অনুযায়ী বসন্ত মধ্য ফেব্রুয়ারি থেকে মধ্য এপ্রিল পর্যন্ত; এ সময় উষ্ণ বাতাস বইতে শুরু করে এবং মাঝেমধ্যে বজ্রঝড় হয়।',
        'কালবৈশাখী ঝড়ের মৌসুম সাধারণত মার্চের প্রথম সপ্তাহে দেশের উত্তর-পশ্চিমাঞ্চলে শুরু হয়ে ক্রমে পূর্ব দিকে সরে যায়।',
      ],
      source: 'তথ্যসূত্র: বাংলাপিডিয়া (Season); “An Overview of Thunderstorms over Bangladesh”, Bangladesh Journal of Physics (BMD সংশ্লিষ্ট গবেষণা)।',
      tips: 'নির্ভরযোগ্য ঋতুভিত্তিক গন্তব্য-তালিকা যাচাই করা যায়নি, তাই এখানে দেওয়া হয়নি। যাত্রার আগে বাংলাদেশ আবহাওয়া অধিদপ্তরের পূর্বাভাস দেখে নিন।',
    },
  ];

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
            <LifeBuoy className="w-3.5 h-3.5 text-emerald-600" />
            <span>নিরাপদ ও পরিকল্পনা মাফিক ভ্রমণ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            কোন ঋতুতে কোথায় যাবেন? ও জরুরি হেল্পলাইন
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            বছরের কোন সময় কোন জেলায় ভ্রমণ সবচেয়ে আনন্দদায়ক হবে তার পূর্ণাঙ্গ রূপরেখা এবং যেকোনো
            পরিস্থিতিতে জরুরি যোগাযোগের তালিকা।
          </p>
        </div>

        {/* View Switcher */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('seasons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'seasons'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>ঋতুভিত্তিক ভ্রমণ গাইড</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>জরুরি হেল্পলাইন ও নিরাপত্তা</span>
          </button>
        </div>
      </div>

      {activeTab === 'seasons' ? (
        /* Seasonal Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season, idx) => {
            const Icon = season.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${season.color} text-white flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base text-stone-900 leading-tight">
                        {season.season}
                      </h2>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {season.tag}
                      </span>
                    </div>
                  </div>

                  {season.destinations.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        সেরা গন্তব্যসমূহ:
                      </span>
                      {season.destinations.map((dest, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-stone-900">
                            <span>{dest.name}</span>
                            <span className="text-emerald-700 text-[11px] font-semibold">{dest.dist}</span>
                          </div>
                          <p className="text-[11px] text-stone-500">{dest.note}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {season.facts && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        আবহাওয়ার বৈশিষ্ট্য:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-700 list-disc pl-4">
                        {season.facts.map((f, fIdx) => (
                          <li key={fIdx}>{f}</li>
                        ))}
                      </ul>
                      {season.source && <p className="text-[10px] text-stone-500 leading-relaxed">{season.source}</p>}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 text-[11px] text-amber-900 bg-amber-50/70 p-3 rounded-xl border border-amber-200/50">
                  <strong>টিপস:</strong> {season.tips}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Emergency Helplines */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {helplines.map((help, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {help.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 leading-snug">
                    {help.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {help.desc}
                  </p>
                </div>

                <a
                  href={`tel:${help.number}`}
                  className="mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-sm border border-emerald-200 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>কল করুন: {help.number}</span>
                </a>
              </div>
            ))}
          </div>

          {/* Special Safety Rules Card */}
          <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="font-extrabold text-lg text-emerald-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>পাহাড় ও সমুদ্র ভ্রমণের গুরুত্বপূর্ণ সতর্কতা</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-emerald-100/90 leading-relaxed">
              <div className="space-y-1 bg-white/10 p-4 rounded-xl">
                <strong className="block text-white text-sm">সমুদ্র সৈকত সতর্কতা (Sea Safety):</strong>
                <p>
                  জোয়ার-ভাটার সময় লাল পতাকা থাকলে সাগরে নামবেন না। সেন্টমার্টিন ও কক্সবাজারে গুপ্ত খাল
                  (Rip current) থাকে, একা বেশি গভীরে যাবেন না।
                </p>
              </div>
              <div className="space-y-1 bg-white/10 p-4 rounded-xl">
                <strong className="block text-white text-sm">পার্বত্য চট্টগ্রাম নিয়মাবলি (Hill Tracts):</strong>
                <p>
                  বান্দরবান ও সাজেক ভ্রমণের ক্ষেত্রে স্থানীয় প্রশাসন ও সেনাবাহিনীর চেকপোস্টে জাতীয় পরিচয়পত্র
                  প্রদর্শন করুন। ট্র্যাকিংয়ে নিবন্ধিত লোকাল গাইড সাথে রাখুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

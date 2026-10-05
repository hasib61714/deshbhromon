import React, { useState } from 'react';
import { DISTRICT_DETAILS, DIVISIONS, toBengaliNumber } from '../data/bangladesh-data';
import { getDistrictArtMeta, LandmarkCategory } from '../data/landmark-art';
import { DISTRICT_IMAGES } from '../data/landmark-images';
import { DistrictArtCard } from './DistrictArtCard';
import {
  Sparkles,
  Search,
  Download,
  Copy,
  Check,
  X,
  Compass,
  MapPin,
  Camera,
  CheckCircle2,
  Star,
  Layers,
  Palette
} from 'lucide-react';

interface DistrictPhotoGalleryProps {
  visited: Set<string>;
  wishlist: Set<string>;
  onToggleVisited: (district: string) => void;
  onToggleWishlist: (district: string) => void;
}

export const DistrictPhotoGallery: React.FC<DistrictPhotoGalleryProps> = ({
  visited,
  wishlist,
  onToggleVisited,
  onToggleWishlist,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const districts = Object.keys(DISTRICT_DETAILS);

  const filteredDistricts = districts.filter((dId) => {
    const info = DISTRICT_DETAILS[dId];
    const art = getDistrictArtMeta(dId, info.bn, info.dvBn);

    const matchesSearch =
      info.bn.includes(search) ||
      dId.toLowerCase().includes(search.toLowerCase()) ||
      art.landmarkNameBn.includes(search) ||
      art.landmarkNameEn.toLowerCase().includes(search.toLowerCase());

    const matchesDivision =
      selectedDivision === 'all' || info.dv === selectedDivision;

    const matchesCategory =
      selectedCategory === 'all' || art.category === selectedCategory;

    return matchesSearch && matchesDivision && matchesCategory;
  });

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const activeInfo = activeDistrict ? DISTRICT_DETAILS[activeDistrict] : null;
  const activeArt = activeDistrict && activeInfo
    ? getDistrictArtMeta(activeDistrict, activeInfo.bn, activeInfo.dvBn)
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Gallery Header & Controls */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>৬৪ জেলা ট্রাভেল ইন্সপিরেশন ফটো গ্যালারি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              ল্যান্ডমার্ক আর্ট ও ভিজ্যুয়াল গ্যালারি
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              বাংলাদেশের প্রতিটি জেলার স্বতন্ত্র ঐতিহ্য, প্রাকৃতিক রূপ ও দর্শনীয় ল্যান্ডমার্কের ওপর ভিত্তি করে
              প্রসিডিউরাল ট্রাভেল ইন্সপিরেশন ছবি তৈরি করা হয়েছে।
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <span className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                মোট আর্টওয়ার্ক
              </span>
              <strong className="text-xl font-black text-emerald-950">
                {toBengaliNumber(filteredDistricts.length)} / {toBengaliNumber(districts.length)}টি
              </strong>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-stone-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="জেলা বা ল্যান্ডমার্কের নাম খুঁজুন (যেমন: রাতারগুল, সেন্টমার্টিন, পাহাড়, কেল্লা)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'সব ল্যান্ডমার্ক' },
              { id: 'beach', label: '🏖️ সমুদ্র সৈকত' },
              { id: 'hills', label: '⛰️ পাহাড় ও মেঘ' },
              { id: 'tea', label: '🍃 চা বাগান' },
              { id: 'mangrove', label: '🐅 সুন্দরবন' },
              { id: 'heritage', label: '🏛️ ঐতিহাসিক স্থাপত্য' },
              { id: 'river_haor', label: '⛵ নদী ও হাওর' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setSelectedDivision('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDivision === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            সব বিভাগ
          </button>
          {DIVISIONS.map((div) => (
            <button
              key={div.id}
              type="button"
              onClick={() => setSelectedDivision(div.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedDivision === div.id
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {div.bn}
            </button>
          ))}
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredDistricts.map((dId) => (
          <DistrictArtCard
            key={dId}
            districtId={dId}
            onOpenDetails={() => setActiveDistrict(dId)}
          />
        ))}
      </div>

      {/* Lightbox / Details Modal */}
      {activeDistrict && activeInfo && activeArt && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveDistrict(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Artwork Hero */}
            <div className="relative">
              <DistrictArtCard
                districtId={activeDistrict}
                aspect="banner"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      {activeInfo.dvBn} বিভাগ
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500 font-semibold">
                      {activeDistrict} District
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 mt-0.5">
                    {activeInfo.bn} — {activeArt.landmarkNameBn}
                  </h3>
                </div>

                {/* Visited & Wishlist Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleVisited(activeDistrict)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      visited.has(activeDistrict)
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-emerald-100 hover:text-emerald-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{visited.has(activeDistrict) ? 'ঘুরেছেন' : 'ঘুরেছি'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(activeDistrict)}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      wishlist.has(activeDistrict)
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 text-stone-400 hover:text-amber-500'
                    }`}
                    title="ইচ্ছেতালিকায় রাখুন"
                  >
                    <Star className={`w-4 h-4 ${wishlist.has(activeDistrict) ? 'fill-white' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  বিখ্যাত আকর্ষণ ও বর্ণনা:
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  {activeInfo.fam}
                </p>
              </div>

              {/* Authentic Real Landmark Photography */}
              {DISTRICT_IMAGES[activeDistrict] && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>বাস্তব ল্যান্ডমার্ক আলোকচিত্র (Authentic Photography):</span>
                  </span>
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 group h-52 sm:h-60">
                    <img
                      src={DISTRICT_IMAGES[activeDistrict].url}
                      alt={DISTRICT_IMAGES[activeDistrict].caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <strong className="block text-sm font-bold text-white">
                          {DISTRICT_IMAGES[activeDistrict].caption}
                        </strong>
                        <span className="text-xs text-emerald-300">
                          {DISTRICT_IMAGES[activeDistrict].credit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Image Generation Prompt Card */}
              <div className="bg-slate-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Travel Photo Generation Prompt:</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(activeArt.aiPrompt)}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>প্রম্পট কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/40 p-3 rounded-xl border border-white/10 select-all">
                  "{activeArt.aiPrompt}"
                </p>
                <span className="text-[10px] text-slate-400 block italic">
                  💡 এই প্রম্পটটি ব্যবহার করে Midjourney, DALL-E বা Gemini দিয়ে হাইপার-রিয়েলিস্টিক ৪K ট্রাভেল ফটোগ্রাফি তৈরি করতে পারবেন।
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

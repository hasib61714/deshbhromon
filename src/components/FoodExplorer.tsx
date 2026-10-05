import React, { useState, useEffect } from 'react';
import {
  readStringSet,
  writeStringSet
} from '../lib/storage';
import {
  ICONIC_FOODS
} from '../data/food-data';
import {
  DISTRICT_DETAILS,
  toBengaliNumber
} from '../data/bangladesh-data';
import {
  Utensils,
  CheckCircle2,
  Search,
  Sparkles,
  Cookie,
  Flame,
  Apple
} from 'lucide-react';

export const FoodExplorer: React.FC = () => {
  const [tastedFoods, setTastedFoods] = useState<Set<string>>(() => readStringSet('tasted_foods'));

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    writeStringSet('tasted_foods', tastedFoods);
  }, [tastedFoods]);

  const toggleTasted = (foodId: string) => {
    setTastedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(foodId)) next.delete(foodId);
      else next.add(foodId);
      return next;
    });
  };

  const filtered = ICONIC_FOODS.filter((food) => {
    const districtInfo = DISTRICT_DETAILS[food.districtId];
    const matchSearch =
      food.nameBn.includes(search) ||
      food.desc.includes(search) ||
      (districtInfo && districtInfo.bn.includes(search));
    const matchCategory =
      selectedCategory === 'all' || food.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const tastedPercentage = Math.round((tastedFoods.size / ICONIC_FOODS.length) * 100);

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/80">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>ঐতিহ্যবাহী স্বাদের মানচিত্র</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              বাংলাদেশের নামকরা খাবার ও মিষ্টি
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              বাংলাদেশের প্রতিটি জেলার ঐতিহ্যবাহী মিষ্টি, স্পেশাল রান্না ও রসনাবিলাসের স্বাদ পরখ
              করুন এবং যেগুলো খেয়েছেন তা টিক দিন!
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl shrink-0 flex items-center gap-3">
            <div className="text-center">
              <span className="block text-[10px] text-amber-800 font-bold uppercase">চেখে দেখেছেন</span>
              <strong className="text-2xl font-black text-amber-950">
                {toBengaliNumber(tastedFoods.size)} / {toBengaliNumber(ICONIC_FOODS.length)}
              </strong>
            </div>
            <div className="text-xs font-bold text-amber-700">
              ({toBengaliNumber(tastedPercentage)}%)
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="খাবার বা জেলার নাম লিখুন (যেমন: চমচম, কাচ্চি, ইলিশ, চুইঝাল)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'সব খাবার', icon: Sparkles },
              { id: 'sweet', label: 'মিষ্টি ও মিষ্টান্ন', icon: Cookie },
              { id: 'main', label: 'প্রধান খাবার', icon: Flame },
              { id: 'fruit', label: 'ফলমূল ও পানীয়', icon: Apple },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((food) => {
          const districtInfo = DISTRICT_DETAILS[food.districtId];
          const isTasted = tastedFoods.has(food.id);

          return (
            <div
              key={food.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isTasted
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-extrabold text-base text-stone-900 leading-tight">
                      {food.nameBn}
                    </h2>
                    <span className="text-xs text-amber-700 font-semibold block mt-0.5">
                      📍 {districtInfo?.bn || food.districtId} জেলা ({districtInfo?.dvBn} বিভাগ)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTasted(food.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1 cursor-pointer shrink-0 ${
                      isTasted
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-500 hover:bg-amber-100 hover:text-amber-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isTasted ? 'খেয়েছি' : 'টেস্ট করুন'}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {food.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span className="capitalize">
                  {food.category === 'sweet' ? 'মিষ্টি' : food.category === 'main' ? 'মূল খাবার' : 'ফল ও খাবার'}
                </span>
                {isTasted && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    ✓ আপনার স্বাদের তালিকায় যুক্ত
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

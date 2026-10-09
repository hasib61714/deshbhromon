import { useLang } from '../i18n/LangContext';
import React, { useState, useEffect } from 'react';
import { loadPlanner, savePlanner, type PlannerState, type BudgetTier, type ChecklistItem } from '../lib/tripPlan';
import {
  DISTRICT_DETAILS,
  toBengaliNumber
} from '../data/bangladesh-data';
import {
  Route,
  Calendar,
  Users,
  Printer,
  CheckSquare,
  Square,
  Sparkles,
  Car,
  Compass,
  Utensils,
  Hotel,
  Calculator,
  Receipt,
  Coins,
  Share2,
  PhoneCall
} from 'lucide-react';

export const TripPlanner: React.FC = () => {
  const { lang, tr, n } = useLang();
  const [initial] = useState<PlannerState>(loadPlanner);
  const [startDistrict, setStartDistrict] = useState<string>(initial.startDistrict);
  const [selectedStops, setSelectedStops] = useState<string[]>(initial.stops);
  const [days, setDays] = useState<number>(initial.days);
  const [travelers, setTravelers] = useState<number>(initial.travelers);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initial.budgetTier);
  const [notes, setNotes] = useState<string>(initial.notes);

  // Itemized Budget Planning Inputs
  const [transportCost, setTransportCost] = useState<number>(initial.transportCost); // মোট যাতায়াত খরচ
  const [foodCostPerPersonDay, setFoodCostPerPersonDay] = useState<number>(initial.foodCostPerPersonDay); // জনপ্রতি দৈনিক খাবার
  const [lodgingCostPerNight, setLodgingCostPerNight] = useState<number>(initial.lodgingCostPerNight); // প্রতি রাত হোটেল/আবাসন
  const [roomCount, setRoomCount] = useState<number>(initial.roomCount); // রুম সংখ্যা
  const [otherCost, setOtherCost] = useState<number>(initial.otherCost); // এন্ট্রি টিকিট ও অন্যান্য

  const [checklist, setChecklist] = useState<ChecklistItem[]>(initial.checklist);

  useEffect(() => {
    savePlanner({
      startDistrict,
      stops: selectedStops,
      days,
      travelers,
      budgetTier,
      notes,
      transportCost,
      foodCostPerPersonDay,
      lodgingCostPerNight,
      roomCount,
      otherCost,
      checklist,
    });
  }, [startDistrict, selectedStops, days, travelers, budgetTier, notes, transportCost, foodCostPerPersonDay, lodgingCostPerNight, roomCount, otherCost, checklist]);

  const [newCheckItem, setNewCheckItem] = useState<string>('');

  const handleAddStop = (district: string) => {
    if (!selectedStops.includes(district) && district !== startDistrict) {
      setSelectedStops([...selectedStops, district]);
    }
  };

  const handleRemoveStop = (district: string) => {
    setSelectedStops(selectedStops.filter((d) => d !== district));
  };

  const toggleCheckItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist([
      ...checklist,
      { id: Date.now().toString(), text: newCheckItem.trim(), done: false },
    ]);
    setNewCheckItem('');
  };

  // Itemized Budget calculations
  const nights = Math.max(1, days - 1);
  const totalFoodCost = foodCostPerPersonDay * days * travelers;
  const totalLodgingCost = lodgingCostPerNight * nights * roomCount;
  const totalTransportCost = transportCost;
  const totalOtherCost = otherCost;

  const totalEstimatedCost = totalTransportCost + totalFoodCost + totalLodgingCost + totalOtherCost;
  const perPersonCost = Math.round(totalEstimatedCost / Math.max(1, travelers));
  const perDayCost = Math.round(totalEstimatedCost / Math.max(1, days));

  // Category percentages
  const transportPct = totalEstimatedCost > 0 ? Math.round((totalTransportCost / totalEstimatedCost) * 100) : 0;
  const foodPct = totalEstimatedCost > 0 ? Math.round((totalFoodCost / totalEstimatedCost) * 100) : 0;
  const lodgingPct = totalEstimatedCost > 0 ? Math.round((totalLodgingCost / totalEstimatedCost) * 100) : 0;
  const otherPct = Math.max(0, 100 - (transportPct + foodPct + lodgingPct));

  const applyPreset = (tier: 'budget' | 'standard' | 'luxury') => {
    setBudgetTier(tier);
    if (tier === 'budget') {
      setTransportCost(1800 * travelers);
      setFoodCostPerPersonDay(350);
      setLodgingCostPerNight(1100);
      setOtherCost(600);
    } else if (tier === 'standard') {
      setTransportCost(3200 * travelers);
      setFoodCostPerPersonDay(650);
      setLodgingCostPerNight(2400);
      setOtherCost(1200);
    } else {
      setTransportCost(6500 * travelers);
      setFoodCostPerPersonDay(1500);
      setLodgingCostPerNight(5500);
      setOtherCost(3500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const startName = DISTRICT_DETAILS[startDistrict]?.bn || startDistrict;
    const stopsText = selectedStops.map((id) => DISTRICT_DETAILS[id]?.bn || id).join(' ➔ ');
    const msg = lang === 'en'
      ? `🎒 *DeshBhromon tour plan & budget summary*\n📍 Route: ${lang === 'en' ? startDistrict : startName} ➔ ${selectedStops.join(' ➔ ')}\n⏱️ Days: ${days} | 👥 Travellers: ${travelers}\n💰 Total estimated budget: ৳ ${totalEstimatedCost.toLocaleString()}\n👤 Per person: ৳ ${perPersonCost.toLocaleString()}\n----------------------------------------\n🚌 Transport: ৳ ${totalTransportCost.toLocaleString()}\n🍱 Food: ৳ ${totalFoodCost.toLocaleString()}\n🏨 Hotel/resort: ৳ ${totalLodgingCost.toLocaleString()}\n🎫 Other/sightseeing: ৳ ${totalOtherCost.toLocaleString()}\n\n🚨 Emergency travel helplines:\n- Tourist Police Bangladesh: 01320-222222\n- National emergency service: 999\n\n🔗 See the interactive 64-district travel map on DeshBhromon!`
      : `🎒 *দেশভ্রমণ (DeshBhromon) ট্যুর প্ল্যান ও বাজেট সামারি*
📍 রুট: ${startName} ➔ ${stopsText}
⏱️ দিন: ${toBengaliNumber(days)} দিন | 👥 যাত্রী: ${toBengaliNumber(travelers)} জন
💰 মোট আনুমানিক বাজেট: ৳ ${toBengaliNumber(totalEstimatedCost.toLocaleString())}
👤 জনপ্রতি খরচ: ৳ ${toBengaliNumber(perPersonCost.toLocaleString())}
----------------------------------------
🚌 যাতায়াত/পরিবহন: ৳ ${toBengaliNumber(totalTransportCost.toLocaleString())}
🍱 খাবার খরচ: ৳ ${toBengaliNumber(totalFoodCost.toLocaleString())}
🏨 হোটেল/রিসোর্ট: ৳ ${toBengaliNumber(totalLodgingCost.toLocaleString())}
🎫 অন্যান্য/সাইটসিয়িং: ৳ ${toBengaliNumber(totalOtherCost.toLocaleString())}

🚨 জরুরি ভ্রমণ হেল্পলাইন:
- ট্যুরিস্ট পুলিশ বাংলাদেশ: 01320-222222
- জাতীয় জরুরি সেবা: 999

🔗 দেশভ্রমণ ওয়েবসাইটে ইন্টারেক্টিভ ৬৪ জেলা ভ্রমণ মানচিত্র দেখুন!`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
            <Route className="w-3.5 h-3.5 text-emerald-600" />
            <span>{tr('স্মার্ট ভ্রমণসূচি ও বাজেট ক্যালকুলেটর')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {tr('ট্রিপ প্ল্যানার (Tour Itinerary Planner)')}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            {tr('আপনার পরবর্তী ভ্রমণের পরিকল্পনা তৈরি করুন। যাত্রা শুরুর স্থান ও গন্তব্যসমূহ নির্বাচন করে আনুমানিক বাজেট, ভ্রমণসূচি ও চেকলিস্ট প্রস্তুত করুন।')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Planner Input Controls */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{tr('ভ্রমণের সাধারণ বিবরণ')}</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Start District */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {tr('যাত্রা শুরুর জেলা (Departure Point):')}
              </label>
              <select
                aria-label={tr('যাত্রা শুরুর জেলা')}
                value={startDistrict}
                onChange={(e) => setStartDistrict(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              >
                {Object.keys(DISTRICT_DETAILS).map((d) => (
                  <option key={d} value={d}>
                    {lang === 'en' ? `${d} (${DISTRICT_DETAILS[d].dv})` : `${DISTRICT_DETAILS[d].bn} (${DISTRICT_DETAILS[d].dvBn})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Stops */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {tr('গন্তব্য বা দর্শনীয় জেলাসমূহ (Destinations):')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedStops.map((stop) => (
                  <span
                    key={stop}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-200 text-xs"
                  >
                    <span>{lang === 'en' ? stop : DISTRICT_DETAILS[stop]?.bn || stop}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop)}
                      aria-label={lang === 'en' ? `Remove ${stop}` : `${DISTRICT_DETAILS[stop]?.bn || stop} বাদ দিন`}
                      className="text-emerald-600 hover:text-emerald-900 cursor-pointer -mr-2 w-8 h-8 inline-flex items-center justify-center text-base"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <select
                aria-label={tr('আরও জেলা যুক্ত করুন')}
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddStop(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-xs font-semibold"
              >
                <option value="" disabled>
                  {tr('+ আরও জেলা যুক্ত করুন...')}
                </option>
                {Object.keys(DISTRICT_DETAILS)
                  .filter((d) => d !== startDistrict && !selectedStops.includes(d))
                  .map((d) => (
                    <option key={d} value={d}>
                      {lang === 'en' ? d : DISTRICT_DETAILS[d].bn}
                    </option>
                  ))}
              </select>
            </div>

            {/* Days & Travelers in a 2-col row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{tr('সময়কাল (দিন)')}</span>
                </label>
                <input
                  type="number"
                  aria-label={tr('সময়কাল (দিন)')}
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>{tr('যাত্রী সংখ্যা')}</span>
                </label>
                <input
                  type="number"
                  aria-label={tr('যাত্রী সংখ্যা')}
                  min={1}
                  max={50}
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                />
              </div>
            </div>

            {/* Budget Presets & Custom Planner */}
            <div className="pt-2 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>{tr('বাজেট প্ল্যানিং টুল (Itemized Costs)')}</span>
                </label>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {tr('লাইভ ক্যালকুলেটর')}
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="block text-[11px] font-bold text-stone-500 mb-1.5">
                  {tr('দ্রুত বাজেট টেমপ্লেট নির্বাচন করুন:')}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', label: 'বাজেট', sub: 'লোকাল বাস / হোস্টেল' },
                    { id: 'standard', label: 'স্ট্যান্ডার্ড', sub: 'এসি বাস / হোটেল' },
                    { id: 'luxury', label: 'প্রিমিয়াম', sub: 'রিসোর্ট / বিমান' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => applyPreset(tier.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        budgetTier === tier.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-xs font-bold">{tr(tier.label)}</span>
                      <span className="block text-[10px] text-stone-500 mt-0.5">{tr(tier.sub)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Itemized Cost Input Fields */}
              <div className="space-y-3 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200">
                {/* Transport Cost */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700 flex items-center gap-1 text-xs">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      <span>{tr('পরিবহন ও যাতায়াত খরচ (Transport):')}</span>
                    </label>
                    <span className="text-[11px] text-stone-500 font-semibold">{tr('বাস/ট্রেন/বিমান')}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">৳</span>
                    <input
                      type="number"
                  aria-label={tr('পরিবহন খরচ (টাকা)')}
                      min={0}
                      step={100}
                      value={transportCost}
                      onChange={(e) => setTransportCost(Math.max(0, Number(e.target.value) || 0))}
                      placeholder={tr('যেমন: ৩০০০')}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>

                {/* Food Cost */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700 flex items-center gap-1 text-xs">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>{tr('দৈনিক খাবার খরচ (Food / Person / Day):')}</span>
                    </label>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {tr('মোট:')} ৳{n(totalFoodCost.toLocaleString())}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">৳</span>
                    <input
                      type="number"
                  aria-label={tr('জনপ্রতি দৈনিক খাবার খরচ (টাকা)')}
                      min={0}
                      step={50}
                      value={foodCostPerPersonDay}
                      onChange={(e) => setFoodCostPerPersonDay(Math.max(0, Number(e.target.value) || 0))}
                      placeholder={tr('যেমন: ৬০০')}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                  <span className="block text-[10px] text-stone-500 mt-0.5">
                    {tr('হিসাব:')} ৳{n(foodCostPerPersonDay)} × {n(days)} {tr('দিন')} × {n(travelers)} {tr('জন')}
                  </span>
                </div>

                {/* Lodging Cost & Rooms */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-700 flex items-center gap-1 text-xs">
                      <Hotel className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tr('হোটেল ও আবাসন খরচ (Lodging):')}</span>
                    </label>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {tr('মোট:')} ৳{n(totalLodgingCost.toLocaleString())}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] text-stone-500 mb-0.5">{tr('রুম প্রতি রাত ভাড়া:')}</span>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">৳</span>
                        <input
                          type="number"
                  aria-label={tr('রুম প্রতি রাতের ভাড়া (টাকা)')}
                          min={0}
                          step={100}
                          value={lodgingCostPerNight}
                          onChange={(e) => setLodgingCostPerNight(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full pl-7 pr-2 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] text-stone-500 mb-0.5">{tr('রুম সংখ্যা:')}</span>
                      <input
                        type="number"
                  aria-label={tr('রুম সংখ্যা')}
                        min={1}
                        max={20}
                        value={roomCount}
                        onChange={(e) => setRoomCount(Math.max(1, Number(e.target.value) || 1))}
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900"
                      />
                    </div>
                  </div>
                  <span className="block text-[10px] text-stone-500">
                    {tr('হিসাব:')} ৳{n(lodgingCostPerNight)} × {n(nights)} {tr('রাত')} × {n(roomCount)} {tr('রুম')}
                  </span>
                </div>

                {/* Extras & Sightseeing Fees */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700 flex items-center gap-1 text-xs">
                      <Coins className="w-3.5 h-3.5 text-purple-600" />
                      <span>{tr('অন্যান্য, টিকিট ও সাইটসিয়িং (Extras):')}</span>
                    </label>
                    <span className="text-[11px] text-stone-500 font-semibold">{tr('গাইড/এন্ট্রি ফি')}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">৳</span>
                    <input
                      type="number"
                  aria-label={tr('গাইড ও এন্ট্রি ফি (টাকা)')}
                      min={0}
                      step={100}
                      value={otherCost}
                      onChange={(e) => setOtherCost(Math.max(0, Number(e.target.value) || 0))}
                      placeholder={tr('যেমন: ১০০০')}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Notes */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {tr('বিশেষ নোট বা স্মরণীয় স্থান:')}
              </label>
              <textarea
                rows={2}
                placeholder={tr('যেমন: সেন্টমার্টিন জাহাজের টিকিট আগে কাটা, সকাল ৭টায় রওনা...')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Estimated Tour Summary Sheet & Packing Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Sheet */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 print:border-none print:p-0">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {tr('ট্যুর প্ল্যান সামারি')}
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-0.5">
                  {lang === 'en' ? `From ${startDistrict}` : `${DISTRICT_DETAILS[startDistrict]?.bn} থেকে`}{' '}
                  {selectedStops.map((s) => (lang === 'en' ? s : DISTRICT_DETAILS[s]?.bn)).join(' ➔ ') || tr('যাত্রা')}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  title={tr('ট্যুর প্ল্যান ও খরচের হিসাব হোয়াটসঅ্যাপে শেয়ার করুন')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-105 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{tr('হোয়াটসঅ্যাপে পাঠান')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{tr('প্রিন্ট ভাউচার')}</span>
                </button>
              </div>
            </div>

            {/* Estimated Budget Box */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'en' ? `Total estimated budget (${days} days · ${travelers} travellers)` : `মোট আনুমানিক বাজেট (${toBengaliNumber(days)} দিন · ${toBengaliNumber(travelers)} জন যাত্রী)`}</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-950">
                    ৳ {n(totalEstimatedCost.toLocaleString())}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-emerald-700 font-semibold pt-0.5">
                    <span>{tr('জনপ্রতি:')} <strong>৳ {n(perPersonCost.toLocaleString())}</strong></span>
                    <span>·</span>
                    <span>{tr('দৈনিক গড়:')} <strong>৳ {n(perDayCost.toLocaleString())}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-100/60 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{travelers > 1 ? tr('গ্রুপ ট্যুর হিসাব') : tr('সোলো ট্রিপ হিসাব')}</span>
                </div>
              </div>

              {/* Visual Expense Distribution Bar */}
              {totalEstimatedCost > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${transportPct}%` }}
                      title={`${tr('পরিবহন')}: ${transportPct}%`}
                      className="bg-blue-500 transition-all duration-300"
                    />
                    <div
                      style={{ width: `${foodPct}%` }}
                      title={`${tr('খাবার')}: ${foodPct}%`}
                      className="bg-amber-500 transition-all duration-300"
                    />
                    <div
                      style={{ width: `${lodgingPct}%` }}
                      title={`${tr('আবাসন')}: ${lodgingPct}%`}
                      className="bg-emerald-600 transition-all duration-300"
                    />
                    <div
                      style={{ width: `${otherPct}%` }}
                      title={`${tr('অন্যান্য')}: ${otherPct}%`}
                      className="bg-purple-500 transition-all duration-300"
                    />
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-stone-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-stone-500">{tr('পরিবহন')} ({n(transportPct)}%)</span>
                        <strong className="text-stone-900 font-bold text-xs truncate">
                          ৳{n(totalTransportCost.toLocaleString())}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-stone-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-stone-500">{tr('খাবার')} ({n(foodPct)}%)</span>
                        <strong className="text-stone-900 font-bold text-xs truncate">
                          ৳{n(totalFoodCost.toLocaleString())}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-stone-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-stone-500">{tr('আবাসন')} ({n(lodgingPct)}%)</span>
                        <strong className="text-stone-900 font-bold text-xs truncate">
                          ৳{n(totalLodgingCost.toLocaleString())}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-stone-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-stone-500">{tr('অন্যান্য')} ({n(otherPct)}%)</span>
                        <strong className="text-stone-900 font-bold text-xs truncate">
                          ৳{n(totalOtherCost.toLocaleString())}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Day by Day Blueprint */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-stone-900">{tr('দিনভিত্তিক ভ্রমণসূচি খসড়া')}</h4>
              <div className="space-y-2">
                {Array.from({ length: days }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const currentDistrict =
                    selectedStops[idx % selectedStops.length] || startDistrict;
                  const info = DISTRICT_DETAILS[currentDistrict];

                  return (
                    <div
                      key={dayNum}
                      className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-black flex items-center justify-center shrink-0">
                        {n(dayNum)}
                      </span>
                      <div className="space-y-0.5">
                        <strong className="text-stone-800 block">
                          {lang === 'en' ? `Day ${dayNum}: explore ${currentDistrict}` : `দিন ${toBengaliNumber(dayNum)}: ${info?.bn || 'ভ্রমণ এলাকা'} এক্সপ্লোর`}
                        </strong>
                        <span className="text-stone-500">
                          {tr('বিখ্যাত দর্শনীয় স্থান:')} {info?.fam || tr('স্থানীয় প্রাকৃতিক স্থানসমূহ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {notes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <strong>{tr('নোট:')}</strong> {notes}
              </div>
            )}
          </div>

          {/* Packing Checklist */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center justify-between">
              <span>{tr('ভ্রমণ ব্যাগের চেকলিস্ট (Packing Checklist)')}</span>
              <span className="text-xs font-semibold text-stone-500">
                {toBengaliNumber(checklist.filter((i) => i.done).length)} / {toBengaliNumber(checklist.length)}
              </span>
            </h3>

            <div tabIndex={0} role="region" aria-label={tr('চেকলিস্ট')} className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    item.done
                      ? 'bg-emerald-50/60 text-emerald-900 line-through text-stone-400'
                      : 'hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span>{tr(item.text)}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-stone-100">
              <input
                type="text"
                placeholder={tr('+ নতুন কোনো প্রয়োজনীয় জিনিস লিখুন...')}
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCheckItem();
                }}
                className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
              <button
                type="button"
                onClick={addCheckItem}
                className="px-3 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                {tr('যোগ করুন')}
              </button>
            </div>
          </div>

          {/* Emergency Helplines Quick Card for Travelers */}
          <div className="bg-gradient-to-br from-rose-50/70 via-stone-50 to-white border border-rose-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>{tr('ভ্রমণকালীন জরুরি হেল্পলাইন ও সহায়তা (Emergency Helpline)')}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {tr('সরাসরি ট্যাপ করে জরুরি সেবায় যোগাযোগ করতে পারেন:')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="tel:01320222222"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-stone-800 transition-colors shadow-xs"
              >
                <div>
                  <strong className="block text-rose-950 font-bold">{tr('ট্যুরিস্ট পুলিশ বাংলাদেশ')}</strong>
                  <span className="text-[11px] text-stone-500">{tr('হটলাইন ও কন্ট্রোল রুম')}</span>
                </div>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg">01320-222222</span>
              </a>

              <a
                href="tel:999"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-400 text-stone-800 transition-colors shadow-xs"
              >
                <div>
                  <strong className="block text-stone-900 font-bold">{tr('জাতীয় জরুরি সেবা')}</strong>
                  <span className="text-[11px] text-stone-500">{tr('পুলিশ, অ্যাম্বুলেন্স, ফায়ার')}</span>
                </div>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">999</span>
              </a>

              <a
                href="tel:131"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-800 transition-colors shadow-xs"
              >
                <div>
                  <strong className="block text-stone-900 font-bold">{tr('রেলওয়ে হেল্পলাইন')}</strong>
                  <span className="text-[11px] text-stone-500">{tr('ট্রেন শিডিউল ও টিকিট')}</span>
                </div>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">131</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

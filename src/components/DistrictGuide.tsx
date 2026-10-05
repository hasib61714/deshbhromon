import { dialogProps } from '../lib/dialog';
import React, { useState, useEffect, useMemo } from 'react';
import { DISTRICT_DETAILS, DIVISIONS, toBengaliNumber } from '../data/bangladesh-data';
import { DistrictPlaceData, PlaceSpot } from '../types';
import {
  Search,
  MapPin,
  Utensils,
  Car,
  Hotel,
  Clock,
  ExternalLink,
  CheckCircle2,
  Star,
  Info,
  ChevronRight,
  X,
  Compass,
  CloudSun,
  Camera,
  Palette,
  Navigation,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { getDistrictImage } from '../data/landmark-images';
import { DistrictPhotoGallery } from './DistrictPhotoGallery';
import { DistrictMasonryGallery, getSpotPhotoInfo } from './DistrictMasonryGallery';

interface DistrictGuideProps {
  visited: Set<string>;
  wishlist: Set<string>;
  onToggleVisited: (district: string) => void;
  onToggleWishlist: (district: string) => void;
  initialDivision?: string;
  initialDistrict?: string | null;
}

export const DistrictGuide: React.FC<DistrictGuideProps> = ({
  visited,
  wishlist,
  onToggleVisited,
  onToggleWishlist,
  initialDivision = 'all',
  initialDistrict = null,
}) => {
  const [placesData, setPlacesData] = useState<Record<string, DistrictPlaceData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>(initialDivision);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(initialDistrict);
  const [selectedSpot, setSelectedSpot] = useState<PlaceSpot | null>(null);
  const [weatherDistrict, setWeatherDistrict] = useState<string>("Cox's Bazar");
  const [viewMode, setViewMode] = useState<'directory' | 'gallery'>('directory');
  const [modalTab, setModalTab] = useState<'info' | 'masonry'>('masonry');

  // Load places.json
  useEffect(() => {
    fetch('/places.json')
      .then((res) => res.json())
      .then((data) => {
        setPlacesData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const districtList = useMemo(() => {
    return Object.keys(DISTRICT_DETAILS).filter((id) => {
      const info = DISTRICT_DETAILS[id];
      const matchSearch =
        id.toLowerCase().includes(search.toLowerCase()) ||
        info.bn.includes(search) ||
        info.fam.includes(search);
      const matchDivision =
        selectedDivision === 'all' || info.dv === selectedDivision;
      return matchSearch && matchDivision;
    });
  }, [search, selectedDivision]);

  const activeDistrictData = selectedDistrict ? placesData[selectedDistrict] : null;
  const activeDistrictInfo = selectedDistrict ? DISTRICT_DETAILS[selectedDistrict] : null;

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>৬৪ জেলার ভ্রমণ সহায়িকা ও ভিজ্যুয়াল গ্যালারি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            কোথায় ঘুরবেন? দর্শনীয় স্থান ও ট্রাভেল গাইড
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            বাংলাদেশের প্রতিটি জেলার ইতিহাস, ঐতিহ্য, প্রাকৃতিক রূপ, সুস্বাদু খাবার ও যাতায়াতের
            তথ্য দেখে নিন এবং আপনার পছন্দের স্থানগুলো সরাসরি ভ্রমণ মানচিত্রে যুক্ত করুন।
          </p>

          {/* View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'directory'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>জেলা নির্দেশিকা ও আবহাওয়া</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('gallery')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'gallery'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>৬৪ জেলা ফটো গ্যালারি (Landmark Art)</span>
            </button>
          </div>
        </div>

        {viewMode === 'directory' && (
          /* Search & Filter Bar */
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="জেলা বা দর্শনীয় স্থান খুঁজুন (যেমন: রাতারগুল, মহাস্থানগড়, সেন্টমার্টিন)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            {/* Division Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedDivision('all')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedDivision === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                সব বিভাগ
              </button>
              {DIVISIONS.map((div) => {
                const isSelected = selectedDivision === div.id;
                return (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => setSelectedDivision(div.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {div.bn}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {viewMode === 'gallery' ? (
        <DistrictPhotoGallery
          visited={visited}
          wishlist={wishlist}
          onToggleVisited={onToggleVisited}
          onToggleWishlist={onToggleWishlist}
        />
      ) : (
        <>
          {/* Live District Weather Widget Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900 leading-tight">
                লাইভ আবহাওয়া পূর্বাভাস (Live District Weather)
              </h3>
              <p className="text-[11px] text-stone-500">
                যেকোনো জেলার বর্তমান তাপমাত্রা, আর্দ্রতা ও ৪ দিনের পূর্বাভাস দেখতে জেলা নির্বাচন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-600 shrink-0">জেলা নির্বাচন:</span>
            <select
              value={weatherDistrict}
              onChange={(e) => setWeatherDistrict(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
            >
              {Object.keys(DISTRICT_DETAILS).map((d) => (
                <option key={d} value={d}>
                  {DISTRICT_DETAILS[d].bn} ({DISTRICT_DETAILS[d].dvBn} বিভাগ)
                </option>
              ))}
            </select>
          </div>
        </div>

        <WeatherWidget
          districtId={weatherDistrict}
          districtNameBn={DISTRICT_DETAILS[weatherDistrict]?.bn || weatherDistrict}
        />
      </div>

      {/* Grid of Districts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districtList.map((districtId) => {
          const info = DISTRICT_DETAILS[districtId];
          const data = placesData[districtId];
          const isVisited = visited.has(districtId);
          const isWishlist = wishlist.has(districtId);
          const spotCount = data?.spots?.length || 0;
          const imageObj = getDistrictImage(districtId);

          return (
            <div
              key={districtId}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Destination Photo Banner */}
              <div
                onClick={() => setSelectedDistrict(districtId)}
                className="relative h-44 w-full overflow-hidden bg-stone-100 cursor-pointer"
              >
                <img
                  src={imageObj.url}
                  alt={info.bn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold flex items-center gap-1 drop-shadow-sm text-[11px] text-emerald-200">
                    <Camera className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="truncate max-w-[200px]">{imageObj.caption}</span>
                  </span>
                  <span className="bg-stone-900/70 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 shrink-0">
                    {info.dvBn}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* District Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        onClick={() => setSelectedDistrict(districtId)}
                        className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {info.bn}
                      </h3>
                      <span className="text-xs text-stone-500 font-medium">
                        {toBengaliNumber(spotCount)}টি দর্শনীয় স্থান
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleVisited(districtId)}
                        title={isVisited ? 'ঘুরেছেন' : 'ঘুরেছি হিসেবে চিহ্নিত করুন'}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isVisited
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-400 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(districtId)}
                        title={isWishlist ? 'ইচ্ছেতালিকায় আছে' : 'ইচ্ছেতালিকায় রাখুন'}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isWishlist
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-stone-100 text-stone-400 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isWishlist ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {data?.intro || info.fam}
                  </p>

                  {/* Spot Highlights */}
                  {data?.spots && data.spots.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        প্রধান আকর্ষণ:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.spots.slice(0, 3).map((sp, idx) => (
                          <span
                            key={idx}
                            onClick={() => {
                              setSelectedDistrict(districtId);
                              setSelectedSpot(sp);
                            }}
                            className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
                          >
                            {sp.n}
                          </span>
                        ))}
                        {data.spots.length > 3 && (
                          <span className="text-[11px] text-stone-400 self-center">
                            +{toBengaliNumber(data.spots.length - 3)}টি
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Food specialty */}
                  {data?.food && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/50">
                      <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{data.food}</span>
                    </div>
                  )}
                </div>

                {/* View Full Guide & Masonry Gallery Buttons */}
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(districtId);
                      setModalTab('masonry');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-900 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>মেসনারি গ্যালারি ({toBengaliNumber(spotCount)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(districtId);
                      setModalTab('info');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    <CloudSun className="w-3.5 h-3.5 text-sky-600" />
                    <span>গাইড</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* District Detail Modal */}
      {selectedDistrict && activeDistrictInfo && (
        <div {...dialogProps(() => { setSelectedDistrict(null); setSelectedSpot(null); }, activeDistrictInfo.bn)} className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto outline-none">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            {/* Scenic Landmark Image Banner in Modal */}
            <div className="relative h-60 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-2 overflow-hidden rounded-t-3xl bg-stone-900">
              <img
                src={getDistrictImage(selectedDistrict).url}
                alt={activeDistrictInfo.bn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <button aria-label="বন্ধ করুন"
                type="button"
                onClick={() => {
                  setSelectedDistrict(null);
                  setSelectedSpot(null);
                }}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  {activeDistrictInfo.dvBn} বিভাগ
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5 drop-shadow-md">
                  {activeDistrictInfo.bn} জেলা ভ্রমণ গাইড
                </h2>
                <span className="text-xs text-stone-200 mt-1 flex items-center gap-1.5 drop-shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{getDistrictImage(selectedDistrict).caption}</span>
                </span>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
              <button
                type="button"
                onClick={() => setModalTab('masonry')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'masonry'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Camera className="w-4 h-4 text-emerald-300" />
                <span>ল্যান্ডমার্ক মেসনারি ফটো গ্যালারি</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('info')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'info'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>ভ্রমণ নির্দেশিকা ও আবহাওয়া</span>
              </button>
            </div>

            {modalTab === 'masonry' ? (
              <DistrictMasonryGallery
                districtId={selectedDistrict}
                placesData={activeDistrictData}
              />
            ) : (
              <>
                {/* Current Weather Widget in Modal */}
                <WeatherWidget
                  districtId={selectedDistrict}
                  districtNameBn={activeDistrictInfo.bn}
                />

            {/* Travel Essentials Info Box */}
            {activeDistrictData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {activeDistrictData.go && (
                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-800">যাতায়াত:</strong>
                      <span className="text-stone-600">{activeDistrictData.go}</span>
                    </div>
                  </div>
                )}
                {activeDistrictData.food && (
                  <div className="flex items-start gap-2">
                    <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-800">বিখ্যাত খাবার:</strong>
                      <span className="text-stone-600">{activeDistrictData.food}</span>
                    </div>
                  </div>
                )}
                {activeDistrictData.stay && (
                  <div className="flex items-start gap-2">
                    <Hotel className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-800">থাকার ব্যবস্থা:</strong>
                      <span className="text-stone-600">{activeDistrictData.stay}</span>
                    </div>
                  </div>
                )}
                {activeDistrictData.time && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-800">ভ্রমণের উপযুক্ত সময়:</strong>
                      <span className="text-stone-600">{activeDistrictData.time}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Spots Accordion / List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-stone-900">
                  দর্শনীয় স্থানসমূহ ({toBengaliNumber(activeDistrictData?.spots?.length || 0)})
                </h3>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  বাস্তব ছবি ও লোকেশন যাচাইকৃত
                </span>
              </div>

              <div className="space-y-4">
                {activeDistrictData?.spots?.map((spot, idx) => {
                  const spotPhoto = selectedDistrict ? getSpotPhotoInfo(spot, selectedDistrict) : null;
                  const gMapsQuery = encodeURIComponent(`${spot.n} ${activeDistrictInfo?.bn || ''} বাংলাদেশ`);
                  const gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${gMapsQuery}`;

                  return (
                    <div
                      key={idx}
                      className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-white hover:border-emerald-300 transition-all shadow-xs flex flex-col md:flex-row gap-4"
                    >
                      {/* Authentic Spot Photo Thumbnail */}
                      {spotPhoto && (
                        <div className="w-full md:w-44 h-36 rounded-xl overflow-hidden relative shrink-0 bg-stone-900 border border-stone-200">
                          <img
                            src={spotPhoto.url}
                            alt={spot.n}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              const fallback = selectedDistrict ? getDistrictImage(selectedDistrict).url : null;
                              if (fallback && target.src !== fallback) target.src = fallback;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-1.5 left-2 right-2 text-[9px] text-emerald-200 truncate">
                            {spotPhoto.credit}
                          </div>
                        </div>
                      )}

                      {/* Spot Details */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-base text-stone-900 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{spot.n}</span>
                            </h4>
                            {spot.w && (
                              <span className="text-xs text-stone-400 font-medium block">
                                {spot.w}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {spot.best && (
                              <span className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                                {spot.best}
                              </span>
                            )}
                            <a
                              href={gMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all hover:scale-105"
                            >
                              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                              <span>গুগল ম্যাপে পথ</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600" />
                            </a>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {spot.d || spot.h}
                        </p>

                        {/* Practical Travel Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {spot.dur && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                              <Clock className="w-3 h-3 text-stone-500" />
                              <span>সময়: {spot.dur}</span>
                            </span>
                          )}
                          {spot.cost && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                              <Coins className="w-3 h-3 text-amber-600" />
                              <span>খরচ: {spot.cost}</span>
                            </span>
                          )}
                        </div>

                        {spot.how && (
                          <div className="text-[11px] text-stone-600 pt-2 border-t border-stone-100 flex items-start gap-1.5">
                            <Car className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-stone-800">যাওয়ার উপায়:</strong> {spot.how}
                            </div>
                          </div>
                        )}

                        {spot.tips && spot.tips.length > 0 && (
                          <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80">
                            <strong>স্থানীয় পরামর্শ:</strong> {spot.tips.join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  if (selectedDistrict) onToggleVisited(selectedDistrict);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedDistrict && visited.has(selectedDistrict)
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {selectedDistrict && visited.has(selectedDistrict)
                    ? 'ঘুরেছি (চিহ্নিত)'
                    : 'ঘুরেছি হিসেবে চিহ্নিত করুন'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDistrict(null);
                  setSelectedSpot(null);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

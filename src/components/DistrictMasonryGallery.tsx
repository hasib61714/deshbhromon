import { dialogProps } from '../lib/dialog';
import { SafeImage } from './SafeImage';
import React, { useState } from 'react';
import { DISTRICT_DETAILS, toBengaliNumber } from '../data/bangladesh-data';
import { getDistrictArtMeta, LandmarkCategory } from '../data/landmark-art';
import { DISTRICT_IMAGES } from '../data/landmark-images';
import { PlaceSpot, DistrictPlaceData } from '../types';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  X,
  Compass,
  MapPin,
  Clock,
  Layers,
  Palette,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Camera,
  Maximize2,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function getSpotPhotoInfo(spot: PlaceSpot, districtId: string): {
  url: string;
  credit: string;
  sourceUrl?: string;
  photographer?: string;
} {
  if (spot.img?.src) {
    const match = spot.img.src.match(/File:(.+)$/);
    if (match) {
      const filename = decodeURIComponent(match[1]);
      return {
        url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`,
        credit: spot.img.by ? `ছবি: ${spot.img.by} (${spot.img.lic || 'CC BY-SA 4.0'})` : 'ছবি: উইকিমিডিয়া কমন্স (CC BY-SA)',
        sourceUrl: spot.img.src,
        photographer: spot.img.by,
      };
    }
  }
  const dImg = DISTRICT_IMAGES[districtId];
  if (dImg) {
    return {
      url: dImg.url,
      credit: dImg.credit || `ছবি: ${dImg.photographer}`,
      sourceUrl: dImg.sourceUrl,
      photographer: dImg.photographer,
    };
  }
  return {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg?width=800',
    credit: 'ছবি: উইকিমিডিয়া কমন্স',
  };
}

export type TimeOfDay = 'sunrise' | 'daylight' | 'sunset' | 'night' | 'vintage';

interface DistrictMasonryGalleryProps {
  districtId: string;
  placesData?: DistrictPlaceData | null;
  onClose?: () => void;
}

export const DistrictMasonryGallery: React.FC<DistrictMasonryGalleryProps> = ({
  districtId,
  placesData,
  onClose,
}) => {
  const info = DISTRICT_DETAILS[districtId];
  const artMeta = info ? getDistrictArtMeta(districtId, info.bn, info.dvBn) : null;

  const [activeTimeOfDay, setActiveTimeOfDay] = useState<TimeOfDay>('sunset');
  const [activeSpotIndex, setActiveSpotIndex] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  if (!info || !artMeta) return null;

  // Extract landmark spots from places.json or fallback to curated landmarks
  const spots: PlaceSpot[] = placesData?.spots && placesData.spots.length > 0
    ? placesData.spots
    : [
        {
          n: artMeta.landmarkNameBn,
          d: info.fam,
          h: `${info.bn} জেলার প্রধান দর্শনীয় স্থান ও প্রাকৃতিক ঐতিহ্য।`,
          w: artMeta.landmarkNameEn,
        },
        {
          n: `${info.bn} ঐতিহাসিক কেন্দ্র ও নদীপথ`,
          d: "শান্ত নদীর কলতান ও গ্রামীন সবুজ রূপসী বাংলা।",
          h: "ঐতিহ্যবাহী নৌভ্রমণ এবং মনমাতানো পরিবেশ।",
          w: `${districtId} Historic Riverfront`,
        },
        {
          n: `${info.bn} প্রাকৃতিক উদ্যান ও প্রাচীন স্থাপত্য`,
          d: "শতবর্ষী বৃক্ষরাজি এবং প্রাচীন টেরাকোটা ও পুরাকীর্তি।",
          h: "প্রকৃতিপ্রেমী ভ্রমণপিপাসুদের অন্যতম পছন্দের স্থান।",
          w: `${districtId} Botanical Reserve & Heritage`,
        }
      ];

  // Lighting theme configurations
  const timePalettes: Record<TimeOfDay, { label: string; icon: any; top: string; mid: string; bottom: string; sunColor: string }> = {
    sunrise: {
      label: 'ভোরের সূর্যোদয় ও কুয়াশা',
      icon: Sunrise,
      top: '#0f172a',
      mid: '#9a3412',
      bottom: '#fb923c',
      sunColor: '#fed7aa',
    },
    daylight: {
      label: 'উজ্জ্বল প্রাকৃতিক দুপুর',
      icon: Sun,
      top: '#0284c7',
      mid: '#0284c7',
      bottom: '#38bdf8',
      sunColor: '#fef08a',
    },
    sunset: {
      label: 'গোধূলি ও সোনালি সূর্যাস্ত',
      icon: Sunset,
      top: '#1e1b4b',
      mid: '#831843',
      bottom: '#ea580c',
      sunColor: '#fde047',
    },
    night: {
      label: 'জ্যোৎস্না ও রাতের আকাশ',
      icon: Moon,
      top: '#020617',
      mid: '#090d16',
      bottom: '#172554',
      sunColor: '#e2e8f0',
    },
    vintage: {
      label: 'ভিন্টেজ আর্ট পোস্টার',
      icon: Palette,
      top: '#3f2e1a',
      mid: '#78532c',
      bottom: '#a4713c',
      sunColor: '#fef3c7',
    },
  };

  const currentPalette = timePalettes[activeTimeOfDay];

  // Specific spot silhouette builder with varied heights for authentic masonry feeling
  const renderSpotSilhouette = (category: LandmarkCategory, idx: number, heightClass: string) => {
    const isOdd = idx % 2 === 1;
    const isThird = idx % 3 === 2;

    return (
      <svg
        viewBox="0 0 400 320"
        preserveAspectRatio="none"
        className="w-full h-full pointer-events-none group-hover:scale-105 transition-transform duration-700"
      >
        <defs>
          <linearGradient id={`grad-${districtId}-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={currentPalette.top} />
            <stop offset="50%" stopColor={currentPalette.mid} />
            <stop offset="100%" stopColor={currentPalette.bottom} />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="400" height="320" fill={`url(#grad-${districtId}-${idx})`} />

        {/* Sun / Moon Orb */}
        <circle
          cx={isOdd ? "120" : "280"}
          cy={activeTimeOfDay === 'sunset' ? "180" : "80"}
          r={activeTimeOfDay === 'night' ? "24" : "34"}
          fill={currentPalette.sunColor}
          opacity={activeTimeOfDay === 'night' ? "0.85" : "0.75"}
        />

        {/* Flocks of birds or stars */}
        {activeTimeOfDay === 'night' ? (
          <g fill="#ffffff" opacity="0.6">
            <circle cx="50" cy="40" r="1.5" />
            <circle cx="90" cy="70" r="1.2" />
            <circle cx="160" cy="30" r="1.5" />
            <circle cx="220" cy="50" r="1" />
            <circle cx="340" cy="35" r="1.5" />
            <circle cx="370" cy="75" r="1.2" />
          </g>
        ) : (
          <g fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.5">
            <path d="M70,45 Q76,40 82,45 Q88,40 94,45" />
            <path d="M96,55 Q102,50 108,55 Q114,50 120,55" />
            <path d="M125,48 Q129,45 133,48 Q137,45 141,48" />
          </g>
        )}

        {/* Procedural Landscape Shapes */}
        {category === 'hills' || isOdd ? (
          <g>
            <path
              d="M0,170 L80,120 L160,180 L250,110 L340,170 L400,130 L400,320 L0,320 Z"
              fill={currentPalette.mid}
              opacity="0.7"
            />
            <path
              d="M0,200 L90,150 L190,210 L280,140 L370,195 L400,175 L400,320 L0,320 Z"
              fill={currentPalette.bottom}
              opacity="0.85"
            />
            <path
              d="M0,240 C120,215 240,250 400,225 L400,320 L0,320 Z"
              fill="#09090b"
              opacity="0.95"
            />
          </g>
        ) : category === 'beach' ? (
          <g>
            <path
              d="M0,210 C80,200 160,220 240,205 C320,195 400,215 400,215 L400,320 L0,320 Z"
              fill={currentPalette.mid}
              opacity="0.75"
            />
            <path
              d="M0,240 C100,225 220,250 400,230 L400,320 L0,320 Z"
              fill={currentPalette.bottom}
              opacity="0.9"
            />
            {/* Wooden boat */}
            <path
              d="M240,225 C255,228 280,228 295,222 C298,222 292,235 265,235 C245,235 238,225 240,225 Z"
              fill="#09090b"
            />
            <line x1="265" y1="222" x2="265" y2="202" stroke="#09090b" strokeWidth="2" />
            <path d="M265,204 L278,214 L265,214 Z" fill="#ffffff" opacity="0.85" />
          </g>
        ) : category === 'tea' ? (
          <g>
            <path
              d="M-20,180 C80,150 180,190 280,160 C340,140 420,170 420,320 L-20,320 Z"
              fill={currentPalette.mid}
              opacity="0.75"
            />
            <path
              d="M-20,220 C90,190 200,230 310,200 C370,185 420,215 420,320 L-20,320 Z"
              fill={currentPalette.bottom}
              opacity="0.9"
            />
            <path
              d="M0,255 Q50,245 100,255 Q150,265 200,255 Q250,245 300,255 Q350,265 400,255 L400,320 L0,320 Z"
              fill="#022c22"
            />
          </g>
        ) : (
          /* Heritage or River */
          <g>
            <path
              d="M120,240 L120,165 C120,145 140,135 155,135 C170,135 185,145 185,165 L185,240 Z"
              fill={currentPalette.mid}
              opacity="0.75"
            />
            <path
              d="M175,240 L175,150 C175,125 200,110 220,110 C240,110 260,125 260,150 L260,240 Z"
              fill={currentPalette.bottom}
              opacity="0.9"
            />
            <rect x="90" y="130" width="8" height="110" fill={currentPalette.bottom} />
            <polygon points="94,115 88,130 100,130" fill={currentPalette.sunColor} />
            <rect x="290" y="130" width="8" height="110" fill={currentPalette.bottom} />
            <polygon points="294,115 288,130 300,130" fill={currentPalette.sunColor} />
            <rect x="0" y="240" width="400" height="80" fill="#09090b" />
          </g>
        )}
      </svg>
    );
  };

  const handleDownloadSpot = (spot: PlaceSpot, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Linear gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 900);
    grad.addColorStop(0, currentPalette.top);
    grad.addColorStop(0.5, currentPalette.mid);
    grad.addColorStop(1, currentPalette.bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 900);

    // Decorative frame
    ctx.strokeStyle = currentPalette.sunColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 840);

    // Typography & Branding
    ctx.fillStyle = currentPalette.sunColor;
    ctx.font = 'bold 24px "Anek Bangla", sans-serif';
    ctx.fillText(`দেশভ্রমণ · ${info.dvBn} বিভাগ`, 60, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 54px "Anek Bangla", sans-serif';
    ctx.fillText(`${spot.n}`, 60, 170);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 28px "Anek Bangla", sans-serif';
    ctx.fillText(`📍 ${info.bn} জেলা (${spot.w || districtId})`, 60, 220);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 20px "Anek Bangla", sans-serif';
    const descText = spot.d || info.fam;
    ctx.fillText(descText.slice(0, 80), 60, 270);

    // Style mode
    ctx.fillStyle = currentPalette.sunColor;
    ctx.font = 'bold 18px "Anek Bangla", sans-serif';
    ctx.fillText(`ফিল্টার: ${currentPalette.label}`, 60, 820);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Anek Bangla", sans-serif';
    ctx.fillText('দেশভ্রমণ (DeshBhromon) · মোঃ হাসিবুল হাসান', 1140, 820);

    const link = document.createElement('a');
    link.download = `DeshBhromon-${info.bn}-${spot.n}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const activeSpot = activeSpotIndex !== null ? spots[activeSpotIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header & Style Generator Toolbar */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>{info.bn} জেলার ছবির গ্যালারি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {info.bn} জেলার দর্শনীয় স্থান ও ভিজ্যুয়াল আর্ট
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {info.fam}
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer self-start sm:self-center"
             aria-label="বন্ধ করুন">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Time of Day & Visual Style Switcher */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 shrink-0">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>আলোকচিত্র ও স্টাইল জেনারেটর:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
            {(Object.keys(timePalettes) as TimeOfDay[]).map((timeKey) => {
              const pal = timePalettes[timeKey];
              const IconComp = pal.icon;
              const isSelected = activeTimeOfDay === timeKey;

              return (
                <button
                  key={timeKey}
                  type="button"
                  onClick={() => setActiveTimeOfDay(timeKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs scale-105'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{pal.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Masonry Grid (CSS Columns Layout) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>div]:break-inside-avoid [&>div]:mb-5">
        {spots.map((spot, idx) => {
          // Varied height presets to achieve dynamic staggered masonry appearance
          const heightClasses = [
            'h-72',
            'h-96',
            'h-80',
            'h-88',
            'h-76',
            'h-92'
          ];
          const heightClass = heightClasses[idx % heightClasses.length];
          const photoInfo = getSpotPhotoInfo(spot, districtId);

          return (
            <div
              key={idx}
              onClick={() => setActiveSpotIndex(idx)}
              className={`group relative overflow-hidden rounded-3xl cursor-pointer border border-stone-800 shadow-md hover:shadow-2xl transition-all duration-300 bg-stone-950 ${heightClass}`}
            >
              {/* Authentic Landmark Image */}
              <SafeImage
                src={photoInfo.url}
                alt={spot.n}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fallbackSrc={DISTRICT_IMAGES[districtId]?.url}
              />

              {/* Atmospheric lighting overlay according to selected style */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={{
                  background:
                    activeTimeOfDay === 'daylight'
                      ? 'linear-gradient(to top, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.3) 40%, rgba(0,0,0,0) 80%)'
                      : activeTimeOfDay === 'sunset'
                      ? 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(131,24,67,0.35) 45%, rgba(234,88,12,0.2) 100%)'
                      : activeTimeOfDay === 'sunrise'
                      ? 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(154,52,18,0.35) 45%, rgba(251,146,60,0.2) 100%)'
                      : activeTimeOfDay === 'night'
                      ? 'linear-gradient(to top, rgba(2,6,23,0.98) 0%, rgba(9,13,22,0.6) 50%, rgba(23,37,84,0.35) 100%)'
                      : 'linear-gradient(to top, rgba(63,46,26,0.95) 0%, rgba(120,83,44,0.35) 50%, rgba(164,113,60,0.2) 100%)',
                }}
              />

              {/* Top Controls */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white border border-white/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>অরজিনাল ফটো #{toBengaliNumber(idx + 1)}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleDownloadSpot(spot, idx, e)}
                    title="ছবি ডাউনলোড করুন"
                    className="p-1.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/85 text-white border border-white/20 transition-transform active:scale-90"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSpotIndex(idx);
                    }}
                    title="ফুলস্ক্রিনে দেখুন"
                    className="p-1.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/85 text-white border border-white/20 transition-transform active:scale-90"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Content Info */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  <span>{info.bn} জেলা · {info.dvBn} বিভাগ</span>
                </div>

                <h3 className="text-xl font-black text-white drop-shadow-md leading-tight group-hover:text-emerald-200 transition-colors">
                  {spot.n}
                </h3>

                {spot.w && (
                  <span className="text-[11px] text-stone-300 font-semibold block">
                    {spot.w}
                  </span>
                )}

                <p className="text-xs text-stone-200/90 line-clamp-2 leading-relaxed pt-0.5">
                  {spot.d || spot.h}
                </p>

                {/* Real Photographer Attribution */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-300 border-t border-white/10 mt-2">
                  <div className="flex items-center gap-1 text-[10px] text-stone-300 truncate max-w-[70%]">
                    <Camera className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{photoInfo.credit}</span>
                  </div>

                  <span className="text-[10px] text-amber-300 font-semibold shrink-0">
                    {currentPalette.label.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spot Detail Lightbox Modal */}
      {activeSpot && activeSpotIndex !== null && (
        <div {...dialogProps(() => setActiveSpotIndex(null), "দর্শনীয় স্থানের ছবি")} className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto outline-none">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button aria-label="বন্ধ করুন"
              type="button"
              onClick={() => setActiveSpotIndex(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header with Authentic Photo */}
            {(() => {
              const modalPhoto = getSpotPhotoInfo(activeSpot, districtId);
              return (
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-950">
                  <SafeImage
                    src={modalPhoto.url}
                    alt={activeSpot.n}
                    className="w-full h-full object-cover"
                fallbackSrc={DISTRICT_IMAGES[districtId]?.url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

                  <div className="absolute bottom-5 left-6 right-6 z-10">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                      {info.bn} জেলা · {info.dvBn} বিভাগ
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-md">
                      {activeSpot.n}
                    </h2>
                    <div className="flex items-center justify-between pt-1">
                      {activeSpot.w && (
                        <span className="text-xs text-stone-300 font-semibold block">
                          {activeSpot.w}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{modalPhoto.credit}</span>
                        {modalPhoto.sourceUrl && (
                          <a
                            href={modalPhoto.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-emerald-200 underline ml-1 inline-flex items-center gap-0.5"
                          >
                            <span>উৎস</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Highlight / Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  স্থানটির বিবরণ ও আকর্ষণ:
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  {activeSpot.h || activeSpot.d || info.fam}
                </p>
              </div>

              {/* Travel Info if available */}
              {(activeSpot.how || activeSpot.best) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeSpot.how && (
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 space-y-1">
                      <strong className="block font-bold">যাতায়াত ব্যবস্থা:</strong>
                      <span className="text-blue-800">{activeSpot.how}</span>
                    </div>
                  )}
                  {activeSpot.best && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-950 space-y-1">
                      <strong className="block font-bold">উপযুক্ত সময়:</strong>
                      <span className="text-amber-800">{activeSpot.best}</span>
                    </div>
                  )}
                </div>
              )}

              {/* AI Image Generation Prompt Card */}
              <div className="bg-slate-950 text-white p-4 sm:p-5 rounded-2xl space-y-2.5 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Landmark Photo Prompt ({currentPalette.label}):</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyPrompt(
                        `Cinematic photorealistic view of ${activeSpot.n} (${activeSpot.w || districtId}) in ${districtId}, Bangladesh during ${activeTimeOfDay}, editorial travel photography, 8k resolution.`
                      )
                    }
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
                  "Cinematic photorealistic view of {activeSpot.n} ({activeSpot.w || districtId}) in {districtId}, Bangladesh during {activeTimeOfDay}, editorial travel photography, ultra-detailed 8k."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={(e) => handleDownloadSpot(activeSpot, activeSpotIndex, e)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>এইচডি ছবি ডাউনলোড করুন (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSpotIndex(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

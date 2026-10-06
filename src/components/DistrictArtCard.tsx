import React, { useState } from 'react';
import {
  DISTRICT_DETAILS
} from '../data/bangladesh-data';
import {
  getDistrictArtMeta,
  LandmarkCategory
} from '../data/landmark-art';
import { DISTRICT_IMAGES } from '../data/landmark-images';
import { loadCommonsImageForCanvas } from '../lib/commonsImage';
import {
  Sparkles,
  Download,
  Compass
} from 'lucide-react';

interface DistrictArtCardProps {
  districtId: string;
  onOpenDetails?: () => void;
  aspect?: 'card' | 'banner';
}

export const DistrictArtCard: React.FC<DistrictArtCardProps> = ({
  districtId,
  onOpenDetails,
  aspect = 'card',
}) => {
  const info = DISTRICT_DETAILS[districtId];
  // Real, credited Wikimedia Commons photo; the illustrated art stays as the fallback
  const photo = DISTRICT_IMAGES[districtId];
  const [photoState, setPhotoState] = useState<'loading' | 'ok' | 'failed'>('loading');
  const [note, setNote] = useState<string>('');
  if (!info) return null;
  const showPhoto = !!photo && photoState === 'ok';

  const art = getDistrictArtMeta(districtId, info.bn, info.dvBn);
  const [gTop, gMid, gBottom] = art.gradient;

  const renderSilhouette = (cat: LandmarkCategory) => {
    switch (cat) {
      case 'beach':
        return (
          <g>
            {/* Sun / Sunset Orb */}
            <circle cx="200" cy="90" r="32" fill="#fbbf24" opacity="0.9" filter="blur(1px)" />
            {/* Birds */}
            <path d="M70,45 Q76,40 82,45 Q88,40 94,45" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
            <path d="M100,55 Q105,51 110,55 Q115,51 120,55" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
            {/* Ocean Waves */}
            <path
              d="M0,170 C60,160 120,175 180,165 C240,155 300,175 360,165 C400,160 400,240 0,240 Z"
              fill={gMid}
              opacity="0.8"
            />
            <path
              d="M0,190 C70,180 140,195 210,185 C280,175 350,195 400,188 L400,240 L0,240 Z"
              fill={gBottom}
              opacity="0.95"
            />
            {/* Wooden Sampan Boat silhouette */}
            <path
              d="M260,175 C275,178 300,178 315,172 C318,172 312,185 285,185 C265,185 258,175 260,175 Z"
              fill="#0f172a"
            />
            <line x1="285" y1="172" x2="285" y2="155" stroke="#0f172a" strokeWidth="1.8" />
            <path d="M285,156 L298,166 L285,166 Z" fill="#ffffff" opacity="0.85" />
          </g>
        );

      case 'hills':
        return (
          <g>
            {/* Glowing moon or high mountain sun */}
            <circle cx="310" cy="70" r="28" fill="#e0f2fe" opacity="0.8" />
            {/* Distant mountain layer */}
            <path
              d="M0,140 L70,85 L150,135 L230,75 L310,130 L400,80 L400,240 L0,240 Z"
              fill={gMid}
              opacity="0.6"
            />
            {/* Mid mountain layer with mist */}
            <path
              d="M0,160 L90,115 L180,165 L270,110 L360,155 L400,135 L400,240 L0,240 Z"
              fill={gBottom}
              opacity="0.8"
            />
            {/* Foreground ridge */}
            <path
              d="M0,195 C100,175 200,205 300,185 C350,175 400,190 400,190 L400,240 L0,240 Z"
              fill="#09090b"
              opacity="0.95"
            />
            {/* Cloud wisps */}
            <path
              d="M40,120 Q90,115 140,120 Q180,125 210,120"
              stroke="#ffffff"
              strokeWidth="4"
              opacity="0.25"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'tea':
        return (
          <g>
            {/* Sunrise in mist */}
            <circle cx="200" cy="80" r="30" fill="#fef08a" opacity="0.75" />
            {/* Tea rolling hills */}
            <path
              d="M-20,150 C80,120 180,160 280,130 C340,110 420,140 420,240 L-20,240 Z"
              fill={gMid}
              opacity="0.7"
            />
            <path
              d="M-20,180 C90,150 200,190 310,160 C370,145 420,175 420,240 L-20,240 Z"
              fill={gBottom}
              opacity="0.9"
            />
            {/* Tea bush contours */}
            <path
              d="M0,205 Q50,195 100,205 Q150,215 200,205 Q250,195 300,205 Q350,215 400,205 L400,240 L0,240 Z"
              fill="#052e16"
            />
          </g>
        );

      case 'mangrove':
        return (
          <g>
            {/* Mystic morning moon */}
            <circle cx="90" cy="70" r="26" fill="#a7f3d0" opacity="0.6" />
            {/* Forest horizon */}
            <path
              d="M0,135 Q30,125 60,135 Q90,120 130,135 Q170,125 210,135 Q260,120 300,135 Q350,125 400,135 L400,240 L0,240 Z"
              fill={gMid}
              opacity="0.75"
            />
            {/* River creek water */}
            <path
              d="M0,185 C100,175 220,195 400,180 L400,240 L0,240 Z"
              fill={gBottom}
              opacity="0.9"
            />
            {/* Mangrove tree & roots silhouette */}
            <path
              d="M320,185 L325,140 C325,130 310,125 315,115 C325,110 345,115 345,125 L350,140 L355,185 Z"
              fill="#022c22"
            />
            <path
              d="M305,185 C315,170 330,160 335,145 M340,145 C345,160 360,170 365,185"
              stroke="#022c22"
              strokeWidth="3"
              fill="none"
            />
          </g>
        );

      case 'heritage':
        return (
          <g>
            {/* Historic sunset sky */}
            <circle cx="200" cy="85" r="32" fill="#fed7aa" opacity="0.8" />
            {/* Domes and Arches silhouette */}
            <path
              d="M130,180 L130,125 C130,110 145,100 160,100 C175,100 190,110 190,125 L190,180 Z"
              fill={gMid}
              opacity="0.7"
            />
            <path
              d="M185,180 L185,115 C185,95 205,85 225,85 C245,85 265,95 265,115 L265,180 Z"
              fill={gBottom}
              opacity="0.9"
            />
            {/* Central grand archway */}
            <path
              d="M170,180 C170,145 190,130 200,130 C210,130 230,145 230,180 Z"
              fill="#09090b"
            />
            {/* Minarets */}
            <rect x="100" y="90" width="8" height="90" fill={gBottom} opacity="0.85" />
            <polygon points="104,78 98,90 110,90" fill={art.accentColor} />
            <rect x="290" y="90" width="8" height="90" fill={gBottom} opacity="0.85" />
            <polygon points="294,78 288,90 300,90" fill={art.accentColor} />
            <rect x="0" y="180" width="400" height="60" fill="#09090b" />
          </g>
        );

      default:
        // River & rural boat
        return (
          <g>
            {/* Golden sun */}
            <circle cx="270" cy="75" r="28" fill="#fde047" opacity="0.8" />
            {/* Riverbank */}
            <path
              d="M0,150 C120,135 240,160 400,145 L400,240 L0,240 Z"
              fill={gMid}
              opacity="0.75"
            />
            <path
              d="M0,185 C140,170 260,195 400,180 L400,240 L0,240 Z"
              fill={gBottom}
              opacity="0.9"
            />
            {/* Traditional boat */}
            <path
              d="M120,175 C135,178 165,178 180,172 C185,172 178,185 150,185 C130,185 120,175 120,175 Z"
              fill="#09090b"
            />
            <line x1="150" y1="172" x2="150" y2="152" stroke="#09090b" strokeWidth="1.8" />
            <path d="M150,154 L165,164 L150,164 Z" fill="#ffffff" opacity="0.85" />
          </g>
        );
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await Promise.all([700, 800].map((w) => document.fonts.load(`${w} 24px "Anek Bangla"`, 'বাংলাদেশ'))).catch(() => undefined);

    // Create high-res artwork canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The photo must be loaded with CORS or the canvas could not be exported; if that fails we
    // fall back to the illustrated card instead of failing the download.
    const img = photo ? await loadCommonsImageForCanvas(photo.url, 1200) : null;

    if (img) {
      const r = Math.max(1200 / img.naturalWidth, 800 / img.naturalHeight);
      const w = img.naturalWidth * r;
      const h = img.naturalHeight * r;
      ctx.drawImage(img, (1200 - w) / 2, (800 - h) / 2, w, h);
      const shade = ctx.createLinearGradient(0, 0, 0, 800);
      shade.addColorStop(0, 'rgba(0,0,0,0.55)');
      shade.addColorStop(0.35, 'rgba(0,0,0,0.05)');
      shade.addColorStop(0.6, 'rgba(0,0,0,0.15)');
      shade.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, 1200, 800);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, 800);
      gradient.addColorStop(0, gTop);
      gradient.addColorStop(0.5, gMid);
      gradient.addColorStop(1, gBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);
      const vignette = ctx.createRadialGradient(600, 400, 200, 600, 400, 700);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 1200, 800);
    }

    // Decorative Borders
    ctx.strokeStyle = img ? '#fbbf24' : art.accentColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.textAlign = 'left';
    ctx.fillStyle = img ? '#fbbf24' : art.accentColor;
    ctx.font = '700 22px "Anek Bangla", sans-serif';
    ctx.fillText(`দেশভ্রমণ · ${info.dvBn} বিভাগ`, 64, 92);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 78px "Anek Bangla", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 14;
    // With a photo the name sits at the bottom so the picture stays clear; the illustrated card keeps the top layout
    ctx.fillText(`${info.bn} জেলা`, 64, img ? 640 : 175);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 28px "Anek Bangla", sans-serif';
    // Describe what the picture really shows (the photo caption), not the generic art subtitle
    ctx.fillText(img && photo ? photo.caption : art.landmarkNameBn, 64, img ? 690 : 225);
    if (!img) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 20px "Anek Bangla", sans-serif';
      ctx.fillText(info.fam, 64, 275);
    }

    // Licence-required credit, printed on the image itself
    if (img && photo) {
      const credit = `ছবি: ${photo.photographer ?? 'উইকিমিডিয়া কমন্স'}${photo.license ? ` · ${photo.license}` : ''} · Wikimedia Commons`;
      ctx.font = '500 17px "Anek Bangla", sans-serif';
      let text = credit;
      while (ctx.measureText(text).width > 760 && text.length > 20) text = `${text.slice(0, -2)}…`;
      const tw = ctx.measureText(text).width;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.roundRect(64, 716, tw + 28, 34, 17);
      ctx.fill();
      ctx.fillStyle = '#e5e7eb';
      ctx.fillText(text, 78, 740);
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = img ? '#fbbf24' : art.accentColor;
    ctx.font = '700 22px "Anek Bangla", sans-serif';
    ctx.fillText('দেশভ্রমণ (DeshBhromon)', 1140, 740);

    // Download trigger
    const link = document.createElement('a');
    link.download = `DeshBhromon-Inspiration-${districtId.replace(/[^A-Za-z0-9]+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setNote(img ? 'ছবিসহ কার্ড ডাউনলোড হয়েছে' : 'ছবি আনা যায়নি, আঁকা কার্ড ডাউনলোড হয়েছে');
    setTimeout(() => setNote(''), 5000);
  };

  return (
    <div
      onClick={onOpenDetails}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer border border-white/20 shadow-md hover:shadow-xl hover:border-emerald-400/50 transition-all ${
        aspect === 'banner' ? 'h-52 sm:h-64' : 'h-64 sm:h-72'
      }`}
      style={{
        background: `linear-gradient(180deg, ${gTop} 0%, ${gMid} 55%, ${gBottom} 100%)`,
      }}
    >
      {/* Real photo (Wikimedia Commons); the illustration below is shown until it loads and if it fails */}
      {photo && photoState !== 'failed' && (
        <img
          src={photo.url}
          alt={photo.caption}
          loading="lazy"
          decoding="async"
          onLoad={() => setPhotoState('ok')}
          onError={() => setPhotoState('failed')}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700 ${showPhoto ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Dynamic SVG Landmark Silhouette */}
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none group-hover:scale-105 transition-transform duration-700 ${showPhoto ? 'hidden' : ''}`}
      >
        {renderSilhouette(art.category)}
      </svg>

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent pointer-events-none" />

      {/* Top Bar Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white border border-white/20">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{info.dvBn} বিভাগ</span>
        </span>

        <button
          type="button"
          onClick={handleDownload}
          title="এইচডি আর্ট কার্ড ডাউনলোড করুন"
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white border border-white/20 transition-transform active:scale-90"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      <p role="status" aria-live="polite" className={note ? 'absolute top-14 left-3.5 right-3.5 z-20 text-[11px] font-semibold text-white bg-black/70 rounded-lg px-2 py-1' : 'sr-only'}>
        {note}
      </p>

      {/* Bottom Content Area */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-1">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight group-hover:text-emerald-200 transition-colors">
            {info.bn}
          </h3>
          <span className="text-[10px] text-stone-300 font-semibold uppercase tracking-wider">
            {districtId}
          </span>
        </div>

        <p className="text-xs text-emerald-200 font-semibold flex items-center gap-1 drop-shadow-sm truncate">
          <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">{showPhoto && photo ? photo.caption : art.landmarkNameBn}</span>
        </p>

        <p className="text-[11px] text-stone-300/90 line-clamp-1 leading-snug pt-0.5">
          {info.fam}
        </p>
        {showPhoto && photo && (
          <p className="text-[10px] text-stone-300/80 truncate leading-snug">
            ছবি: {photo.photographer ?? 'উইকিমিডিয়া কমন্স'}
            {photo.license ? ` · ${photo.license}` : ''}
          </p>
        )}
      </div>
    </div>
  );
};

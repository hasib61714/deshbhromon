import { dialogProps } from '../lib/dialog';
import React, { useState } from 'react';
import { getTravelerBadge, toBengaliNumber } from '../data/bangladesh-data';
import { X, Download, Award } from 'lucide-react';

interface TravelerCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelerName: string;
  onTravelerNameChange: (name: string) => void;
  visitedCount: number;
  wishlistCount: number;
}

const NOTE = 'নিজের চিহ্নিত ভ্রমণ তথ্য অনুযায়ী তৈরি স্মারক সনদ। এটি সরকারি বা যাচাইকৃত সনদ নয়।';

export const TravelerCertificateModal: React.FC<TravelerCertificateModalProps> = ({
  isOpen,
  onClose,
  travelerName,
  onTravelerNameChange,
  visitedCount,
}) => {
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const badge = getTravelerBadge(visitedCount);
  const name = travelerName.trim() || 'ভ্রমণকারী';
  const hasTrips = visitedCount > 0;
  const percentage = Math.round((visitedCount / 64) * 100);
  const todayStr = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

  // Shrink long text so it always fits inside the certificate
  const fitText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) => {
    let size = parseInt(ctx.font.match(/(\d+)px/)?.[1] ?? '20', 10);
    const family = ctx.font.replace(/^.*?\d+px\s*/, '');
    const weight = ctx.font.split(/\s+/)[0];
    while (ctx.measureText(text).width > maxWidth && size > 12) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${family}`;
    }
    ctx.fillText(text, x, y);
  };

  const handleDownloadCertificate = async () => {
    setBusy(true);
    try {
      // Make sure the Bangla font is ready before drawing on the canvas
      await Promise.all([
        document.fonts.load('700 24px "Anek Bangla"', 'বাংলাদেশ'),
        document.fonts.load('500 20px "Anek Bangla"', 'বাংলাদেশ'),
      ]).catch(() => undefined);

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#faf9f6';
      ctx.fillRect(0, 0, 1200, 800);
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 1160, 760);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(34, 34, 1132, 732);
      ctx.fillStyle = '#064e3b';
      for (const [x, y] of [[16, 16], [1158, 16], [16, 758], [1158, 758]]) ctx.fillRect(x, y, 26, 26);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#042f2e';
      ctx.font = '800 40px "Anek Bangla", sans-serif';
      ctx.fillText('দেশভ্রমণ ভ্রমণ সনদ', 600, 115);
      ctx.fillStyle = '#b45309';
      ctx.font = '700 18px "Anek Bangla", sans-serif';
      ctx.fillText('DESHBHROMON · TRAVEL CERTIFICATE', 600, 150);

      ctx.fillStyle = '#64748b';
      ctx.font = '600 18px "Anek Bangla", sans-serif';
      ctx.fillText('এই সনদ দেওয়া হলো', 600, 225);

      ctx.fillStyle = '#064e3b';
      ctx.font = '800 54px "Anek Bangla", sans-serif';
      fitText(ctx, name, 600, 295, 900);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 320);
      ctx.lineTo(900, 320);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = '500 22px "Anek Bangla", sans-serif';
      ctx.fillText(`বাংলাদেশের ৬৪টি জেলার মধ্যে ${toBengaliNumber(visitedCount)}টি জেলা ঘোরা হয়েছে`, 600, 375);
      ctx.fillText(`অর্থাৎ ৬৪ জেলার প্রায় ${toBengaliNumber(percentage)}%`, 600, 413);

      ctx.fillStyle = '#ecfdf5';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(350, 455, 500, 74, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#065f46';
      ctx.font = '700 26px "Anek Bangla", sans-serif';
      fitText(ctx, `${badge.title} (${badge.en})`, 600, 502, 460);

      ctx.fillStyle = '#475569';
      ctx.font = '500 17px "Anek Bangla", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`তারিখ: ${todayStr}`, 100, 690);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#047857';
      ctx.font = '700 20px "Anek Bangla", sans-serif';
      ctx.fillText('দেশভ্রমণ · DeshBhromon', 1100, 690);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 14px "Anek Bangla", sans-serif';
      ctx.fillText(NOTE, 600, 740);

      const link = document.createElement('a');
      link.download = `DeshBhromon-Certificate-${name.replace(/[^\p{L}\p{N}]+/gu, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      {...dialogProps(onClose, 'ভ্রমণ সনদ')}
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto outline-none"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 text-center space-y-5 bg-[#faf9f6] border-8 border-emerald-900 m-3 sm:m-4 rounded-2xl">
          <div className="space-y-1 pt-3">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block">DeshBhromon · Travel Certificate</span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">দেশভ্রমণ ভ্রমণ সনদ</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="cert-name" className="text-xs text-stone-500 block">সনদে যে নাম থাকবে</label>
            <input
              id="cert-name"
              type="text"
              value={travelerName}
              maxLength={60}
              placeholder="আপনার নাম লিখুন"
              onChange={(e) => onTravelerNameChange(e.target.value)}
              className="w-full max-w-sm mx-auto text-center text-2xl sm:text-3xl font-black text-emerald-800 bg-transparent border-b-2 border-stone-300 focus:border-emerald-600 focus:outline-none py-1 placeholder:text-stone-300 placeholder:font-semibold"
            />
            {hasTrips ? (
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed pt-1">
                বাংলাদেশের ৬৪ জেলার মধ্যে <strong>{toBengaliNumber(visitedCount)}টি</strong> জেলা ঘোরা হয়েছে।
              </p>
            ) : (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-md mx-auto">
                সনদ বানাতে আগে “আমার ম্যাপ” থেকে অন্তত একটি ঘোরা জেলা চিহ্নিত করুন।
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-sm sm:text-base">
            <Award className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
            <span>{badge.title} ({badge.en})</span>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-1.5">
            <span>তারিখ: {todayStr}</span>
            <span className="font-semibold text-emerald-800">দেশভ্রমণ · DeshBhromon</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">{NOTE}</p>
        </div>

        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-100 flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-bold">
            বন্ধ করুন
          </button>
          <button
            type="button"
            onClick={handleDownloadCertificate}
            disabled={!hasTrips || busy}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{busy ? 'তৈরি হচ্ছে…' : 'সনদ ডাউনলোড (PNG)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

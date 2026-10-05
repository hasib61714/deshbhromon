import React, { useRef } from 'react';
import { getTravelerBadge, toBengaliNumber } from '../data/bangladesh-data';
import { X, Download, Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface TravelerCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelerName: string;
  visitedCount: number;
  wishlistCount: number;
}

export const TravelerCertificateModal: React.FC<TravelerCertificateModalProps> = ({
  isOpen,
  onClose,
  travelerName,
  visitedCount,
  wishlistCount,
}) => {
  const certRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const badge = getTravelerBadge(visitedCount);
  const percentage = Math.round((visitedCount / 64) * 100);
  const todayStr = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownloadCertificate = () => {
    // Canvas-based certificate generator for crisp HD output
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#faf9f6';
    ctx.fillRect(0, 0, 1200, 800);

    // Border Frame (Royal Emerald & Gold)
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 1160, 760);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, 1132, 732);

    // Decorative corners
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(16, 16, 26, 26);
    ctx.fillRect(1158, 16, 26, 26);
    ctx.fillRect(16, 758, 26, 26);
    ctx.fillRect(1158, 758, 26, 26);

    // Top Emblem / Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#042f2e';
    ctx.font = 'bold 36px "Anek Bangla", sans-serif';
    ctx.fillText('দেশভ্রমণ · বাংলাদেশ পর্যটক সনদপত্র', 600, 110);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 18px "Anek Bangla", sans-serif';
    ctx.fillText('BANGLADESH EXPLORER OFFICIAL CERTIFICATE', 600, 145);

    // Watermark / Seal
    ctx.fillStyle = '#64748b';
    ctx.font = '600 16px "Anek Bangla", sans-serif';
    ctx.fillText('এই প্রত্যয়নপত্রটি সগৌরবে প্রদান করা হচ্ছে', 600, 220);

    // Traveler Name
    ctx.fillStyle = '#064e3b';
    ctx.font = 'black 48px "Anek Bangla", sans-serif';
    ctx.fillText(travelerName.trim() || 'মোঃ হাসিবুল হাসান', 600, 290);

    // Line under name
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 315);
    ctx.lineTo(850, 315);
    ctx.stroke();

    // Achievement text
    ctx.fillStyle = '#334155';
    ctx.font = '500 20px "Anek Bangla", sans-serif';
    ctx.fillText(
      `যিনি বাংলাদেশের ৬৪টি জেলার মধ্যে সফলভাবে ${toBengaliNumber(visitedCount)}টি জেলা ভ্রমণ ও অন্বেষণ করেছেন`,
      600,
      365
    );

    ctx.fillText(
      `এবং মোট ভৌগোলিক ভূখণ্ডের প্রায় ${toBengaliNumber(percentage)}% ঘুরে দেখে দেশের প্রাকৃতিক ও সাংস্কৃতিক রূপ প্রত্যক্ষ করেছেন।`,
      600,
      405
    );

    // Rank Badge Banner Box
    ctx.fillStyle = '#ecfdf5';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(400, 450, 400, 70, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 24px "Anek Bangla", sans-serif';
    ctx.fillText(`অর্জন: ${badge.title} (${badge.en})`, 600, 495);

    // Footer Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '16px "Anek Bangla", sans-serif';
    ctx.fillText(`ইস্যু তারিখ: ${todayStr}`, 100, 680);
    ctx.fillText(`যাচাইকরণ আইডি: DB-${Date.now().toString().slice(-8)}`, 100, 710);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px "Anek Bangla", sans-serif';
    ctx.fillText('মোঃ হাসিবুল হাসান', 1100, 675);
    ctx.fillStyle = '#047857';
    ctx.font = '600 15px "Anek Bangla", sans-serif';
    ctx.fillText('প্রধান ডেভেলপার ও প্রতিষ্ঠাতা · দেশভ্রমণ', 1100, 705);

    // Trigger download
    const link = document.createElement('a');
    link.download = `DeshBhromon-Certificate-${travelerName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Preview Card */}
        <div ref={certRef} className="p-8 sm:p-12 text-center space-y-6 bg-[#faf9f6] border-8 border-emerald-900 m-4 rounded-2xl relative">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
              Official Explorer Certificate
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              দেশভ্রমণ পর্যটক সনদপত্র
            </h2>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-stone-500">এই প্রত্যয়নপত্রটি প্রদান করা হচ্ছে:</span>
            <div className="text-3xl font-black text-emerald-800 tracking-tight">
              {travelerName.trim() || 'মোঃ হাসিবুল হাসান'}
            </div>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed pt-1">
              যিনি বাংলাদেশের ৬৪ জেলার মধ্যে সফলভাবে <strong>{toBengaliNumber(visitedCount)}টি</strong> জেলা
              ভ্রমণ ও অন্বেষণ সম্পন্ন করে এই সম্মানজনক স্বীকৃতি অর্জন করেছেন।
            </p>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-base shadow-xs">
            <Award className="w-5 h-5 text-amber-600" />
            <span>{badge.title} ({badge.en})</span>
          </div>

          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <div className="text-left">
              <div>তারিখ: {todayStr}</div>
              <div className="font-semibold text-emerald-800">দেশভ্রমণ (DeshBhromon) ভেরিফায়েড</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-stone-900">মোঃ হাসিবুল হাসান (Md. Hasibul Hasan)</div>
              <div>ক্রিয়েটর ও সফটওয়্যার ইঞ্জিনিয়ার</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-bold"
          >
            বন্ধ করুন
          </button>
          <button
            type="button"
            onClick={handleDownloadCertificate}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>এইচডি সার্টিফিকেট ডাউনলোড (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

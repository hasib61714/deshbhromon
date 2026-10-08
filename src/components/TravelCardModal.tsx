import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Download, Share2, Copy, IdCard, Facebook } from 'lucide-react';
import { dialogProps } from '../lib/dialog';
import { loadTravelLogs } from '../lib/travelLogs';
import { PLANNER_KEY, parsePlanner } from '../lib/tripPlan';
import { readObject } from '../lib/storage';
import { buildCaption, buildCardData, cardAltText, isCustomPlan } from '../lib/travelCard';
import { CARD_H, CARD_W, drawTravelCard } from '../lib/travelCardRender';

interface TravelCardModalProps {
  onClose: () => void;
  travelerName: string;
  onTravelerNameChange: (name: string) => void;
  visited: Set<string>;
  wishlist: Set<string>;
  countries: Set<string>;
}

const siteName = () => {
  const h = typeof location !== 'undefined' ? location.host : '';
  return /\./.test(h) && !/^(localhost|127\.)/.test(h) ? h : 'deshbhromon.vercel.app';
};

export const TravelCardModal: React.FC<TravelCardModalProps> = ({
  onClose,
  travelerName,
  onTravelerNameChange,
  visited,
  wishlist,
  countries,
}) => {
  // Diary and planner are read once when the card opens (they are saved by their own tabs)
  const [logs] = useState(loadTravelLogs);
  const [planner] = useState(() => readObject(PLANNER_KEY, parsePlanner));
  const hasPlan = isCustomPlan(planner);
  const hasDiary = logs.some((l) => l.notes.trim());

  const [showPlan, setShowPlan] = useState<boolean>(hasPlan);
  const [showQuote, setShowQuote] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const data = useMemo(
    () => buildCardData({ name: travelerName, visited, wishlist, countries, logs, planner, options: { showPlan, showQuote } }),
    [travelerName, visited, wishlist, countries, logs, planner, showPlan, showQuote],
  );
  const site = siteName();
  const caption = useMemo(() => buildCaption(data, site), [data, site]);
  const canShareFiles = typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && typeof navigator.share === 'function';
  const hasTrips = data.visitedCount > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let alive = true;
    drawTravelCard(canvas, data, site).catch(() => {
      if (alive) setStatus('কার্ড আঁকতে সমস্যা হয়েছে। পেজ রিলোড করে আবার চেষ্টা করুন।');
    });
    return () => {
      alive = false;
    };
  }, [data, site]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      const c = canvasRef.current;
      if (!c) return resolve(null);
      c.toBlob((b) => resolve(b), 'image/png');
    });
  const fileName = `DeshBhromon-TravelCard-${new Date().toISOString().slice(0, 10)}.png`;

  const handleDownload = async () => {
    setBusy(true);
    try {
      const blob = await toBlob();
      if (!blob) return setStatus('ছবি তৈরি করা যায়নি।');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setStatus('কার্ডটি ডাউনলোড হয়েছে। এবার Facebook-এ নতুন পোস্টে ছবি হিসেবে যোগ করুন।');
    } finally {
      setBusy(false);
    }
  };

  // Facebook cannot take an image from a link, so: open Facebook, save the card and copy the caption in one tap
  const handleFacebook = async () => {
    const link = `${window.location.origin}/`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank', 'noopener,noreferrer');
    await handleDownload();
    try {
      await navigator.clipboard.writeText(caption);
      setStatus('কার্ড ডাউনলোড হয়েছে ও ক্যাপশন কপি হয়েছে। Facebook-এ পোস্ট লিখে ছবিটি যোগ করুন, ক্যাপশন পেস্ট করুন।');
    } catch {
      setStatus('কার্ড ডাউনলোড হয়েছে। Facebook-এ ছবিটি যোগ করুন; ক্যাপশন নিচ থেকে কপি করে নিন।');
    }
  };

  const handleShare = async () => {
    setBusy(true);
    try {
      const blob = await toBlob();
      if (!blob) return setStatus('ছবি তৈরি করা যায়নি।');
      const file = new File([blob], fileName, { type: 'image/png' });
      if (!navigator.canShare({ files: [file] })) return setStatus('এই ব্রাউজার ছবি শেয়ার সমর্থন করে না। ডাউনলোড করে পোস্ট করুন।');
      await navigator.share({ files: [file], title: 'আমার বাংলাদেশ ভ্রমণ কার্ড', text: caption });
      setStatus('শেয়ার মেনু খোলা হয়েছে।');
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setStatus('শেয়ার করা যায়নি। ডাউনলোড করে পোস্ট করুন।');
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setStatus('ক্যাপশন কপি হয়েছে। Facebook পোস্টে পেস্ট করুন।');
    } catch {
      setStatus('কপি করা যায়নি। নিচের লেখাটি নিজে সিলেক্ট করে কপি করুন।');
    }
  };

  return (
    <div
      {...dialogProps(onClose, 'ট্রাভেল কার্ড')}
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto outline-none"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-0">
          <div className="bg-stone-100 p-4 sm:p-6 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={CARD_W}
              height={CARD_H}
              role="img"
              aria-label={cardAltText(data)}
              className="block w-auto h-auto max-w-full max-h-[70vh] rounded-2xl shadow-xl"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1 pr-10">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                <IdCard className="w-3.5 h-3.5" aria-hidden="true" /> Personal Travel Card
              </span>
              <h2 className="text-xl font-black text-emerald-950">আমার বাংলাদেশ ট্রাভেল কার্ড</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                ম্যাপের ঘোরা জেলা, ডায়েরি ও ট্রিপ প্ল্যানার থেকে Facebook-এর জন্য (৪:৫) ছবি তৈরি হয়। সবকিছু আপনার ডিভাইসেই তৈরি হয়।
              </p>
            </div>

            <div>
              <label htmlFor="travelcard-name" className="text-xs text-stone-500 block mb-1">
                কার্ডে যে নাম থাকবে
              </label>
              <input
                id="travelcard-name"
                type="text"
                value={travelerName}
                maxLength={60}
                placeholder="আপনার নাম লিখুন"
                onChange={(e) => onTravelerNameChange(e.target.value)}
                className="w-full text-lg font-bold text-emerald-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:border-emerald-600 focus:outline-none placeholder:text-stone-300"
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-bold text-stone-600 mb-1">কার্ডে যা দেখাবেন</legend>
              <label className={`flex items-start gap-2 text-sm min-h-10 ${hasPlan ? 'text-stone-800' : 'text-stone-400'}`}>
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 accent-emerald-700"
                  checked={showPlan && hasPlan}
                  disabled={!hasPlan}
                  onChange={(e) => setShowPlan(e.target.checked)}
                />
                <span>
                  পরবর্তী যাত্রা (ট্রিপ প্ল্যানার)
                  {!hasPlan && <span className="block text-[11px]">ট্রিপ প্ল্যানারে নিজের রুট সাজালে এখানে আসবে</span>}
                </span>
              </label>
              <label className={`flex items-start gap-2 text-sm min-h-10 ${hasDiary ? 'text-stone-800' : 'text-stone-400'}`}>
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 accent-emerald-700"
                  checked={showQuote && hasDiary}
                  disabled={!hasDiary}
                  onChange={(e) => setShowQuote(e.target.checked)}
                />
                <span>
                  সেরা স্মৃতির লেখা (ডায়েরি)
                  {hasDiary ? (
                    <span className="block text-[11px] text-stone-500">বন্ধ থাকলে শুধু জেলার নাম ও রেটিং দেখাবে, ব্যক্তিগত লেখা নয়</span>
                  ) : (
                    <span className="block text-[11px]">ডায়েরিতে স্মৃতি লিখলে এখানে আসবে</span>
                  )}
                </span>
              </label>
            </fieldset>

            {!hasTrips && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                কার্ড বানাতে আগে “আমার ম্যাপ” থেকে অন্তত একটি ঘোরা জেলা চিহ্নিত করুন।
              </p>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!hasTrips || busy}
                className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>কার্ড ডাউনলোড (PNG)</span>
              </button>
              <button
                type="button"
                onClick={handleFacebook}
                disabled={!hasTrips || busy}
                className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
                <span>Facebook-এ শেয়ার</span>
              </button>
              {canShareFiles && (
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!hasTrips || busy}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-sm font-extrabold transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  <span>শেয়ার করুন</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Facebook ক্যাপশন কপি</span>
              </button>
            </div>

            <p role="status" aria-live="polite" className="text-xs text-emerald-800 min-h-4">
              {status}
            </p>

            <label className="block">
              <span className="text-[11px] text-stone-500">ক্যাপশন (সম্পাদনা করে পোস্ট করতে পারেন)</span>
              <textarea
                readOnly
                value={caption}
                rows={6}
                className="mt-1 w-full text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-xl p-2.5 leading-relaxed"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

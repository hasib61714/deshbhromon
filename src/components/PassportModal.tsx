import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookMarked, Download, X } from 'lucide-react';
import { dialogProps } from '../lib/dialog';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';
import { COVERS, passportNumber, passportPages, type CoverId } from '../lib/passport';
import { drawPassportCover, drawPassportPage, PASSPORT_H, PASSPORT_W, type StampLabel } from '../lib/passportRender';
import { readString, writeString } from '../lib/storage';
import { useLang } from '../i18n/LangContext';

interface PassportModalProps {
  onClose: () => void;
  travelerName: string;
  onTravelerNameChange: (name: string) => void;
  visited: Set<string>;
}

const ALL_IDS = Object.keys(DISTRICT_DETAILS);
type MapData = typeof import('../data/map-data').DATA;

// Travel passport: a cover plus pages of stamps, one stamp for each visited district
export const PassportModal: React.FC<PassportModalProps> = ({ onClose, travelerName, onTravelerNameChange, visited }) => {
  const { lang, tr, n } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cover, setCover] = useState<CoverId>(() => {
    const c = readString('passport_cover', 'green');
    return c in COVERS ? (c as CoverId) : 'green';
  });
  const [view, setView] = useState<'cover' | number>('cover');
  const [map, setMap] = useState<MapData | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [issued] = useState<string>(() => {
    const saved = readString('passport_issued', '');
    if (saved) return saved;
    const today = new Date().toISOString().slice(0, 10);
    writeString('passport_issued', today);
    return today;
  });

  useEffect(() => {
    let live = true;
    import('../data/map-data').then((m) => live && setMap(m.DATA)).catch(() => {});
    return () => { live = false; };
  }, []);

  const stamps: StampLabel[] = useMemo(
    () =>
      ALL_IDS.filter((id) => visited.has(id)).map((id) => ({
        id,
        name: lang === 'en' ? id : DISTRICT_DETAILS[id].bn,
        sub: lang === 'en' ? DISTRICT_DETAILS[id].dv : DISTRICT_DETAILS[id].dvBn,
      })),
    [visited, lang],
  );
  const pages = passportPages(stamps.length);
  const page = view === 'cover' ? 0 : Math.min(view, pages);
  const number = passportNumber(travelerName);
  const issuedLabel = new Date(issued).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const job = page === 0
      ? drawPassportCover(c, { name: travelerName, cover, lang, stamps: stamps.length, mapPaths: map ? map.f.map((f) => f.d) : null, mapW: map?.w ?? 600, mapH: map?.h ?? 828 })
      : drawPassportPage(c, { name: travelerName.trim() || (lang === 'en' ? 'Your name' : 'আপনার নাম'), number, issued: issuedLabel, stamps, page, pages, total: ALL_IDS.length, lang });
    job.catch(() => setStatus(tr('ছবি আঁকতে সমস্যা হয়েছে। পেজ রিলোড করে আবার চেষ্টা করুন।')));
  }, [page, cover, travelerName, lang, stamps, pages, number, issuedLabel, map, tr]);

  const pick = (c: CoverId) => {
    setCover(c);
    writeString('passport_cover', c);
  };

  const save = (canvas: HTMLCanvasElement, file: string) =>
    new Promise<void>((resolve) => {
      canvas.toBlob((b) => {
        if (b) {
          const url = URL.createObjectURL(b);
          const a = document.createElement('a');
          a.href = url;
          a.download = file;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
        }
        resolve();
      }, 'image/png');
    });

  const downloadCurrent = async () => {
    const c = canvasRef.current;
    if (!c) return;
    setBusy(true);
    await save(c, page === 0 ? 'DeshBhromon-Passport-cover.png' : `DeshBhromon-Passport-page-${page}.png`);
    setStatus(tr('ছবিটি ডাউনলোড হয়েছে।'));
    setBusy(false);
  };

  const downloadAll = async () => {
    setBusy(true);
    const c = document.createElement('canvas');
    c.width = PASSPORT_W;
    c.height = PASSPORT_H;
    await drawPassportCover(c, { name: travelerName, cover, lang, stamps: stamps.length, mapPaths: map ? map.f.map((f) => f.d) : null, mapW: map?.w ?? 600, mapH: map?.h ?? 828 });
    await save(c, 'DeshBhromon-Passport-cover.png');
    for (let p = 1; p <= pages; p++) {
      await drawPassportPage(c, { name: travelerName.trim() || (lang === 'en' ? 'Your name' : 'আপনার নাম'), number, issued: issuedLabel, stamps, page: p, pages, total: ALL_IDS.length, lang });
      await new Promise((r) => setTimeout(r, 350));
      await save(c, `DeshBhromon-Passport-page-${p}.png`);
    }
    setStatus(tr('সব পাতা ডাউনলোড হয়েছে। ব্রাউজার একাধিক ডাউনলোডের অনুমতি চাইলে "Allow" দিন।'));
    setBusy(false);
  };

  return (
    <div
      {...dialogProps(onClose, tr('ভ্রমণ পাসপোর্ট'))}
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto outline-none"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden relative my-auto">
        <button type="button" onClick={onClose} aria-label={tr('বন্ধ করুন')} className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <div className="bg-stone-100 p-4 sm:p-6 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={PASSPORT_W}
              height={PASSPORT_H}
              role="img"
              aria-label={lang === 'en' ? `Travel passport ${page === 0 ? 'cover' : `page ${page}`} with ${stamps.length} stamps` : `ভ্রমণ পাসপোর্ট ${page === 0 ? 'কভার' : `পাতা ${n(page)}`}, ${n(stamps.length)}টি সিল`}
              className="block w-auto h-auto max-w-full max-h-[70vh] rounded-xl shadow-xl"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1 pr-10">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5" aria-hidden="true" /> Travel Passport
              </span>
              <h2 className="text-xl font-black text-emerald-950">{tr('আমার ভ্রমণ পাসপোর্ট')}</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                {tr('যে জেলায় গিয়েছেন, সেখানকার একটি সিল আপনার পাসপোর্টে বসবে। সবকিছু আপনার ডিভাইসেই তৈরি হয়।')}
              </p>
            </div>

            <div>
              <label htmlFor="passport-name" className="text-xs text-stone-500 block mb-1">{tr('পাসপোর্টে যে নাম থাকবে')}</label>
              <input
                id="passport-name"
                type="text"
                value={travelerName}
                maxLength={40}
                placeholder={tr('আপনার নাম লিখুন')}
                onChange={(e) => onTravelerNameChange(e.target.value)}
                className="w-full text-lg font-bold text-emerald-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:border-emerald-600 focus:outline-none placeholder:text-stone-300"
              />
            </div>

            <fieldset>
              <legend className="text-xs font-bold text-stone-600 mb-1.5">{tr('কভারের রং')}</legend>
              <div className="flex gap-2">
                {(Object.keys(COVERS) as CoverId[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={cover === c}
                    onClick={() => pick(c)}
                    className={`flex-1 px-2 py-2 min-h-11 rounded-xl border-2 text-xs font-bold cursor-pointer ${cover === c ? 'border-stone-900' : 'border-stone-200'}`}
                  >
                    <span className="inline-block w-3 h-3 rounded-sm mr-1.5 align-middle" style={{ background: COVERS[c].from }} />
                    {lang === 'en' ? COVERS[c].en : COVERS[c].bn}
                  </button>
                ))}
              </div>
            </fieldset>

            <div role="group" aria-label={tr('পাতা')} className="flex flex-wrap gap-2">
              {(['cover', ...Array.from({ length: pages }, (_, i) => i + 1)] as ('cover' | number)[]).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={page === (v === 'cover' ? 0 : v)}
                  onClick={() => setView(v)}
                  className={`px-3 py-2 min-h-11 rounded-full text-xs font-bold border cursor-pointer ${page === (v === 'cover' ? 0 : v) ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-200'}`}
                >
                  {v === 'cover' ? tr('কভার') : `${tr('পাতা')} ${n(v)}`}
                </button>
              ))}
            </div>

            {stamps.length === 0 && (
              <p role="status" className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                {tr('আগে ম্যাপে অন্তত একটি জেলা "ঘুরেছি" চিহ্নিত করুন, তাহলে পাসপোর্টে সিল বসবে।')}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <button type="button" onClick={downloadCurrent} disabled={busy} className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold disabled:opacity-40 cursor-pointer">
                <Download className="w-4 h-4" aria-hidden="true" /> {tr('এই পাতা ডাউনলোড (PNG)')}
              </button>
              <button type="button" onClick={downloadAll} disabled={busy} className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-bold disabled:opacity-40 cursor-pointer">
                <Download className="w-4 h-4" aria-hidden="true" /> {tr('কভারসহ সব পাতা ডাউনলোড')}
              </button>
            </div>
            <p role="status" aria-live="polite" className="text-xs text-emerald-800 min-h-4">{status}</p>
            <p className="text-[11px] text-stone-400">{tr('এটি একটি মজার স্মারক, ভ্রমণ দলিল নয়।')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

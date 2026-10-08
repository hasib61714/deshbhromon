import React, { useMemo, useState } from 'react';
import { Gem, Video, MapPin, MessageCircle, Mail, Copy, Plus } from 'lucide-react';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';
import { CONTACT } from '../data/contact';
import { GEM_CATEGORIES, HIDDEN_GEMS, type HiddenGem } from '../data/hidden-gems';
import { buildMessage, isSafeVideoUrl, LIMITS, QUICK_TEXT, mailtoUrl, validateGem, whatsappUrl, type GemForm } from '../lib/gemSubmission';
import { SafeImage } from './SafeImage';

const DISTRICTS = Object.entries(DISTRICT_DETAILS)
  .map(([id, d]) => ({ id, bn: d.bn }))
  .sort((a, b) => a.bn.localeCompare(b.bn, 'bn'));

const EMPTY: GemForm = { districtId: '', name: '', desc: '', how: '', video: '', category: GEM_CATEGORIES[0], sender: '', consent: false };

interface HiddenGemsProps {
  gems?: HiddenGem[];
  contact?: { whatsapp: string; email: string; messenger?: string; facebook?: string };
}

// "আমার এলাকা": travellers suggest little-known places; the owner checks each one before it is added to the list
export const HiddenGems: React.FC<HiddenGemsProps> = ({ gems = HIDDEN_GEMS, contact = CONTACT }) => {
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [quickStatus, setQuickStatus] = useState('');
  const [form, setForm] = useState<GemForm>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const shown = useMemo(() => gems.filter((g) => !filter || g.districtId === filter), [gems, filter]);
  const set = <K extends keyof GemForm>(k: K, v: GemForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const quickCopy = async () => {
    try {
      await navigator.clipboard.writeText(QUICK_TEXT);
      setQuickStatus('মেসেজ কপি হয়েছে। এবার আমাদের চ্যাটে পেস্ট করুন।');
    } catch {
      setQuickStatus('কপি করা যায়নি।');
    }
  };

  const prepare = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateGem(form);
    setErrors(errs);
    setStatus('');
    setMessage(errs.length ? '' : buildMessage(form));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setStatus('মেসেজ কপি হয়েছে।');
    } catch {
      setStatus('কপি করা যায়নি। নিচের লেখাটি নিজে সিলেক্ট করে কপি করুন।');
    }
  };

  const field = 'w-full px-3 py-2 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30';

  return (
    <div className="py-6 sm:py-8 space-y-6">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
          <Gem className="w-3.5 h-3.5" aria-hidden="true" />
          <span>স্থানীয়দের চোখে দেখা বাংলাদেশ</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">আমার এলাকা, আমার সেরা</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
          আপনার এলাকায় এমন কোনো সুন্দর জায়গা, বিখ্যাত খাবার বা পণ্য আছে, যার কথা খুব কম মানুষ জানে? ছবি বা ভিডিওসহ পাঠান। আমরা যাচাই করে আপনার নামসহ এখানে প্রকাশ করব।
        </p>
        <ol data-quick-steps className="mt-4 space-y-1.5 text-sm text-stone-700 list-decimal list-inside">
          <li>নিচের বোতাম চাপুন, আমাদের চ্যাট খুলবে।</li>
          <li>জায়গার ছবি বা ভিডিও, নাম আর জেলা পাঠান।</li>
          <li>আমরা যাচাই করে আপনার নামসহ প্রকাশ করব।</li>
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {contact.whatsapp && (
            <a data-quick-send href={whatsappUrl(contact.whatsapp, QUICK_TEXT)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 min-h-11 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors">
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp-এ পাঠান
            </a>
          )}
          {contact.messenger && (
            <a data-quick-send href={contact.messenger} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 min-h-11 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> Messenger-এ পাঠান
            </a>
          )}
          {contact.facebook && (
            <a data-quick-send href={contact.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-2xl bg-stone-100 text-stone-800 text-sm font-bold hover:bg-stone-200 transition-colors">
              Facebook পেজ
            </a>
          )}
          {contact.email && (
            <a data-quick-send href={mailtoUrl(contact.email, QUICK_TEXT)} className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-2xl bg-stone-100 text-stone-800 text-sm font-bold hover:bg-stone-200 transition-colors">
              <Mail className="w-4 h-4" aria-hidden="true" /> ইমেইল
            </a>
          )}
          {!contact.whatsapp && !contact.messenger && !contact.facebook && !contact.email && (
            <button type="button" data-quick-send onClick={quickCopy} className="inline-flex items-center gap-2 px-5 py-2.5 min-h-11 rounded-2xl bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 transition-colors cursor-pointer">
              <Copy className="w-4 h-4" aria-hidden="true" /> মেসেজ কপি করুন
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            জায়গা পাঠান (ফর্মে সাজিয়ে)
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 text-xs text-emerald-800 min-h-4">{quickStatus}</p>
      </div>

      {open && (
        <form onSubmit={prepare} data-gem-form className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs font-bold text-stone-600">
              জেলা
              <select value={form.districtId} onChange={(e) => set('districtId', e.target.value)} className={`${field} mt-1`}>
                <option value="">জেলা বাছুন</option>
                {DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.bn}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-stone-600">
              ধরন
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={`${field} mt-1`}>
                {GEM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-xs font-bold text-stone-600">
            জায়গার নাম
            <input value={form.name} maxLength={LIMITS.name} onChange={(e) => set('name', e.target.value)} className={`${field} mt-1`} />
          </label>
          <label className="block text-xs font-bold text-stone-600">
            জায়গাটি সম্পর্কে লিখুন (কী আছে, কেন সুন্দর)
            <textarea value={form.desc} maxLength={LIMITS.desc} rows={4} onChange={(e) => set('desc', e.target.value)} className={`${field} mt-1`} />
          </label>
          <label className="block text-xs font-bold text-stone-600">
            কীভাবে যাবেন (ঐচ্ছিক)
            <input value={form.how} maxLength={LIMITS.how} onChange={(e) => set('how', e.target.value)} className={`${field} mt-1`} />
          </label>
          <label className="block text-xs font-bold text-stone-600">
            ভিডিওর লিংক (ঐচ্ছিক, YouTube বা Facebook)
            <input value={form.video} maxLength={LIMITS.video} inputMode="url" placeholder="https://" onChange={(e) => set('video', e.target.value)} className={`${field} mt-1`} />
          </label>
          <label className="block text-xs font-bold text-stone-600">
            আপনার নাম (কার্ডে থাকবে)
            <input value={form.sender} maxLength={LIMITS.sender} onChange={(e) => set('sender', e.target.value)} className={`${field} mt-1`} />
          </label>
          <label className="flex items-start gap-2 text-xs text-stone-700">
            <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="w-4 h-4 mt-0.5 accent-emerald-600" />
            <span>আমি নামসহ এই তথ্য প্রকাশের অনুমতি দিচ্ছি। ছবি পাঠালে সেটি আমার তোলা এবং প্রকাশের অধিকার আমার আছে।</span>
          </label>

          {errors.length > 0 && (
            <ul role="alert" className="text-xs text-red-700 space-y-0.5">
              {errors.map((er) => <li key={er}>• {er}</li>)}
            </ul>
          )}

          <button type="submit" className="px-5 py-2.5 min-h-11 rounded-2xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 cursor-pointer">
            মেসেজ তৈরি করুন
          </button>

          {message && (
            <div data-gem-message className="space-y-3 border-t border-stone-100 pt-4">
              <p className="text-xs text-stone-600">
                এখান থেকে সরাসরি কিছু জমা হয় না। নিচের মেসেজটি আমাদের পাঠান। <strong>ছবি বা ভিডিও থাকলে একই চ্যাটে সরাসরি অ্যাটাচ করে পাঠান</strong> (WhatsApp বা ইমেইলে ছবি/ভিডিও যোগ করার বোতাম থেকে)। ভিডিও বড় হলে YouTube বা Facebook-এ তুলে লিংক দিন।
              </p>
              <textarea readOnly value={message} rows={8} aria-label="পাঠানোর মেসেজ" className={`${field} font-mono text-xs`} />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 px-4 py-2 min-h-11 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 cursor-pointer">
                  <Copy className="w-4 h-4" aria-hidden="true" /> মেসেজ কপি
                </button>
                {contact.whatsapp && (
                  <a href={whatsappUrl(contact.whatsapp, message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 min-h-11 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp-এ পাঠান
                  </a>
                )}
                {contact.email && (
                  <a href={mailtoUrl(contact.email, message)} className="inline-flex items-center gap-1.5 px-4 py-2 min-h-11 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">
                    <Mail className="w-4 h-4" aria-hidden="true" /> ইমেইলে পাঠান
                  </a>
                )}
              </div>
              <p role="status" aria-live="polite" className="text-xs text-emerald-800 min-h-4">{status}</p>
            </div>
          )}
        </form>
      )}

      <section aria-labelledby="gems-list-title" className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="gems-list-title" className="text-lg font-extrabold text-stone-900">সবার পাঠানো জায়গা</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="জেলা অনুযায়ী দেখুন" className="px-3 py-2 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm">
            <option value="">সব জেলা</option>
            {DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.bn}</option>)}
          </select>
        </div>
        {shown.length === 0 ? (
          <p data-gems-empty className="mt-4 text-sm text-stone-600" role="status">
            {gems.length === 0 ? 'এখনও কোনো জায়গা প্রকাশিত হয়নি। আপনার পাঠানো জায়গাটি প্রথম হতে পারে!' : 'এই জেলার কোনো জায়গা এখনও নেই।'}
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map((g) => (
              <li key={g.id} data-gem className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/60">
                {g.photo && (
                  <figure className="relative h-40 m-0 bg-stone-200">
                    <SafeImage src={g.photo.src} alt={g.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    <figcaption className="absolute inset-x-0 bottom-0 px-2.5 py-1 text-[10px] text-white/90 bg-gradient-to-t from-black/70 to-transparent truncate">
                      ছবি: {g.photo.by}{g.photo.lic ? ` · ${g.photo.lic}` : ''}
                    </figcaption>
                  </figure>
                )}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-extrabold text-stone-900">{g.name}</h3>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" /> {DISTRICT_DETAILS[g.districtId]?.bn ?? g.districtId} · {g.category}
                  </p>
                  <p className="text-sm text-stone-700 leading-relaxed">{g.desc}</p>
                  {g.how && <p className="text-xs text-stone-500">যাবেন যেভাবে: {g.how}</p>}
                  {g.video && isSafeVideoUrl(g.video) && (
                    <a href={g.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
                      <Video className="w-3.5 h-3.5" aria-hidden="true" /> ভিডিও দেখুন
                    </a>
                  )}
                  <p className="text-[11px] text-emerald-800 font-bold">পাঠিয়েছেন: {g.by}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

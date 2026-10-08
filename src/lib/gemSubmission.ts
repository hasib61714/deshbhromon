import { DISTRICT_DETAILS } from '../data/bangladesh-data';

export interface GemForm {
  districtId: string;
  name: string;
  desc: string;
  how: string;
  video: string;
  category: string;
  sender: string;
  consent: boolean;
}

export const LIMITS = { name: 80, desc: 400, how: 200, sender: 60, video: 200 };

// Returns Bangla error messages; empty array means the form is fine
// Only plain https links to YouTube or Facebook videos are accepted and shown
export const isSafeVideoUrl = (u: string) => {
  try {
    const x = new URL(u.trim());
    return x.protocol === 'https:' && /(^|\.)(youtube\.com|youtu\.be|facebook\.com|fb\.watch)$/.test(x.hostname);
  } catch {
    return false;
  }
};

export function validateGem(f: GemForm): string[] {
  const errs: string[] = [];
  if (!DISTRICT_DETAILS[f.districtId]) errs.push('জেলা বাছুন।');
  if (f.name.trim().length < 3) errs.push('জায়গার নাম লিখুন।');
  if (f.desc.trim().length < 20) errs.push('জায়গাটি সম্পর্কে অন্তত ২০ অক্ষরের বর্ণনা লিখুন।');
  if (f.video.trim() && !isSafeVideoUrl(f.video)) errs.push('ভিডিওর লিংক শুধু YouTube বা Facebook-এর https লিংক হতে পারবে।');
  if (f.sender.trim().length < 2) errs.push('আপনার নাম লিখুন (কার্ডে আপনার নাম থাকবে)।');
  if (!f.consent) errs.push('নামসহ প্রকাশের অনুমতিতে টিক দিন।');
  return errs;
}

export function buildMessage(f: GemForm): string {
  const d = DISTRICT_DETAILS[f.districtId]?.bn ?? f.districtId;
  return [
    '📍 দেশভ্রমণ — আমার এলাকা প্রস্তাব',
    `জায়গা: ${f.name.trim().slice(0, LIMITS.name)}`,
    `জেলা: ${d}`,
    `ধরন: ${f.category}`,
    `বর্ণনা: ${f.desc.trim().slice(0, LIMITS.desc)}`,
    f.how.trim() ? `কীভাবে যাবেন: ${f.how.trim().slice(0, LIMITS.how)}` : '',
    f.video.trim() ? `ভিডিও: ${f.video.trim().slice(0, LIMITS.video)}` : '',
    `প্রেরক: ${f.sender.trim().slice(0, LIMITS.sender)}`,
    '✅ আমি নামসহ এই তথ্য প্রকাশের অনুমতি দিচ্ছি। ছবি পাঠালে সেটি আমার তোলা এবং প্রকাশের অধিকার আমার আছে।',
    '(ছবি বা ভিডিও থাকলে এই চ্যাটেই সাথে পাঠান)',
  ].filter(Boolean).join('\n');
}

// Short text for the one-tap button: the sender just adds the photo/video in the chat and fills the blanks
export const QUICK_TEXT = 'আসসালামু আলাইকুম, "দেশভ্রমণ"-এর জন্য আমার এলাকার একটি জায়গা/খাবার পাঠাচ্ছি।\nনাম:\nজেলা:\nসংক্ষেপে:\n(ছবি/ভিডিও এই চ্যাটেই দিচ্ছি। নামসহ প্রকাশের অনুমতি দিলাম।)';

export const whatsappUrl = (number: string, text: string) => `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
export const mailtoUrl = (email: string, text: string) =>
  `mailto:${email}?subject=${encodeURIComponent('আমার এলাকা প্রস্তাব — দেশভ্রমণ')}&body=${encodeURIComponent(text)}`;

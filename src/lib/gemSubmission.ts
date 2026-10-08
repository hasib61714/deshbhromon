import { DISTRICT_DETAILS } from '../data/bangladesh-data';

export interface GemForm {
  districtId: string;
  name: string;
  desc: string;
  how: string;
  category: string;
  sender: string;
  consent: boolean;
}

export const LIMITS = { name: 80, desc: 400, how: 200, sender: 60 };

// Returns Bangla error messages; empty array means the form is fine
export function validateGem(f: GemForm): string[] {
  const errs: string[] = [];
  if (!DISTRICT_DETAILS[f.districtId]) errs.push('জেলা বাছুন।');
  if (f.name.trim().length < 3) errs.push('জায়গার নাম লিখুন।');
  if (f.desc.trim().length < 20) errs.push('জায়গাটি সম্পর্কে অন্তত ২০ অক্ষরের বর্ণনা লিখুন।');
  if (f.sender.trim().length < 2) errs.push('আপনার নাম লিখুন (কার্ডে আপনার নাম থাকবে)।');
  if (!f.consent) errs.push('নামসহ প্রকাশের অনুমতিতে টিক দিন।');
  return errs;
}

export function buildMessage(f: GemForm): string {
  const d = DISTRICT_DETAILS[f.districtId]?.bn ?? f.districtId;
  return [
    '📍 দেশভ্রমণ — লুকানো রত্ন প্রস্তাব',
    `জায়গা: ${f.name.trim().slice(0, LIMITS.name)}`,
    `জেলা: ${d}`,
    `ধরন: ${f.category}`,
    `বর্ণনা: ${f.desc.trim().slice(0, LIMITS.desc)}`,
    f.how.trim() ? `কীভাবে যাবেন: ${f.how.trim().slice(0, LIMITS.how)}` : '',
    `প্রেরক: ${f.sender.trim().slice(0, LIMITS.sender)}`,
    '✅ আমি নামসহ এই তথ্য প্রকাশের অনুমতি দিচ্ছি। ছবি পাঠালে সেটি আমার তোলা এবং প্রকাশের অধিকার আমার আছে।',
    '(ছবি থাকলে এই মেসেজের সাথে পাঠান)',
  ].filter(Boolean).join('\n');
}

export const whatsappUrl = (number: string, text: string) => `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
export const mailtoUrl = (email: string, text: string) =>
  `mailto:${email}?subject=${encodeURIComponent('লুকানো রত্ন প্রস্তাব — দেশভ্রমণ')}&body=${encodeURIComponent(text)}`;

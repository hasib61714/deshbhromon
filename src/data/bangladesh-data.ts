import { MapTheme } from '../types';

export const DIVISIONS = [
  { id: 'Dhaka', bn: 'ঢাকা', color: '#3b82f6' },
  { id: 'Chattogram', bn: 'চট্টগ্রাম', color: '#10b981' },
  { id: 'Sylhet', bn: 'সিলেট', color: '#06b6d4' },
  { id: 'Rajshahi', bn: 'রাজশাহী', color: '#f59e0b' },
  { id: 'Khulna', bn: 'খুলনা', color: '#84cc16' },
  { id: 'Barishal', bn: 'বরিশাল', color: '#6366f1' },
  { id: 'Rangpur', bn: 'রংপুর', color: '#ec4899' },
  { id: 'Mymensingh', bn: 'ময়মনসিংহ', color: '#8b5cf6' },
] as const;

export const DISTRICT_DETAILS: Record<string, { bn: string; dv: string; dvBn: string; fam: string }> = {
  "Bagerhat": { bn: "বাগেরহাট", dv: "Khulna", dvBn: "খুলনা", fam: "ষাট গম্বুজ মসজিদ ও সুন্দরবন" },
  "Bandarban": { bn: "বান্দরবান", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "নীলগিরি, নাফাখুম ও পাহাড়" },
  "Barguna": { bn: "বরগুনা", dv: "Barishal", dvBn: "বরিশাল", fam: "শুভসন্ধ্যা সৈকত ও হরিণঘাটা বন" },
  "Barishal": { bn: "বরিশাল", dv: "Barishal", dvBn: "বরিশাল", fam: "ভাসমান পেয়ারা বাজার ও নদী" },
  "Bhola": { bn: "ভোলা", dv: "Barishal", dvBn: "বরিশাল", fam: "মনপুরা দ্বীপ ও মহিষের দই" },
  "Bogura": { bn: "বগুড়া", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "মহাস্থানগড় ও বগুড়ার ঐতিহ্যবাহী দই" },
  "Brahmanbaria": { bn: "ব্রাহ্মণবাড়িয়া", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "কালভৈরব মন্দির ও তিতাস নদী" },
  "Chandpur": { bn: "চাঁদপুর", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "পদ্মা-মেঘনা মোহনা ও সুস্বাদু ইলিশ" },
  "Chattogram": { bn: "চট্টগ্রাম", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "পতেঙ্গা সমুদ্র সৈকত ও নেভাল বিচ" },
  "Chuadanga": { bn: "চুয়াডাঙ্গা", dv: "Khulna", dvBn: "খুলনা", fam: "দর্শনা কেরু অ্যান্ড কোম্পানি ও মাঠা" },
  "Cumilla": { bn: "কুমিল্লা", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "শালবন বিহার ও রসমালাই" },
  "Cox's Bazar": { bn: "কক্সবাজার", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত ও সেন্টমার্টিন" },
  "Dhaka": { bn: "ঢাকা", dv: "Dhaka", dvBn: "ঢাকা", fam: "লালবাগ কেল্লা ও আহসান মঞ্জিল" },
  "Dinajpur": { bn: "দিনাজপুর", dv: "Rangpur", dvBn: "রংপুর", fam: "কান্তজীউ মন্দির ও রামসাগর দীঘি" },
  "Faridpur": { bn: "ফরিদপুর", dv: "Dhaka", dvBn: "ঢাকা", fam: "পল্লীকবি জসীমউদদীনের বাড়ি" },
  "Feni": { bn: "ফেনী", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "মুহুরী প্রজেক্ট ও শমসের গাজীর কেল্লা" },
  "Gaibandha": { bn: "গাইবান্ধা", dv: "Rangpur", dvBn: "রংপুর", fam: "বালাসী ঘাট ও ব্রহ্মপুত্র নদ" },
  "Gazipur": { bn: "গাজীপুর", dv: "Dhaka", dvBn: "ঢাকা", fam: "ভাওয়াল জাতীয় উদ্যান ও বঙ্গবন্ধু সাফারি পার্ক" },
  "Gopalganj": { bn: "গোপালগঞ্জ", dv: "Dhaka", dvBn: "ঢাকা", fam: "টুঙ্গিপাড়া ও উলপুর জমিদার বাড়ি" },
  "Habiganj": { bn: "হবিগঞ্জ", dv: "Sylhet", dvBn: "সিলেট", fam: "সাতছড়ি জাতীয় উদ্যান ও চা বাগান" },
  "Jamalpur": { bn: "জামালপুর", dv: "Mymensingh", dvBn: "ময়মনসিংহ", fam: "যমুনা সার কারখানা ও নকশিকাঁথা" },
  "Jashore": { bn: "যশোর", dv: "Khulna", dvBn: "খুলনা", fam: "মাইকেল মধুসূদন দত্তের বাড়ি ও খেজুর গুড়" },
  "Jhalokati": { bn: "ঝালকাঠি", dv: "Barishal", dvBn: "বরিশাল", fam: "ভাসমান পেয়ারা বাজার ও সুগন্ধা নদী" },
  "Jhenaidah": { bn: "ঝিনাইদহ", dv: "Khulna", dvBn: "খুলনা", fam: "মিয়ার দালান ও ঢোলসমুদ্র দীঘি" },
  "Joypurhat": { bn: "জয়পুরহাট", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "লকমা রাজবাড়ি ও পাহাড়পুর সন্নিকট" },
  "Khagrachhari": { bn: "খাগড়াছড়ি", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "সাজেক ভ্যালি, আলুটিলা গুহা ও রিসাং ঝর্ণা" },
  "Khulna": { bn: "খুলনা", dv: "Khulna", dvBn: "খুলনা", fam: "সুন্দরবনের প্রবেশদ্বার ও রূপসা নদী" },
  "Kishorganj": { bn: "কিশোরগঞ্জ", dv: "Dhaka", dvBn: "ঢাকা", fam: "নিকলী হাওর ও ঐতিহাসিক এগারসিন্দুর" },
  "Kurigram": { bn: "কুড়িগ্রাম", dv: "Rangpur", dvBn: "রংপুর", fam: "ধরলা সেতু ও চিলমারী বন্দর" },
  "Kushtia": { bn: "কুষ্টিয়া", dv: "Khulna", dvBn: "খুলনা", fam: "লালন শাহের মাজার ও শিলাইদহ রবীন্দ্র কুঠিবাড়ি" },
  "Lakshmipur": { bn: "লক্ষ্মীপুর", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "মতিরহাট মেঘনা বিচ ও দালাল বাজার জমিদার বাড়ি" },
  "Lalmonirhat": { bn: "লালমনিরহাট", dv: "Rangpur", dvBn: "রংপুর", fam: "তিস্তা ব্যারেজ ও তিনবিঘা করিডোর" },
  "Madaripur": { bn: "মাদারীপুর", dv: "Dhaka", dvBn: "ঢাকা", fam: "শকুনি লেক ও রাজা রাম মন্দির" },
  "Magura": { bn: "মাগুরা", dv: "Khulna", dvBn: "খুলনা", fam: "মোহাম্মদপুর দুর্গ ও সিদ্ধেশ্বরী কালী মন্দির" },
  "Manikganj": { bn: "মানিকগঞ্জ", dv: "Dhaka", dvBn: "ঢাকা", fam: "বালিয়াটি জমিদার বাড়ি ও তেওতা রাজবাড়ি" },
  "Moulvibazar": { bn: "মৌলভীবাজার", dv: "Sylhet", dvBn: "সিলেট", fam: "শ্রীমঙ্গল চা বাগান, মাধবকুণ্ড ও লাউয়াছড়া" },
  "Meherpur": { bn: "মেহেরপুর", dv: "Khulna", dvBn: "খুলনা", fam: "ঐতিহাসিক মুজিবনগর স্মৃতিসৌধ" },
  "Munshiganj": { bn: "মুন্সীগঞ্জ", dv: "Dhaka", dvBn: "ঢাকা", fam: "ইদ্রাকপুর কেল্লা ও পদ্মা সেতু এক্সপ্রেসওয়ে" },
  "Mymensingh": { bn: "ময়মনসিংহ", dv: "Mymensingh", dvBn: "ময়মনসিংহ", fam: "শশী লজ ও বাংলাদেশ কৃষি বিশ্ববিদ্যালয়" },
  "Naogaon": { bn: "নওগাঁ", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "সোমপুর মহাবিহার (পাহাড়পুর) ও কুসুম্বা মসজিদ" },
  "Narail": { bn: "নড়াইল", dv: "Khulna", dvBn: "খুলনা", fam: "চিত্রশিল্পী এস এম সুলতানের স্মৃতি সংগ্রহশালা" },
  "Narayanganj": { bn: "নারায়ণগঞ্জ", dv: "Dhaka", dvBn: "ঢাকা", fam: "সোনারগাঁও পানাম নগর ও লোকশিল্প জাদুঘর" },
  "Narsingdi": { bn: "নরসিংদী", dv: "Dhaka", dvBn: "ঢাকা", fam: "উয়ারী-বটেশ্বর ও বেলাবো প্রত্নস্থল" },
  "Natore": { bn: "নাটোর", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "উত্তরা গণভবন, রানী ভবানী রাজবাড়ি ও কাঁচাগোল্লা" },
  "Chapainawabganj": { bn: "চাঁপাইনবাবগঞ্জ", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "ছোট সোনা মসজিদ ও সুমিষ্ট আম" },
  "Netrokona": { bn: "নেত্রকোণা", dv: "Mymensingh", dvBn: "ময়মনসিংহ", fam: "বিরিশিরি বিজয়পুর সাদা মাটির পাহাড় ও সোমেশ্বরী" },
  "Nilphamari": { bn: "নীলফামারী", dv: "Rangpur", dvBn: "রংপুর", fam: "নীল সাগর ও তিস্তা সেচ প্রকল্প" },
  "Noakhali": { bn: "নোয়াখালী", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "নিঝুম দ্বীপ ও বজরা শাহী মসজিদ" },
  "Pabna": { bn: "পাবনা", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "হার্ডিঞ্জ ব্রিজ, লালন সেতু ও তাড়াশ ভবন" },
  "Panchagarh": { bn: "পঞ্চগড়", dv: "Rangpur", dvBn: "রংপুর", fam: "তেঁতুলিয়া জিরো পয়েন্ট ও কাঞ্চনজঙ্ঘা দর্শন" },
  "Patuakhali": { bn: "পটুয়াখালী", dv: "Barishal", dvBn: "বরিশাল", fam: "কুয়াকাটা সমুদ্র সৈকত ও সূর্যোদয়-সূর্যাস্ত" },
  "Pirojpur": { bn: "পিরোজপুর", dv: "Barishal", dvBn: "বরিশাল", fam: "বলেশ্বর নদী ও রায়েরকাঠি জমিদার বাড়ি" },
  "Rajbari": { bn: "রাজবাড়ী", dv: "Dhaka", dvBn: "ঢাকা", fam: "দৌলতদিয়া ঘাট ও কল্যাণ দীঘি" },
  "Rajshahi": { bn: "রাজশাহী", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "পদ্মা গার্ডেন, বাঘা মসজিদ ও রেশম পল্লি" },
  "Rangamati": { bn: "রাঙ্গামাটি", dv: "Chattogram", dvBn: "চট্টগ্রাম", fam: "কাপ্তাই হ্রদ, ঝুলন্ত সেতু ও শুভলং ঝর্ণা" },
  "Rangpur": { bn: "রংপুর", dv: "Rangpur", dvBn: "রংপুর", fam: "তাজহাট জমিদার বাড়ি ও ভিন্নজগত পার্ক" },
  "Satkhira": { bn: "সাতক্ষীরা", dv: "Khulna", dvBn: "খুলনা", fam: "সুন্দরবনের কলাগাছিয়া ও মোজাফফর গার্ডেন" },
  "Shariatpur": { bn: "শরীয়তপুর", dv: "Dhaka", dvBn: "ঢাকা", fam: "পদ্মা সেতু এপ্রোচ ও বুড়ির হাট মসজিদ" },
  "Sherpur": { bn: "শেরপুর", dv: "Mymensingh", dvBn: "ময়মনসিংহ", fam: "গজনী অবকাশ কেন্দ্র ও মধুটিলা ইকোপার্ক" },
  "Sirajganj": { bn: "সিরাজগঞ্জ", dv: "Rajshahi", dvBn: "রাজশাহী", fam: "যমুনা সেতু (বঙ্গবন্ধু সেতু) ও রবীন্দ্র কাচারি বাড়ি" },
  "Sunamganj": { bn: "সুনামগঞ্জ", dv: "Sylhet", dvBn: "সিলেট", fam: "টাঙ্গুয়ার হাওর, নীলাদ্রি লেক ও জাদুকাটা নদী" },
  "Sylhet": { bn: "সিলেট", dv: "Sylhet", dvBn: "সিলেট", fam: "জাফলং, বিছনাকান্দি, রাতারগুল ও হযরত শাহজালাল মাজার" },
  "Tangail": { bn: "টাঙ্গাইল", dv: "Dhaka", dvBn: "ঢাকা", fam: "আতিয়া মসজিদ, মহেরা জমিদার বাড়ি ও তাঁতের শাড়ি" },
  "Thakurgaon": { bn: "ঠাকুরগাঁও", dv: "Rangpur", dvBn: "রংপুর", fam: "বালিয়া মসজিদ ও রাজা টঙ্কনাথের রাজবাড়ি" },
};

export const THEMES: MapTheme[] = [
  {
    id: 'emerald',
    nameBn: 'সুন্দরবন এমারেল্ড',
    nameEn: 'Sundarban Emerald',
    bg: '#f4f9f5',
    visitedFill: '#0f766e',
    visitedStroke: '#134e4a',
    wishlistFill: '#f59e0b',
    wishlistStroke: '#d97706',
    unvisitedFill: '#e2ece7',
    unvisitedStroke: '#cadad2',
    divisionStroke: '#042f2e',
    textDark: true,
  },
  {
    id: 'padma_blue',
    nameBn: 'পদ্মা রিভার ব্লু',
    nameEn: 'Padma River Blue',
    bg: '#f0f7ff',
    visitedFill: '#1d4ed8',
    visitedStroke: '#1e3a8a',
    wishlistFill: '#fbbf24',
    wishlistStroke: '#b45309',
    unvisitedFill: '#dbeafe',
    unvisitedStroke: '#bfdbfe',
    divisionStroke: '#172554',
    textDark: true,
  },
  {
    id: 'kuakata_sunrise',
    nameBn: 'কুয়াকাটা সানরাইজ',
    nameEn: 'Kuakata Sunrise',
    bg: '#fffaf5',
    visitedFill: '#e11d48',
    visitedStroke: '#9f1239',
    wishlistFill: '#0284c7',
    wishlistStroke: '#0369a1',
    unvisitedFill: '#ffe4e6',
    unvisitedStroke: '#fecdd3',
    divisionStroke: '#881337',
    textDark: true,
  },
  {
    id: 'midnight_dark',
    nameBn: 'মিডনাইট গ্যালাক্সি',
    nameEn: 'Midnight Dark',
    bg: '#090d16',
    visitedFill: '#10b981',
    visitedStroke: '#34d399',
    wishlistFill: '#f59e0b',
    wishlistStroke: '#fbbf24',
    unvisitedFill: '#1e293b',
    unvisitedStroke: '#334155',
    divisionStroke: '#64748b',
    textDark: false,
  },
  {
    id: 'tea_garden',
    nameBn: 'সিলেট চা-বাগান',
    nameEn: 'Sylhet Tea Green',
    bg: '#fdfbf7',
    visitedFill: '#15803d',
    visitedStroke: '#166534',
    wishlistFill: '#ea580c',
    wishlistStroke: '#c2410c',
    unvisitedFill: '#e7edea',
    unvisitedStroke: '#cedad3',
    divisionStroke: '#14532d',
    textDark: true,
  }
];

export function getTravelerBadge(visitedCount: number) {
  if (visitedCount >= 50) {
    return { title: 'দেশসেরা পরিব্রাজক', en: 'Master Voyager', emoji: '👑', color: 'from-amber-500 to-yellow-400 text-amber-950' };
  }
  if (visitedCount >= 30) {
    return { title: 'অভিজ্ঞ পর্যটক', en: 'Seasoned Wanderer', emoji: '🧭', color: 'from-emerald-600 to-teal-500 text-white' };
  }
  if (visitedCount >= 15) {
    return { title: 'দেশপ্রেমী মুসাফির', en: 'National Explorer', emoji: '🏕️', color: 'from-blue-600 to-indigo-500 text-white' };
  }
  if (visitedCount >= 5) {
    return { title: 'ভ্রমণ অনুরাগী', en: 'Travel Enthusiast', emoji: '🎒', color: 'from-teal-600 to-emerald-500 text-white' };
  }
  return { title: 'নবীন পরিব্রাজক', en: 'Rookie Traveler', emoji: '🌱', color: 'from-slate-600 to-slate-500 text-white' };
}

export function toBengaliNumber(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)]);
}

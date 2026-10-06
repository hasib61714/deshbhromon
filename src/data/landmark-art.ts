export type LandmarkCategory = 'beach' | 'hills' | 'tea' | 'mangrove' | 'heritage' | 'river_haor' | 'plains';

export interface DistrictArtMeta {
  landmarkNameBn: string;
  landmarkNameEn: string;
  category: LandmarkCategory;
  gradient: [string, string, string]; // Top, Mid, Bottom
  accentColor: string;
}

export const DISTRICT_ART_DATA: Record<string, DistrictArtMeta> = {
  "Cox's Bazar": {
    landmarkNameBn: "কক্সবাজার সমুদ্র সৈকত ও ইনানী",
    landmarkNameEn: "Cox's Bazar Beach & Inani Coral",
    category: "beach",
    gradient: ["#0f172a", "#0369a1", "#0284c7"],
    accentColor: "#f59e0b",
  },
  "Dhaka": {
    landmarkNameBn: "ঐতিহাসিক লালবাগ কেল্লা ও আহসান মঞ্জিল",
    landmarkNameEn: "Lalbagh Fort & Ahsan Manzil",
    category: "heritage",
    gradient: ["#1e1b4b", "#831843", "#9d174d"],
    accentColor: "#fbbf24",
  },
  "Sylhet": {
    landmarkNameBn: "রাতারগুল সোয়াম্প ফরেস্ট ও জাফলং",
    landmarkNameEn: "Ratargul Swamp Forest & Jaflong",
    category: "tea",
    gradient: ["#064e3b", "#047857", "#10b981"],
    accentColor: "#a7f3d0",
  },
  "Bandarban": {
    landmarkNameBn: "নীলগিরি, নাফাখুম ও কেওক্রাডং",
    landmarkNameEn: "Nilgiri Peak & Keokradong Hills",
    category: "hills",
    gradient: ["#09090b", "#1e1b4b", "#4338ca"],
    accentColor: "#38bdf8",
  },
  "Rangamati": {
    landmarkNameBn: "কাপ্তাই লেক ও ঝুলন্ত সেতু",
    landmarkNameEn: "Kaptai Lake & Hanging Bridge",
    category: "river_haor",
    gradient: ["#082f49", "#0284c7", "#38bdf8"],
    accentColor: "#fde047",
  },
  "Khulna": {
    landmarkNameBn: "সুন্দরবন রয়েল বেঙ্গল টাইগার রিজার্ভ",
    landmarkNameEn: "Sundarbans Mangrove Wilderness",
    category: "mangrove",
    gradient: ["#022c22", "#065f46", "#047857"],
    accentColor: "#34d399",
  },
  "Bagerhat": {
    landmarkNameBn: "ইউনেস্কো বিশ্ব ঐতিহ্য ষাট গম্বুজ মসজিদ",
    landmarkNameEn: "Sixty Dome Mosque UNESCO Heritage",
    category: "heritage",
    gradient: ["#451a03", "#78350f", "#92400e"],
    accentColor: "#fbbf24",
  },
  "Patuakhali": {
    landmarkNameBn: "কুয়াকাটা সূর্যোদয় ও সূর্যাস্ত সাগরকন্যা",
    landmarkNameEn: "Kuakata Beach Sunrise & Sunset",
    category: "beach",
    gradient: ["#1e1b4b", "#c2410c", "#ea580c"],
    accentColor: "#fef08a",
  },
  "Sunamganj": {
    landmarkNameBn: "টাঙ্গুয়ার হাওর ও নীলাদ্রি নীল জলের লেক",
    landmarkNameEn: "Tanguar Haor & Niladri Lake",
    category: "river_haor",
    gradient: ["#0f172a", "#0f766e", "#14b8a6"],
    accentColor: "#6ee7b7",
  },
  "Moulvibazar": {
    landmarkNameBn: "শ্রীমঙ্গল চায়ের রাজধানী ও লাউয়াছড়া রেইনফরেস্ট",
    landmarkNameEn: "Sreemangal Tea Estates & Lawachara",
    category: "tea",
    gradient: ["#064e3b", "#065f46", "#15803d"],
    accentColor: "#86efac",
  },
  "Bogura": {
    landmarkNameBn: "মহাস্থানগড় প্রাচীন পুণ্ড্রনগর",
    landmarkNameEn: "Mahasthangarh Ancient Citadel",
    category: "heritage",
    gradient: ["#3b0764", "#701a75", "#86198f"],
    accentColor: "#f472b6",
  },
  "Rajshahi": {
    landmarkNameBn: "পদ্মার পাড়, বরেন্দ্র জাদুঘর ও বাঘা মসজিদ",
    landmarkNameEn: "Padma Riverbank & Bagha Mosque",
    category: "heritage",
    gradient: ["#451a03", "#9a3412", "#c2410c"],
    accentColor: "#fde047",
  },
  "Panchagarh": {
    landmarkNameBn: "তেঁতুলিয়া কাঞ্চনজঙ্ঘা দর্শন ও সমতল চা বাগান",
    landmarkNameEn: "Tetulia Kanchenjunga View & Tea",
    category: "tea",
    gradient: ["#022c22", "#0f766e", "#0284c7"],
    accentColor: "#f0fdf4",
  },
  "Dinajpur": {
    landmarkNameBn: "কান্তজীউ মন্দির টেরাকোটা স্থাপত্য ও রামসাগর",
    landmarkNameEn: "Kantajew Temple & Ramsagar Lake",
    category: "heritage",
    gradient: ["#701a75", "#9d174d", "#be123c"],
    accentColor: "#fef08a",
  },
  "Natore": {
    landmarkNameBn: "উত্তরা গণভবন ও দিঘাপতিয়া রাজবাড়ি",
    landmarkNameEn: "Uttara Ganabhaban & Dighapatia Palace",
    category: "heritage",
    gradient: ["#1c1917", "#44403c", "#78716c"],
    accentColor: "#fbbf24",
  },
  "Barishal": {
    landmarkNameBn: "ভাসমান পেয়ারা বাজার ও জলবেষ্টিত নদীমাতৃক খাল",
    landmarkNameEn: "Floating Guava Market Backwaters",
    category: "river_haor",
    gradient: ["#042f2e", "#115e59", "#0d9488"],
    accentColor: "#5eead4",
  },
  "Chandpur": {
    landmarkNameBn: "পদ্মা-মেঘনা-ডাকাতিয়া মোহনা ও রূপালী ইলিশের হাট",
    landmarkNameEn: "Padma-Meghna Estuary & Hilsa Fishery",
    category: "river_haor",
    gradient: ["#082f49", "#0369a1", "#0284c7"],
    accentColor: "#e0f2fe",
  },
  "Cumilla": {
    landmarkNameBn: "শালবন বৌদ্ধ বিহার ও ময়নামতী প্রত্নতত্ত্ব",
    landmarkNameEn: "Shalban Vihara Buddhist Monastery",
    category: "heritage",
    gradient: ["#312e81", "#4338ca", "#6366f1"],
    accentColor: "#fcd34d",
  },
  "Netrokona": {
    landmarkNameBn: "বিরিশিরি বিজয়পুর চীনামাটির পাহাড় ও নীল হ্রদ",
    landmarkNameEn: "Birishiri White Clay Hills & Blue Lake",
    category: "hills",
    gradient: ["#0f172a", "#155e75", "#0891b2"],
    accentColor: "#67e8f9",
  },
  "Tangail": {
    landmarkNameBn: "মহেরা জমিদার বাড়ি ও আতিয়া মসজিদ",
    landmarkNameEn: "Mohera Jamindar Palace & Atia Mosque",
    category: "heritage",
    gradient: ["#1e1b4b", "#6b21a8", "#9333ea"],
    accentColor: "#fbcfe8",
  },
  "Narayanganj": {
    landmarkNameBn: "ঐতিহাসিক সোনারগাঁও পানাম নগর ও লোকশিল্প জাদুঘর",
    landmarkNameEn: "Panam City & Sonargaon Folk Museum",
    category: "heritage",
    gradient: ["#451a03", "#78350f", "#b45309"],
    accentColor: "#fde68a",
  },
  "Gazipur": {
    landmarkNameBn: "বঙ্গবন্ধু সাফারি পার্ক ও ভাওয়াল শালবন",
    landmarkNameEn: "Safari Park & Bhawal Sal Forest",
    category: "plains",
    gradient: ["#022c22", "#14532d", "#166534"],
    accentColor: "#86efac",
  },
  "Munshiganj": {
    landmarkNameBn: "ইদ্রাকপুর জলদুর্গ ও পদ্মা সেতুর উত্তর প্রান্ত",
    landmarkNameEn: "Idrakpur Water Fort & Padma Bridge",
    category: "heritage",
    gradient: ["#0c4a6e", "#0284c7", "#38bdf8"],
    accentColor: "#fed7aa",
  },
  "Mymensingh": {
    landmarkNameBn: "ঐতিহাসিক শশী লজ ও শান্ত ব্রহ্মপুত্র নদ",
    landmarkNameEn: "Shashi Lodge & Brahmaputra River",
    category: "heritage",
    gradient: ["#1c1917", "#44403c", "#57534e"],
    accentColor: "#f59e0b",
  }
};

// Generic factory for districts without explicit custom metadata
export function getDistrictArtMeta(districtId: string, districtNameBn: string, divisionBn: string): DistrictArtMeta {
  if (DISTRICT_ART_DATA[districtId]) {
    return DISTRICT_ART_DATA[districtId];
  }

  // Provide category and harmonious theme based on division & geography
  if (divisionBn.includes('চট্টগ্রাম') || districtId.includes('Khagrachhari') || districtId.includes('Feni')) {
    return {
      landmarkNameBn: `${districtNameBn} প্রাকৃতিক পাহাড় ও সবুজ উপত্যকা`,
      landmarkNameEn: `${districtId} Scenic Hills & Green Valleys`,
      category: 'hills',
      gradient: ['#0f172a', '#1e1b4b', '#3b82f6'],
      accentColor: '#38bdf8',
    };
  }

  if (divisionBn.includes('খুলনা') || divisionBn.includes('বরিশাল') || districtId.includes('Bhola')) {
    return {
      landmarkNameBn: `${districtNameBn} নদীমাতৃক জলধারা ও গ্রামীন রূপ`,
      landmarkNameEn: `${districtId} Riverine Waterways & Rural Charm`,
      category: 'river_haor',
      gradient: ['#042f2e', '#0f766e', '#14b8a6'],
      accentColor: '#2dd4bf',
    };
  }

  if (divisionBn.includes('সিলেট')) {
    return {
      landmarkNameBn: `${districtNameBn} সবুজ চা বাগান ও পাহাড়ি ঝর্ণা`,
      landmarkNameEn: `${districtId} Emerald Tea Gardens & Cascades`,
      category: 'tea',
      gradient: ['#064e3b', '#047857', '#10b981'],
      accentColor: '#6ee7b7',
    };
  }

  if (divisionBn.includes('রাজশাহী') || divisionBn.includes('রংপুর')) {
    return {
      landmarkNameBn: `${districtNameBn} ঐতিহ্যবাহী স্থাপত্য ও সবুজ সমতল`,
      landmarkNameEn: `${districtId} Heritage Architecture & Plains`,
      category: 'heritage',
      gradient: ['#451a03', '#854d0e', '#b45309'],
      accentColor: '#fde047',
    };
  }

  return {
    landmarkNameBn: `${districtNameBn} রূপসী বাংলার ঐতিহ্য ও প্রকৃতি`,
    landmarkNameEn: `${districtId} Heritage & Rural Landscape`,
    category: 'plains',
    gradient: ['#064e3b', '#0d9488', '#0284c7'],
    accentColor: '#fde047',
  };
}

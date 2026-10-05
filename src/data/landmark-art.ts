export type LandmarkCategory = 'beach' | 'hills' | 'tea' | 'mangrove' | 'heritage' | 'river_haor' | 'plains';

export interface DistrictArtMeta {
  landmarkNameBn: string;
  landmarkNameEn: string;
  category: LandmarkCategory;
  gradient: [string, string, string]; // Top, Mid, Bottom
  accentColor: string;
  aiPrompt: string;
}

export const DISTRICT_ART_DATA: Record<string, DistrictArtMeta> = {
  "Cox's Bazar": {
    landmarkNameBn: "কক্সবাজার সমুদ্র সৈকত ও ইনানী",
    landmarkNameEn: "Cox's Bazar Beach & Inani Coral",
    category: "beach",
    gradient: ["#0f172a", "#0369a1", "#0284c7"],
    accentColor: "#f59e0b",
    aiPrompt: "Cinematic sunset over Cox's Bazar unbroken sandy coastline, golden ocean waves, traditional wooden moon-shaped fishing sampan boats on shore, ultra-realistic travel photography, 8k."
  },
  "Dhaka": {
    landmarkNameBn: "ঐতিহাসিক লালবাগ কেল্লা ও আহসান মঞ্জিল",
    landmarkNameEn: "Lalbagh Fort & Ahsan Manzil",
    category: "heritage",
    gradient: ["#1e1b4b", "#831843", "#9d174d"],
    accentColor: "#fbbf24",
    aiPrompt: "Majestic 17th century Lalbagh Fort Mughal red-terracotta architecture at dusk, reflective water fountains, lush Persian garden, warm glowing lantern illumination, 8k."
  },
  "Sylhet": {
    landmarkNameBn: "রাতারগুল সোয়াম্প ফরেস্ট ও জাফলং",
    landmarkNameEn: "Ratargul Swamp Forest & Jaflong",
    category: "tea",
    gradient: ["#064e3b", "#047857", "#10b981"],
    accentColor: "#a7f3d0",
    aiPrompt: "Emerald green freshwater swamp forest of Ratargul, tranquil mirror-like waters reflecting submerged evergreen trees, traditional wooden canoe boat gliding gently, misty sunrise."
  },
  "Bandarban": {
    landmarkNameBn: "নীলগিরি, নাফাখুম ও কেওক্রাডং",
    landmarkNameEn: "Nilgiri Peak & Keokradong Hills",
    category: "hills",
    gradient: ["#09090b", "#1e1b4b", "#4338ca"],
    accentColor: "#38bdf8",
    aiPrompt: "Aerial dramatic view of Nilgiri mountain peak rising above a sea of fluffy white clouds in Bandarban, winding mountain roads, ethereal golden morning light, cinematic atmosphere."
  },
  "Rangamati": {
    landmarkNameBn: "কাপ্তাই লেক ও ঝুলন্ত সেতু",
    landmarkNameEn: "Kaptai Lake & Hanging Bridge",
    category: "river_haor",
    gradient: ["#082f49", "#0284c7", "#38bdf8"],
    accentColor: "#fde047",
    aiPrompt: "Crystal clear emerald blue waters of Kaptai Lake surrounded by verdant rolling hill tracts, iconic red hanging bridge connecting scenic green islands, wooden boat sailing."
  },
  "Khulna": {
    landmarkNameBn: "সুন্দরবন রয়েল বেঙ্গল টাইগার রিজার্ভ",
    landmarkNameEn: "Sundarbans Mangrove Wilderness",
    category: "mangrove",
    gradient: ["#022c22", "#065f46", "#047857"],
    accentColor: "#34d399",
    aiPrompt: "Ancient mysterious mangrove creeks of Sundarbans, towering sundari trees with pneumatophores, spotted chital deer drinking at mist-shrouded riverbank, ethereal morning wilderness."
  },
  "Bagerhat": {
    landmarkNameBn: "ইউনেস্কো বিশ্ব ঐতিহ্য ষাট গম্বুজ মসজিদ",
    landmarkNameEn: "Sixty Dome Mosque UNESCO Heritage",
    category: "heritage",
    gradient: ["#451a03", "#78350f", "#92400e"],
    accentColor: "#fbbf24",
    aiPrompt: "15th-century Sixty Dome Mosque brick terracotta domes glowing under warm golden hour sunlight, architectural arches, tranquil historical pond in foreground, UNESCO masterpiece."
  },
  "Patuakhali": {
    landmarkNameBn: "কুয়াকাটা সূর্যোদয় ও সূর্যাস্ত সাগরকন্যা",
    landmarkNameEn: "Kuakata Beach Sunrise & Sunset",
    category: "beach",
    gradient: ["#1e1b4b", "#c2410c", "#ea580c"],
    accentColor: "#fef08a",
    aiPrompt: "Dazzling sunrise over Kuakata beach where ocean meets horizon, red crabs on wet silver sands, fishermen pulling coconut-coir nets, vibrant orange and purple sky."
  },
  "Sunamganj": {
    landmarkNameBn: "টাঙ্গুয়ার হাওর ও নীলাদ্রি নীল জলের লেক",
    landmarkNameEn: "Tanguar Haor & Niladri Lake",
    category: "river_haor",
    gradient: ["#0f172a", "#0f766e", "#14b8a6"],
    accentColor: "#6ee7b7",
    aiPrompt: "Vast serene wetland horizon of Tanguar Haor reflecting blue sky, lush water lilies, houseboats anchored near Niladri turquoise limestone lake with Meghalaya hills backdrop."
  },
  "Moulvibazar": {
    landmarkNameBn: "শ্রীমঙ্গল চায়ের রাজধানী ও লাউয়াছড়া রেইনফরেস্ট",
    landmarkNameEn: "Sreemangal Tea Estates & Lawachara",
    category: "tea",
    gradient: ["#064e3b", "#065f46", "#15803d"],
    accentColor: "#86efac",
    aiPrompt: "Geometric terraced rolling tea gardens of Sreemangal under morning golden dew, shade trees canopying hills, female tea pluckers in colorful attire, picturesque travel photograph."
  },
  "Bogura": {
    landmarkNameBn: "মহাস্থানগড় প্রাচীন পুণ্ড্রনগর",
    landmarkNameEn: "Mahasthangarh Ancient Citadel",
    category: "heritage",
    gradient: ["#3b0764", "#701a75", "#86198f"],
    accentColor: "#f472b6",
    aiPrompt: "Ancient 3rd-century BC fortified citadel walls of Mahasthangarh rising above Karatoya river valley, archaeological terracotta relics, dramatic sunset over historical mounds."
  },
  "Rajshahi": {
    landmarkNameBn: "পদ্মার পাড়, বরেন্দ্র জাদুঘর ও বাঘা মসজিদ",
    landmarkNameEn: "Padma Riverbank & Bagha Mosque",
    category: "heritage",
    gradient: ["#451a03", "#9a3412", "#c2410c"],
    accentColor: "#fde047",
    aiPrompt: "Historic Bagha Mosque featuring intricate Mughal terracotta floral carvings, majestic mango orchards lining calm banks of the roaring Padma river at golden hour."
  },
  "Panchagarh": {
    landmarkNameBn: "তেঁতুলিয়া কাঞ্চনজঙ্ঘা দর্শন ও সমতল চা বাগান",
    landmarkNameEn: "Tetulia Kanchenjunga View & Tea",
    category: "tea",
    gradient: ["#022c22", "#0f766e", "#0284c7"],
    accentColor: "#f0fdf4",
    aiPrompt: "Spectacular snow-capped Himalayan summit of Mount Kanchenjunga glistening pink and gold on northern horizon, viewed from organic green plainland tea gardens of Tetulia."
  },
  "Dinajpur": {
    landmarkNameBn: "কান্তজীউ মন্দির টেরাকোটা স্থাপত্য ও রামসাগর",
    landmarkNameEn: "Kantajew Temple & Ramsagar Lake",
    category: "heritage",
    gradient: ["#701a75", "#9d174d", "#be123c"],
    accentColor: "#fef08a",
    aiPrompt: "18th-century Kantajew temple covered entirely in thousands of detailed mythological terracotta plaques, towering spire silhouette against dramatic evening sunset sky."
  },
  "Natore": {
    landmarkNameBn: "উত্তরা গণভবন ও দিঘাপতিয়া রাজবাড়ি",
    landmarkNameEn: "Uttara Ganabhaban & Dighapatia Palace",
    category: "heritage",
    gradient: ["#1c1917", "#44403c", "#78716c"],
    accentColor: "#fbbf24",
    aiPrompt: "Royal palace of Dighapatia with Victorian grand entrance gate, royal clock tower, Italian marble sculptures, tranquil manicured gardens with flowing fountains."
  },
  "Barishal": {
    landmarkNameBn: "ভাসমান পেয়ারা বাজার ও জলবেষ্টিত নদীমাতৃক খাল",
    landmarkNameEn: "Floating Guava Market Backwaters",
    category: "river_haor",
    gradient: ["#042f2e", "#115e59", "#0d9488"],
    accentColor: "#5eead4",
    aiPrompt: "Famous floating guava market at Bhimruli, dozens of traditional wooden dinghy boats laden with green guavas crisscrossing serene tropical canal lined with betel nut palms."
  },
  "Chandpur": {
    landmarkNameBn: "পদ্মা-মেঘনা-ডাকাতিয়া মোহনা ও রূপালী ইলিশের হাট",
    landmarkNameEn: "Padma-Meghna Estuary & Hilsa Fishery",
    category: "river_haor",
    gradient: ["#082f49", "#0369a1", "#0284c7"],
    accentColor: "#e0f2fe",
    aiPrompt: "Vast confluence of three majestic rivers Padma, Meghna and Dakatia in Chandpur, traditional fishermen with circular drop nets catching silver hilsa at breezy sunset."
  },
  "Cumilla": {
    landmarkNameBn: "শালবন বৌদ্ধ বিহার ও ময়নামতী প্রত্নতত্ত্ব",
    landmarkNameEn: "Shalban Vihara Buddhist Monastery",
    category: "heritage",
    gradient: ["#312e81", "#4338ca", "#6366f1"],
    accentColor: "#fcd34d",
    aiPrompt: "Ancient 8th-century terracotta ruins of Shalban Vihara monastic cells and central Buddhist cruciform temple surrounded by red clay hills of Lalmai."
  },
  "Netrokona": {
    landmarkNameBn: "বিরিশিরি বিজয়পুর চীনামাটির পাহাড় ও নীল হ্রদ",
    landmarkNameEn: "Birishiri White Clay Hills & Blue Lake",
    category: "hills",
    gradient: ["#0f172a", "#155e75", "#0891b2"],
    accentColor: "#67e8f9",
    aiPrompt: "Pristine turquoise blue water lake nestled between sparkling white and pink china clay hills in Birishiri, traditional Garo tribal homesteads, crystal Someshwari river."
  },
  "Tangail": {
    landmarkNameBn: "মহেরা জমিদার বাড়ি ও আতিয়া মসজিদ",
    landmarkNameEn: "Mohera Jamindar Palace & Atia Mosque",
    category: "heritage",
    gradient: ["#1e1b4b", "#6b21a8", "#9333ea"],
    accentColor: "#fbcfe8",
    aiPrompt: "Majestic Mohera Zamindar mansion with ornate Greco-Roman classical pillars, ornate balconies overlooking lush floral gardens and decorative reflecting pool."
  },
  "Narayanganj": {
    landmarkNameBn: "ঐতিহাসিক সোনারগাঁও পানাম নগর ও লোকশিল্প জাদুঘর",
    landmarkNameEn: "Panam City & Sonargaon Folk Museum",
    category: "heritage",
    gradient: ["#451a03", "#78350f", "#b45309"],
    accentColor: "#fde68a",
    aiPrompt: "Eerie and romantic deserted colonial street of historic Panam Nagar, brick townhouses with intricate colonial-Mughal stucco ornamentation, Shitalakshya river nearby."
  },
  "Gazipur": {
    landmarkNameBn: "বঙ্গবন্ধু সাফারি পার্ক ও ভাওয়াল শালবন",
    landmarkNameEn: "Safari Park & Bhawal Sal Forest",
    category: "plains",
    gradient: ["#022c22", "#14532d", "#166534"],
    accentColor: "#86efac",
    aiPrompt: "Dense green canopy of ancient Sal tree forest in Bhawal, dappled sunlight breaking through towering tree trunks, tranquil forest pathway for nature walks."
  },
  "Munshiganj": {
    landmarkNameBn: "ইদ্রাকপুর জলদুর্গ ও পদ্মা সেতুর উত্তর প্রান্ত",
    landmarkNameEn: "Idrakpur Water Fort & Padma Bridge",
    category: "heritage",
    gradient: ["#0c4a6e", "#0284c7", "#38bdf8"],
    accentColor: "#fed7aa",
    aiPrompt: "17th-century Idrakpur river fortress circular watchtowers guarding ancient waterway, with modern architectural marvel Padma Bridge stretching to horizon in distance."
  },
  "Mymensingh": {
    landmarkNameBn: "ঐতিহাসিক শশী লজ ও শান্ত ব্রহ্মপুত্র নদ",
    landmarkNameEn: "Shashi Lodge & Brahmaputra River",
    category: "heritage",
    gradient: ["#1c1917", "#44403c", "#57534e"],
    accentColor: "#f59e0b",
    aiPrompt: "Ornate neo-classical palace of Shashi Lodge with Parisian marble Venus statue on fountain lawn, gentle breeze rustling along historical sandy Brahmaputra riverside."
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
      aiPrompt: `Breathtaking mountain ridges and rolling lush hills of ${districtId}, traditional tribal settlements, morning mist rolling over peaceful valleys.`
    };
  }

  if (divisionBn.includes('খুলনা') || divisionBn.includes('বরিশাল') || districtId.includes('Bhola')) {
    return {
      landmarkNameBn: `${districtNameBn} নদীমাতৃক জলধারা ও গ্রামীন রূপ`,
      landmarkNameEn: `${districtId} Riverine Waterways & Rural Charm`,
      category: 'river_haor',
      gradient: ['#042f2e', '#0f766e', '#14b8a6'],
      accentColor: '#2dd4bf',
      aiPrompt: `Serene river delta canals of ${districtId}, country boats loaded with crops gliding along coconut palm-lined shores at tranquil sunset.`
    };
  }

  if (divisionBn.includes('সিলেট')) {
    return {
      landmarkNameBn: `${districtNameBn} সবুজ চা বাগান ও পাহাড়ি ঝর্ণা`,
      landmarkNameEn: `${districtId} Emerald Tea Gardens & Cascades`,
      category: 'tea',
      gradient: ['#064e3b', '#047857', '#10b981'],
      accentColor: '#6ee7b7',
      aiPrompt: `Vibrant rolling hills of fresh green tea bushes in ${districtId}, stone-strewn crystal water stream cascading down hillside.`
    };
  }

  if (divisionBn.includes('রাজশাহী') || divisionBn.includes('রংপুর')) {
    return {
      landmarkNameBn: `${districtNameBn} ঐতিহ্যবাহী স্থাপত্য ও সবুজ সমতল`,
      landmarkNameEn: `${districtId} Heritage Architecture & Plains`,
      category: 'heritage',
      gradient: ['#451a03', '#854d0e', '#b45309'],
      accentColor: '#fde047',
      aiPrompt: `Historic terracotta brick landmark of ${districtId} glowing warmly in late afternoon golden hour, vast open lush green agricultural fields.`
    };
  }

  return {
    landmarkNameBn: `${districtNameBn} রূপসী বাংলার ঐতিহ্য ও প্রকৃতি`,
    landmarkNameEn: `${districtId} Heritage & Rural Landscape`,
    category: 'plains',
    gradient: ['#064e3b', '#0d9488', '#0284c7'],
    accentColor: '#fde047',
    aiPrompt: `Idyllic rural landscape of ${districtId} in Bangladesh, traditional wooden fishing boat anchored on peaceful riverbank under majestic banyan tree.`
  };
}

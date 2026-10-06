import { FoodItem, FoodPhoto } from '../types';

const BASE_FOODS: FoodItem[] = [
  {
    id: 'f1',
    districtId: 'Bogura',
    nameBn: 'বগুড়ার দই',
    category: 'sweet',
    desc: 'মাটির হাঁড়িতে জমানো মিষ্টি ও ঘন দই; বগুড়ার সবচেয়ে পরিচিত খাবারগুলোর একটি।'
  },
  {
    id: 'f2',
    districtId: 'Cumilla',
    nameBn: 'কুমিল্লার মাতৃভাণ্ডারের রসমালাই',
    category: 'sweet',
    desc: 'গাঢ় ঘন দুধে ডোবানো ছোট ছোট নরম রসগোল্লার ঐতিহ্যবাহী বিখ্যাত মিষ্টি।'
  },
  {
    id: 'f3',
    districtId: 'Natore',
    nameBn: 'নাটোরের কাঁচাগোল্লা',
    category: 'sweet',
    desc: 'খাঁটি ছানা ও চিনির মৃদু সুবাসে তৈরি মুখের ভেতর গলে যাওয়া ঐতিহ্যবাহী মিষ্টি।'
  },
  {
    id: 'f4',
    districtId: 'Tangail',
    nameBn: 'পোড়াবাড়ির চমচম',
    category: 'sweet',
    desc: 'পোড়াবাড়ির সুমিষ্ট মিষ্টি, যার ওপরে মাওয়ার গুঁড়া ছিটানো থাকে এবং ভেতরে রসালো।'
  },
  {
    id: 'f5',
    districtId: 'Mymensingh',
    nameBn: 'মুক্তাগাছার মণ্ডা',
    category: 'sweet',
    desc: 'রামগোপাল পাল কর্তৃক ১৮২৪ সালে উদ্ভাবিত বিশেষ ছানা ও ক্ষীরের মিষ্টি।'
  },
  {
    id: 'f6',
    districtId: 'Netrokona',
    nameBn: 'নেত্রকোণার বালিশ মিষ্টি',
    category: 'sweet',
    desc: 'বালিশের মতো বড় ও নরম আকৃতির রসালো মিষ্টি, নেত্রকোণার পরিচিত খাবার।'
  },
  {
    id: 'f7',
    districtId: 'Khulna',
    nameBn: 'চুইঝালের মাংস',
    category: 'main',
    desc: 'চুই গাছের কান্ড দিয়ে রান্না করা তীব্র ঝাল ও মন মাতানো সুবাসযুক্ত খাসির মাংস।'
  },
  {
    id: 'f8',
    districtId: 'Chattogram',
    nameBn: 'মেজবানি মাংস ও নলা ঝোল',
    category: 'main',
    desc: 'চট্টগ্রামের ঐতিহ্যবাহী মেজবানে পরিবেশিত বিশেষ মসলায় রান্না করা লাল মাংস ও চনার ডাল।'
  },
  {
    id: 'f9',
    districtId: 'Sylhet',
    nameBn: 'সাতকড়া দিয়ে গরুর মাংস',
    category: 'main',
    desc: 'সিলেটের পাহাড়ি টক ফল সাতকড়া দিয়ে রান্না করা অনন্য স্বাদের গোশত।'
  },
  {
    id: 'f10',
    districtId: 'Chandpur',
    nameBn: 'পদ্মার রূপালী ইলিশ ও লেজ ভর্তা',
    category: 'main',
    desc: 'পদ্মা ও মেঘনার মোহনায় ধরা পড়া টাটকা ভাজা ইলিশ, সাথে গরম ভাতে ইলিশের তেল।'
  },
  {
    id: 'f11',
    districtId: 'Dhaka',
    nameBn: 'পুরান ঢাকার বাকরখানি ও বিরিয়ানি',
    category: 'snack',
    desc: 'মচমচে বাদামি বাকরখানি এবং খাঁটি ঘি ও বাসমতি চালের কাচ্চি বিরিয়ানি।'
  },
  {
    id: 'f12',
    districtId: 'Cox\'s Bazar',
    nameBn: 'রূপচাঁদা ফ্রাই ও লইট্টা ফ্রাই',
    category: 'main',
    desc: 'সমুদ্রের তাজা রূপচাঁদা ও মচমচে লইট্টা মাছের ফ্রাই সাথে স্পাইসি চাটনি।'
  },
  {
    id: 'f13',
    districtId: 'Bhola',
    nameBn: 'মহিষের দুধের কাঁচা দই',
    category: 'sweet',
    desc: 'ভোলার ঐতিহ্যবাহী তাজা মহিষের খাঁটি দুধের ঘন টক-মিষ্টি দই।'
  },
  {
    id: 'f14',
    districtId: 'Rajshahi',
    nameBn: 'রাজশাহীর ক্ষীরশাপাত ও ল্যাংড়া আম',
    category: 'fruit',
    desc: 'মধুমাসের সেরা উপহার—পাতলা চামড়া, আঁশহীন ও অতুলনীয় মিষ্টি স্বাদের আম।'
  },
  {
    id: 'f15',
    districtId: 'Chapainawabganj',
    nameBn: 'কলাইয়ের রুটি ও হাঁসের মাংস',
    category: 'main',
    desc: 'মাষকলাই ও চালের গুঁড়া দিয়ে পোড়ানো গরম রুটি, বেগুন ভর্তা ও হাঁসের ঝাল মাংস।'
  },
  {
    id: 'f16',
    districtId: 'Kushtia',
    nameBn: 'কুষ্টিয়ার কুলফি মালাই ও তিলের খাজা',
    category: 'sweet',
    desc: 'কুষ্টিয়ার পরিচিত তিলের খাজা ও কুলফি মালাই।'
  },
  {
    id: 'f17',
    districtId: 'Jashore',
    nameBn: 'নলেন গুড়ের সন্দেশ ও খেজুর রস',
    category: 'sweet',
    desc: 'শীতকালের গাছিদের সংগৃহীত টাটকা খেজুর রস ও পাটালি গুড়ের মিষ্টি সন্দেশ।'
  },
  {
    id: 'f18',
    districtId: 'Meherpur',
    nameBn: 'সাবিত্রী ও রসকদম্ব',
    category: 'sweet',
    desc: 'মেহেরপুরের ঐতিহ্যবাহী শুকনো ধরনের মিষ্টি।'
  },
  {
    id: 'f19',
    districtId: 'Pirojpur',
    nameBn: 'স্বরূপকাঠির পেয়ারা ও আমড়া',
    category: 'fruit',
    desc: 'পিরোজপুরের স্বরূপকাঠি এলাকা ভাসমান পেয়ারা বাজার ও রসালো ফলের জন্য পরিচিত।'
  },
  {
    id: 'f20',
    districtId: 'Sunamganj',
    nameBn: 'টাঙ্গুয়ার হাওরের তাজা বোয়াল ও চ্যাপা শুঁটকি',
    category: 'main',
    desc: 'হাওর থেকে সদ্য শিকার করা নদীর তাজা মাছ ও সুস্বাদু চ্যাপা শুঁটকির তরকারি।'
  },
  {
    id: 'p1',
    districtId: 'Brahmanbaria',
    nameBn: 'ব্রাহ্মণবাড়িয়ার ছানামুখী মিষ্টি',
    category: 'sweet',
    desc: 'ব্রাহ্মণবাড়িয়া-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Chanamukhi01.jpg', by: 'Bellayet', lic: 'CC BY 2.5' }
  },
  {
    id: 'p2',
    districtId: 'Madaripur',
    nameBn: 'মাদারীপুরের রসগোল্লা',
    category: 'sweet',
    desc: 'মাদারীপুর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Rosogolla.jpg', by: 'Marajozkee', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p3',
    districtId: 'Satkhira',
    nameBn: 'সাতক্ষীরার সন্দেশ',
    category: 'sweet',
    desc: 'সাতক্ষীরা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Bengali_Sandesh.jpg', by: '1Bongfoodie', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p4',
    districtId: 'Sherpur',
    nameBn: 'শেরপুরের ছানার পায়েস',
    category: 'sweet',
    desc: 'শেরপুর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Kheer.jpg', by: 'stu spivack', lic: 'CC BY-SA 2.0' }
  },
  {
    id: 'p5',
    districtId: 'Munshiganj',
    nameBn: 'মুন্সীগঞ্জের পাতক্ষীর',
    category: 'sweet',
    desc: 'মুন্সীগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Patkhir_of_Munshiganj_A_Sweet_Legacy.jpg', by: 'Rayhanphotos', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p6',
    districtId: 'Kushtia',
    nameBn: 'কুষ্টিয়ার তিলের খাজা',
    category: 'snack',
    desc: 'কুষ্টিয়া-এর পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:%E0%A6%95%E0%A7%81%E0%A6%B7%E0%A7%8D%E0%A6%9F%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0_%E0%A6%AC%E0%A6%BF%E0%A6%96%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A4_%E0%A6%A4%E0%A6%BF%E0%A6%B2%E0%A7%87%E0%A6%B0_%E0%A6%96%E0%A6%BE%E0%A6%9C%E0%A6%BE.jpg', by: 'মোঃ সাকিবুল হাসান', lic: 'CC BY 4.0' }
  },
  {
    id: 'p7',
    districtId: 'Bogura',
    nameBn: 'মহাস্থানের কটকটি',
    category: 'snack',
    desc: 'বগুড়া-এর পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:%E0%A6%AE%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A5%E0%A6%BE%E0%A6%A8%E0%A6%97%E0%A6%A1%E0%A6%BC%E0%A7%87%E0%A6%B0_%27%E0%A6%95%E0%A6%9F%E0%A6%95%E0%A6%9F%E0%A6%BF%27_02.jpg', by: 'Mzz Tanmay', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p8',
    districtId: 'Kurigram',
    nameBn: 'কুড়িগ্রামের বাদাম',
    category: 'snack',
    desc: 'কুড়িগ্রাম-এর পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Frying_Peanut_(Arachis_hypogaea)_on_a_street_shop_(1).jpg', by: 'Nasir Khan Saikat', lic: 'CC BY-SA 3.0' }
  },
  {
    id: 'p9',
    districtId: 'Manikganj',
    nameBn: 'ঝিটকার হাজারি গুড়',
    category: 'sweet',
    desc: 'মানিকগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Jaggery,_bd.jpg', by: 'Ferdous', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p10',
    districtId: 'Khulna',
    nameBn: 'সুন্দরবনের মধু',
    category: 'sweet',
    desc: 'খুলনা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Honey_hunting_in_the_Sundarbans_Mangrove_Forest_in_Bangladesh.jpg', by: 'MohammadRakibulHasan1977', lic: 'CC BY 4.0' }
  },
  {
    id: 'p11',
    districtId: 'Dhaka',
    nameBn: 'পুরান ঢাকার কাচ্চি বিরিয়ানি',
    category: 'main',
    desc: 'ঢাকা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Kacchi_Biryani.jpg', by: 'ANKAN', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p12',
    districtId: 'Sunamganj',
    nameBn: 'সুনামগঞ্জের হাওরের মাছ ও শুঁটকি',
    category: 'main',
    desc: 'সুনামগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Chitala_Fish_and_Wallago_attu_Fish_in_a_Bangladeshi_market.jpg', by: 'Sm faysal', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p13',
    districtId: 'Cox\'s Bazar',
    nameBn: 'কক্সবাজারের সামুদ্রিক মাছ ও চিংড়ি',
    category: 'main',
    desc: 'কক্সবাজার-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Lobstar_fish.jpg', by: 'Rrose00', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p14',
    districtId: 'Khulna',
    nameBn: 'খুলনার চিংড়ি, সাদা সোনা',
    category: 'main',
    desc: 'খুলনা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Bangladeshi_shrimp.jpg', by: 'Mcepy', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p15',
    districtId: 'Bandarban',
    nameBn: 'বান্দরবানের ব্যাম্বু চিকেন',
    category: 'main',
    desc: 'বান্দরবান-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Tribal_bamboo_chicken_dish_from_Bandarban_Bangladesh.jpg', by: 'Sm faysal', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p16',
    districtId: 'Barishal',
    nameBn: 'বরিশালের বালাম চাল',
    category: 'main',
    desc: 'বরিশাল-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Grain_of_rice(3).jpg', by: 'চিত্রকথক', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p17',
    districtId: 'Barishal',
    nameBn: 'বরিশালের আমড়া',
    category: 'fruit',
    desc: 'বরিশাল-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Spondius_mombin_4_(_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-_%E0%A6%86%E0%A6%AE%E0%A6%A1%E0%A6%BC%E0%A6%BE).jpg', by: 'Salim_Khandoker', lic: 'CC BY-SA 3.0' }
  },
  {
    id: 'p18',
    districtId: 'Patuakhali',
    nameBn: 'পটুয়াখালীর তরমুজ',
    category: 'fruit',
    desc: 'পটুয়াখালী-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Watermelon_seller_at_lalbag.jpg', by: 'Wasiul Bahar', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p19',
    districtId: 'Pirojpur',
    nameBn: 'পিরোজপুরের নারিকেল',
    category: 'fruit',
    desc: 'পিরোজপুর-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Coconut_trees_of_Bangladesh_01.jpg', by: 'কামরুল ইসলাম শাহীন', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p20',
    districtId: 'Gazipur',
    nameBn: 'গাজীপুরের কাঁঠাল',
    category: 'fruit',
    desc: 'গাজীপুর-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Jackfruit_Bangladesh_(3).JPG', by: 'Shahnoor Habib Munmun', lic: 'CC BY 3.0' }
  },
  {
    id: 'p21',
    districtId: 'Narsingdi',
    nameBn: 'নরসিংদীর লটকন',
    category: 'fruit',
    desc: 'নরসিংদী-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Fruits_of_Baccaurea_motleyana_in_yellow_(Phyllanthaceae).JPG', by: 'NusHub', lic: 'CC BY-SA 3.0' }
  },
  {
    id: 'p22',
    districtId: 'Narsingdi',
    nameBn: 'নরসিংদীর সাগর কলা',
    category: 'fruit',
    desc: 'নরসিংদী-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:A_Bunch_of_Bananas_displayed_by_a_roadside_seller_02.jpg', by: 'Samsule2', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p23',
    districtId: 'Tangail',
    nameBn: 'মধুপুরের আনারস',
    category: 'fruit',
    desc: 'টাঙ্গাইল-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Pineapple_of_Modhupur_526.jpg', by: 'Frameofashik', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p24',
    districtId: 'Chapainawabganj',
    nameBn: 'চাঁপাইনবাবগঞ্জের আম (ফজলি, ল্যাংড়া, গোপালভোগ)',
    category: 'fruit',
    desc: 'চাঁপাইনবাবগঞ্জ-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Chopped_Amrapali_mango_on_a_tree,_Kurigram,_Bangladesh.jpg', by: 'Tanvir Rahat', lic: 'CC BY-SA 4.0' }
  },
  {
    id: 'p25',
    districtId: 'Dinajpur',
    nameBn: 'দিনাজপুরের লিচু',
    category: 'fruit',
    desc: 'দিনাজপুর-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Lychee_(%E0%A6%B2%E0%A6%BF%E0%A6%9A%E0%A7%81)_of_Rajshahi,_Bangladesh,_by_Nakib_Ahmed.jpg', by: 'Nakib Ahmed', lic: 'CC BY 3.0' }
  },
  {
    id: 'p26',
    districtId: 'Sylhet',
    nameBn: 'সিলেটের কমলা',
    category: 'fruit',
    desc: 'সিলেট-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:Mandarin_orange_3_Bangladesh_.jpg', by: 'Salim_Khandoker', lic: 'CC BY-SA 3.0' }
  },
  {
    id: 'p27',
    districtId: 'Sylhet',
    nameBn: 'সিলেটের সাতকরা',
    category: 'fruit',
    desc: 'সিলেট-এর পরিচিত স্থানীয় ফল।',
    img: { src: 'https://commons.wikimedia.org/wiki/File:%EA%A0%A2%EA%A0%A3%EA%A0%94%EA%A0%87%EA%A0%A0%EA%A0%A3.jpg', by: 'Akhtar Owais Ahmed / Flickr user: bandashing', lic: 'CC BY 2.0' }
  }
];

// Photos for the original foods: only where a credited Wikimedia Commons photo of the very same item
// exists in places.json (checked by a test); the rest show an honest placeholder instead of a wrong picture.
const PHOTOS: Record<string, FoodPhoto> = {
  f1: { src: 'https://commons.wikimedia.org/wiki/File:Mishti_Doi.jpg', by: 'Kirti Poddar', lic: 'CC BY 2.0' },
  f2: { src: 'https://commons.wikimedia.org/wiki/File:Ras_Malai.JPG', by: 'Miansari66', lic: 'CC0' },
  f3: { src: 'https://commons.wikimedia.org/wiki/File:%E0%A6%95%E0%A6%BE%E0%A6%81%E0%A6%9A%E0%A6%BE%E0%A6%97%E0%A7%8B%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE_(2).jpg', by: 'Dolon Prova', lic: 'CC BY-SA 4.0' },
  f4: { src: 'https://commons.wikimedia.org/wiki/File:Porabarir_chomchom,_Tangail.jpg', by: 'Ferdous', lic: 'CC BY-SA 4.0' },
  f5: { src: 'https://commons.wikimedia.org/wiki/File:%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%8D%E0%A6%A4%E0%A6%BE%E0%A6%97%E0%A6%BE%E0%A6%9B%E0%A6%BE%E0%A6%B0_%E0%A6%B8%E0%A6%BE%E0%A6%A5%E0%A7%87_%E0%A6%93%E0%A6%A4%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A7%8B%E0%A6%A4%E0%A6%AD%E0%A6%BE%E0%A6%AC%E0%A7%87_%E0%A6%9C%E0%A6%A1%E0%A6%BC%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A7%87_%E0%A6%86%E0%A6%9B%E0%A7%87_%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%8D%E0%A6%A4%E0%A6%BE%E0%A6%97%E0%A6%BE%E0%A6%9B%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%A3%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0_%E0%A6%A8%E0%A6%BE%E0%A6%AE.jpg', by: 'Najmul Huda', lic: 'CC BY-SA 4.0' },
  f7: { src: 'https://commons.wikimedia.org/wiki/File:Chui_jhal_(Piper_chaba).jpg', by: 'Salil Kumar Mukherjee', lic: 'CC BY-SA 4.0' },
  f8: { src: 'https://commons.wikimedia.org/wiki/File:Mezbani_meal_from_a_famous_restaurant_in_Chittagong_Bangladesh.jpg', by: 'Sm faysal', lic: 'CC BY-SA 4.0' },
  f10: { src: 'https://commons.wikimedia.org/wiki/File:Hilsa_fishes_of_Padma_river.jpg', by: 'Zaheed Sarwer Khan', lic: 'CC BY 4.0' },
  f11: { src: 'https://commons.wikimedia.org/wiki/File:Bakarkhani_at_puran_dhaka_5.jpg', by: 'Wasiul Bahar', lic: 'CC BY-SA 4.0' },
  f13: { src: 'https://commons.wikimedia.org/wiki/File:Mishti_Doi.jpg', by: 'Kirti Poddar', lic: 'CC BY 2.0' },
  f15: { src: 'https://commons.wikimedia.org/wiki/File:Kalai_ruti_with_bhurta_%26_duck_meat.jpg', by: 'Dolon Prova', lic: 'CC BY-SA 4.0' },
  f16: { src: 'https://commons.wikimedia.org/wiki/File:Kulfi_ice-cream.jpg', by: 'Shreya13jain', lic: 'CC BY-SA 4.0' },
  f19: { src: 'https://commons.wikimedia.org/wiki/File:Bhimruli_Floating_Guava_Market,_Jhalokathi,_Barisal.jpg', by: 'Lonely Explorer', lic: 'CC BY-SA 4.0' },
};

export const ICONIC_FOODS: FoodItem[] = BASE_FOODS.map((f) => (f.img || !PHOTOS[f.id] ? f : { ...f, img: PHOTOS[f.id] }));

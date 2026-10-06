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
  },
  {
    id: 'd1',
    districtId: 'Barishal',
    nameBn: 'গুঠিয়ার সন্দেশ',
    category: 'sweet',
    desc: 'বরিশাল-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd2',
    districtId: 'Barishal',
    nameBn: 'বরিশালের ইলিশ',
    category: 'main',
    desc: 'বরিশাল-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd3',
    districtId: 'Bhola',
    nameBn: 'ভোলার মেঘনার ইলিশ',
    category: 'main',
    desc: 'ভোলা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd4',
    districtId: 'Barguna',
    nameBn: 'বরগুনার সামুদ্রিক মাছ',
    category: 'main',
    desc: 'বরগুনা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd5',
    districtId: 'Barguna',
    nameBn: 'বরগুনার শুঁটকি',
    category: 'main',
    desc: 'বরগুনা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd6',
    districtId: 'Jhalokati',
    nameBn: 'ঝালকাঠির আমড়া',
    category: 'fruit',
    desc: 'ঝালকাঠি-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd7',
    districtId: 'Jhalokati',
    nameBn: 'ঝালকাঠির গাবখান চ্যানেলের মাছ',
    category: 'main',
    desc: 'ঝালকাঠি-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd8',
    districtId: 'Patuakhali',
    nameBn: 'পটুয়াখালীর সামুদ্রিক মাছ ও কাঁকড়া ফ্রাই',
    category: 'main',
    desc: 'পটুয়াখালী-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd9',
    districtId: 'Chattogram',
    nameBn: 'চট্টগ্রামের কালাভুনা',
    category: 'main',
    desc: 'চট্টগ্রাম-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd10',
    districtId: 'Chattogram',
    nameBn: 'চট্টগ্রামের শুঁটকি ভর্তা',
    category: 'main',
    desc: 'চট্টগ্রাম-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd11',
    districtId: 'Chattogram',
    nameBn: 'চট্টগ্রামের বেলা বিস্কুট',
    category: 'snack',
    desc: 'চট্টগ্রাম-এর পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
  },
  {
    id: 'd12',
    districtId: 'Cox\'s Bazar',
    nameBn: 'কক্সবাজারের রূপচাঁদা ফ্রাই',
    category: 'main',
    desc: 'কক্সবাজার-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd13',
    districtId: 'Cox\'s Bazar',
    nameBn: 'কক্সবাজারের লবস্টার',
    category: 'main',
    desc: 'কক্সবাজার-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd14',
    districtId: 'Cox\'s Bazar',
    nameBn: 'কক্সবাজারের কোরাল মাছ',
    category: 'main',
    desc: 'কক্সবাজার-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd15',
    districtId: 'Bandarban',
    nameBn: 'বান্দরবানের বাঁশ কোরল',
    category: 'main',
    desc: 'বান্দরবান-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd16',
    districtId: 'Rangamati',
    nameBn: 'রাঙ্গামাটির কাপ্তাই লেকের মাছ',
    category: 'main',
    desc: 'রাঙ্গামাটি-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd17',
    districtId: 'Rangamati',
    nameBn: 'রাঙ্গামাটির ব্যাম্বু চিকেন',
    category: 'main',
    desc: 'রাঙ্গামাটি-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd18',
    districtId: 'Khagrachhari',
    nameBn: 'খাগড়াছড়ির ব্যাম্বু চিকেন',
    category: 'main',
    desc: 'খাগড়াছড়ি-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd19',
    districtId: 'Khagrachhari',
    nameBn: 'খাগড়াছড়ির পাহাড়ি রান্না',
    category: 'main',
    desc: 'খাগড়াছড়ি-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd20',
    districtId: 'Feni',
    nameBn: 'ফেনীর মহিষের দই',
    category: 'sweet',
    desc: 'ফেনী-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd21',
    districtId: 'Noakhali',
    nameBn: 'নোয়াখালীর নারিকেলের নাড়ু',
    category: 'sweet',
    desc: 'নোয়াখালী-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd22',
    districtId: 'Noakhali',
    nameBn: 'নোয়াখালীর মহিষের দই',
    category: 'sweet',
    desc: 'নোয়াখালী-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd23',
    districtId: 'Lakshmipur',
    nameBn: 'লক্ষ্মীপুরের মেঘনার ইলিশ',
    category: 'main',
    desc: 'লক্ষ্মীপুর-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd24',
    districtId: 'Lakshmipur',
    nameBn: 'লক্ষ্মীপুরের নারিকেল',
    category: 'fruit',
    desc: 'লক্ষ্মীপুর-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd25',
    districtId: 'Brahmanbaria',
    nameBn: 'ব্রাহ্মণবাড়িয়ার তালের বড়া',
    category: 'snack',
    desc: 'ব্রাহ্মণবাড়িয়া-এর পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
  },
  {
    id: 'd26',
    districtId: 'Dhaka',
    nameBn: 'হাজীর বিরিয়ানি',
    category: 'main',
    desc: 'ঢাকা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd27',
    districtId: 'Dhaka',
    nameBn: 'ঢাকার বোরহানি',
    category: 'fruit',
    desc: 'ঢাকা-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd28',
    districtId: 'Dhaka',
    nameBn: 'নান্না মিয়ার মোরগ পোলাও',
    category: 'main',
    desc: 'ঢাকা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd29',
    districtId: 'Narayanganj',
    nameBn: 'সোনারগাঁওয়ের পিঠা',
    category: 'sweet',
    desc: 'নারায়ণগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd30',
    districtId: 'Munshiganj',
    nameBn: 'মাওয়া ঘাটের ইলিশ ভাজা',
    category: 'main',
    desc: 'মুন্সীগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd31',
    districtId: 'Munshiganj',
    nameBn: 'বিক্রমপুরের ভাগ্যকুলের মিষ্টি',
    category: 'sweet',
    desc: 'মুন্সীগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd32',
    districtId: 'Manikganj',
    nameBn: 'মানিকগঞ্জের খেজুরের গুড়',
    category: 'sweet',
    desc: 'মানিকগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd33',
    districtId: 'Kishorganj',
    nameBn: 'কিশোরগঞ্জের হাওরের তাজা মাছ',
    category: 'main',
    desc: 'কিশোরগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd34',
    districtId: 'Kishorganj',
    nameBn: 'কিশোরগঞ্জের তালের পিঠা',
    category: 'sweet',
    desc: 'কিশোরগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd35',
    districtId: 'Faridpur',
    nameBn: 'ফরিদপুরের খেজুরের গুড়',
    category: 'sweet',
    desc: 'ফরিদপুর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd36',
    districtId: 'Faridpur',
    nameBn: 'ফরিদপুরের পদ্মার ইলিশ',
    category: 'main',
    desc: 'ফরিদপুর-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd37',
    districtId: 'Gopalganj',
    nameBn: 'গোপালগঞ্জের মধুমতীর মাছ',
    category: 'main',
    desc: 'গোপালগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd38',
    districtId: 'Gopalganj',
    nameBn: 'গোপালগঞ্জের রসগোল্লা',
    category: 'sweet',
    desc: 'গোপালগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd39',
    districtId: 'Madaripur',
    nameBn: 'মাদারীপুরের খেজুরের গুড়',
    category: 'sweet',
    desc: 'মাদারীপুর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd40',
    districtId: 'Rajbari',
    nameBn: 'রাজবাড়ীর চমচম',
    category: 'sweet',
    desc: 'রাজবাড়ী-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd41',
    districtId: 'Rajbari',
    nameBn: 'রাজবাড়ীর পদ্মার মাছ',
    category: 'main',
    desc: 'রাজবাড়ী-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd42',
    districtId: 'Shariatpur',
    nameBn: 'শরীয়তপুরের পদ্মার ইলিশ',
    category: 'main',
    desc: 'শরীয়তপুর-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd43',
    districtId: 'Shariatpur',
    nameBn: 'শরীয়তপুরের দই',
    category: 'sweet',
    desc: 'শরীয়তপুর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd44',
    districtId: 'Khulna',
    nameBn: 'খুলনার গলদা চিংড়ি',
    category: 'main',
    desc: 'খুলনা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd45',
    districtId: 'Bagerhat',
    nameBn: 'বাগেরহাটের চিংড়ি',
    category: 'main',
    desc: 'বাগেরহাট-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd46',
    districtId: 'Bagerhat',
    nameBn: 'বাগেরহাটের নারিকেল',
    category: 'fruit',
    desc: 'বাগেরহাট-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd47',
    districtId: 'Satkhira',
    nameBn: 'সাতক্ষীরার হিমসাগর আম',
    category: 'fruit',
    desc: 'সাতক্ষীরা-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd48',
    districtId: 'Satkhira',
    nameBn: 'সাতক্ষীরার চিংড়ি',
    category: 'main',
    desc: 'সাতক্ষীরা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd49',
    districtId: 'Satkhira',
    nameBn: 'সাতক্ষীরার কুল',
    category: 'fruit',
    desc: 'সাতক্ষীরা-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd50',
    districtId: 'Jashore',
    nameBn: 'যশোরের খেজুরের গুড় ও পাটালি',
    category: 'sweet',
    desc: 'যশোর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd51',
    districtId: 'Jashore',
    nameBn: 'জামতলার রসগোল্লা',
    category: 'sweet',
    desc: 'যশোর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd52',
    districtId: 'Jhenaidah',
    nameBn: 'ঝিনাইদহের খেজুরের গুড়',
    category: 'sweet',
    desc: 'ঝিনাইদহ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd53',
    districtId: 'Jhenaidah',
    nameBn: 'ঝিনাইদহের কলা',
    category: 'fruit',
    desc: 'ঝিনাইদহ-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd54',
    districtId: 'Magura',
    nameBn: 'মাগুরার রসমালাই',
    category: 'sweet',
    desc: 'মাগুরা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd55',
    districtId: 'Magura',
    nameBn: 'মাগুরার খেজুরের গুড়',
    category: 'sweet',
    desc: 'মাগুরা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd56',
    districtId: 'Meherpur',
    nameBn: 'মেহেরপুরের সাবিত্রী মিষ্টি',
    category: 'sweet',
    desc: 'মেহেরপুর-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd57',
    districtId: 'Meherpur',
    nameBn: 'মেহেরপুরের আম',
    category: 'fruit',
    desc: 'মেহেরপুর-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd58',
    districtId: 'Narail',
    nameBn: 'নড়াইলের চিত্রার মাছ',
    category: 'main',
    desc: 'নড়াইল-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd59',
    districtId: 'Narail',
    nameBn: 'নড়াইলের পেঁড়া',
    category: 'sweet',
    desc: 'নড়াইল-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd60',
    districtId: 'Chuadanga',
    nameBn: 'চুয়াডাঙ্গার খেজুরের গুড়',
    category: 'sweet',
    desc: 'চুয়াডাঙ্গা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd61',
    districtId: 'Jamalpur',
    nameBn: 'জামালপুরের ছানার পোলাও',
    category: 'main',
    desc: 'জামালপুর-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd62',
    districtId: 'Netrokona',
    nameBn: 'নেত্রকোণার হাওরের মাছ',
    category: 'main',
    desc: 'নেত্রকোণা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd63',
    districtId: 'Sherpur',
    nameBn: 'শেরপুরের তুলসীমালা চাল',
    category: 'main',
    desc: 'শেরপুর-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd64',
    districtId: 'Rajshahi',
    nameBn: 'রাজশাহীর আম',
    category: 'fruit',
    desc: 'রাজশাহী-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd65',
    districtId: 'Joypurhat',
    nameBn: 'জয়পুরহাটের আলু',
    category: 'main',
    desc: 'জয়পুরহাট-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd66',
    districtId: 'Joypurhat',
    nameBn: 'জয়পুরহাটের গুড়',
    category: 'sweet',
    desc: 'জয়পুরহাট-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd67',
    districtId: 'Naogaon',
    nameBn: 'নওগাঁের প্যারা সন্দেশ',
    category: 'sweet',
    desc: 'নওগাঁ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd68',
    districtId: 'Naogaon',
    nameBn: 'নওগাঁের আম',
    category: 'fruit',
    desc: 'নওগাঁ-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd69',
    districtId: 'Pabna',
    nameBn: 'পাবনার প্যারা সন্দেশ',
    category: 'sweet',
    desc: 'পাবনা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd70',
    districtId: 'Pabna',
    nameBn: 'পাবনার ঘি',
    category: 'main',
    desc: 'পাবনা-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd71',
    districtId: 'Sirajganj',
    nameBn: 'সিরাজগঞ্জের দই',
    category: 'sweet',
    desc: 'সিরাজগঞ্জ-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd72',
    districtId: 'Sirajganj',
    nameBn: 'সিরাজগঞ্জের ঘি',
    category: 'main',
    desc: 'সিরাজগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd73',
    districtId: 'Sirajganj',
    nameBn: 'সিরাজগঞ্জের যমুনার মাছ',
    category: 'main',
    desc: 'সিরাজগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd74',
    districtId: 'Rangpur',
    nameBn: 'হাঁড়িভাঙ্গা আম',
    category: 'fruit',
    desc: 'রংপুর-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd75',
    districtId: 'Dinajpur',
    nameBn: 'দিনাজপুরের কাটারিভোগ চাল',
    category: 'main',
    desc: 'দিনাজপুর-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd76',
    districtId: 'Gaibandha',
    nameBn: 'গাইবান্ধার রসমঞ্জরি',
    category: 'sweet',
    desc: 'গাইবান্ধা-এর পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd77',
    districtId: 'Kurigram',
    nameBn: 'কুড়িগ্রামের ব্রহ্মপুত্রের মাছ',
    category: 'main',
    desc: 'কুড়িগ্রাম-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd78',
    districtId: 'Lalmonirhat',
    nameBn: 'লালমনিরহাটের তিস্তার মাছ',
    category: 'main',
    desc: 'লালমনিরহাট-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd79',
    districtId: 'Nilphamari',
    nameBn: 'সৈয়দপুরের কাবাব',
    category: 'main',
    desc: 'নীলফামারী-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd80',
    districtId: 'Nilphamari',
    nameBn: 'সৈয়দপুরের নেহারি',
    category: 'main',
    desc: 'নীলফামারী-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd81',
    districtId: 'Panchagarh',
    nameBn: 'পঞ্চগড়ের অর্গানিক চা',
    category: 'fruit',
    desc: 'পঞ্চগড়-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd82',
    districtId: 'Panchagarh',
    nameBn: 'পঞ্চগড়ের বোরো চালের ভাত',
    category: 'main',
    desc: 'পঞ্চগড়-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd83',
    districtId: 'Thakurgaon',
    nameBn: 'সূর্যপুরী আম',
    category: 'fruit',
    desc: 'ঠাকুরগাঁও-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd84',
    districtId: 'Sylhet',
    nameBn: 'সিলেটের ভর্তা-ভাত',
    category: 'main',
    desc: 'সিলেট-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd85',
    districtId: 'Sylhet',
    nameBn: 'সিলেটের চা',
    category: 'fruit',
    desc: 'সিলেট-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd86',
    districtId: 'Sunamganj',
    nameBn: 'সুনামগঞ্জের হাঁসের মাংস',
    category: 'main',
    desc: 'সুনামগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd87',
    districtId: 'Moulvibazar',
    nameBn: 'মৌলভীবাজারের সাত রঙের চা',
    category: 'fruit',
    desc: 'মৌলভীবাজার-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd88',
    districtId: 'Moulvibazar',
    nameBn: 'মৌলভীবাজারের খাসিয়া পান',
    category: 'fruit',
    desc: 'মৌলভীবাজার-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd89',
    districtId: 'Moulvibazar',
    nameBn: 'মৌলভীবাজারের আনারস',
    category: 'fruit',
    desc: 'মৌলভীবাজার-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd90',
    districtId: 'Habiganj',
    nameBn: 'চা বাগানের তাজা চা',
    category: 'fruit',
    desc: 'হবিগঞ্জ-এর পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'd91',
    districtId: 'Habiganj',
    nameBn: 'হবিগঞ্জের হাওরের মাছ',
    category: 'main',
    desc: 'হবিগঞ্জ-এর পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'd92',
    districtId: 'Sylhet',
    nameBn: 'শিদল (সিলেটের শুঁটকি)',
    category: 'main',
    desc: 'সিলেটের পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n1',
    districtId: 'ALL',
    nameBn: 'পান্তা ভাত',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n2',
    districtId: 'ALL',
    nameBn: 'ভাপা পিঠা',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n3',
    districtId: 'ALL',
    nameBn: 'চিতই পিঠা',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n4',
    districtId: 'ALL',
    nameBn: 'পাটিসাপটা',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n5',
    districtId: 'ALL',
    nameBn: 'পুলি পিঠা',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n6',
    districtId: 'ALL',
    nameBn: 'নকশি পিঠা',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n7',
    districtId: 'ALL',
    nameBn: 'তেলের পিঠা',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n8',
    districtId: 'ALL',
    nameBn: 'খিচুড়ি',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n9',
    districtId: 'ALL',
    nameBn: 'আলু ভর্তা',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n10',
    districtId: 'ALL',
    nameBn: 'বেগুন ভর্তা',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n11',
    districtId: 'ALL',
    nameBn: 'শুঁটকি ভর্তা',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n12',
    districtId: 'ALL',
    nameBn: 'ইলিশ ভাজা',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n13',
    districtId: 'ALL',
    nameBn: 'সরষে ইলিশ',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n14',
    districtId: 'ALL',
    nameBn: 'ইলিশ পাতুরি',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n15',
    districtId: 'ALL',
    nameBn: 'চিংড়ি মালাইকারি',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n16',
    districtId: 'ALL',
    nameBn: 'মাছের ঝোল',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n17',
    districtId: 'ALL',
    nameBn: 'ঝালমুড়ি',
    category: 'snack',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
  },
  {
    id: 'n18',
    districtId: 'ALL',
    nameBn: 'ফুচকা',
    category: 'snack',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
  },
  {
    id: 'n19',
    districtId: 'ALL',
    nameBn: 'চটপটি',
    category: 'snack',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
  },
  {
    id: 'n20',
    districtId: 'ALL',
    nameBn: 'সিঙ্গারা',
    category: 'snack',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
  },
  {
    id: 'n21',
    districtId: 'ALL',
    nameBn: 'জিলাপি',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n22',
    districtId: 'ALL',
    nameBn: 'গুলাব জামুন',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n23',
    districtId: 'ALL',
    nameBn: 'নারকেলের নাড়ু',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n24',
    districtId: 'ALL',
    nameBn: 'মুড়ির মোয়া',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n25',
    districtId: 'ALL',
    nameBn: 'ফিরনি',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n26',
    districtId: 'ALL',
    nameBn: 'পায়েস',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n27',
    districtId: 'ALL',
    nameBn: 'জর্দা (মিষ্টি পোলাও)',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n28',
    districtId: 'ALL',
    nameBn: 'মোরগ পোলাও',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n29',
    districtId: 'ALL',
    nameBn: 'রেজালা',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n30',
    districtId: 'ALL',
    nameBn: 'তেহারি',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n31',
    districtId: 'ALL',
    nameBn: 'হালিম',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n32',
    districtId: 'ALL',
    nameBn: 'নিহারি',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n33',
    districtId: 'ALL',
    nameBn: 'শিক কাবাব',
    category: 'main',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n34',
    districtId: 'ALL',
    nameBn: 'খেজুরের রস',
    category: 'sweet',
    desc: 'সারা বাংলাদেশে পরিচিত মিষ্টি ও মিষ্টান্ন জাতীয় ঐতিহ্যবাহী খাবার।'
  },
  {
    id: 'n35',
    districtId: 'ALL',
    nameBn: 'আখের রস',
    category: 'fruit',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'n36',
    districtId: 'ALL',
    nameBn: 'ঘোল (পানীয়)',
    category: 'fruit',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'n37',
    districtId: 'ALL',
    nameBn: 'বোরহানি',
    category: 'fruit',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় ফল ও পানীয়।'
  },
  {
    id: 'n38',
    districtId: 'ALL',
    nameBn: 'মুড়ি',
    category: 'snack',
    desc: 'সারা বাংলাদেশে পরিচিত স্থানীয় নাশতা ও মুখরোচক খাবার।'
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

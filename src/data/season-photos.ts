// One credited Wikimedia Commons photo per season card. Entries are either copied from public/places.json or
// picked with `npm run food:photos`, which reads the photographer and licence from the Commons API.
// A test checks that every entry has a Commons file URL, an author and a CC licence.
export interface SeasonPhoto {
  src: string; // Commons file page
  by: string;
  lic: string;
  caption: string;
}

export const SEASON_PHOTOS: Record<'summer' | 'monsoon' | 'autumn' | 'hemanto' | 'winter' | 'spring', SeasonPhoto | null> = {
  summer: { src: 'https://commons.wikimedia.org/wiki/File:Krishnachura_from_Bangladesh.jpg', by: 'Tajdikul alam niloy', lic: 'CC BY-SA 4.0', caption: 'গ্রীষ্মে কৃষ্ণচূড়া' },
  monsoon: { src: 'https://commons.wikimedia.org/wiki/File:June_2025_Monsoon_view_of_Khoiyachora_Waterfalls_by_Owais_Al_Qarni_30.jpg', by: 'Owais Al Qarni', lic: 'CC BY-SA 4.0', caption: 'বর্ষায় খৈয়াছড়া ঝর্ণা, চট্টগ্রাম' },
  autumn: { src: 'https://commons.wikimedia.org/wiki/File:Kash_at_the_char_of_Dharla_river.jpg', by: 'No machine-readable author provided. Auyon assumed (based on copyright claims).', lic: 'CC BY-SA 3.0', caption: 'কাশফুল, ধরলা নদীর চর, কুড়িগ্রাম' },
  hemanto: { src: 'https://commons.wikimedia.org/wiki/File:Rice_harvesting_by_farmers_in_a_wetland_field,_Bangladesh_2026_04.jpg', by: 'A S M Jobaer', lic: 'CC BY-SA 4.0', caption: 'ধান কাটা, জলাভূমির মাঠ' },
  winter: { src: 'https://commons.wikimedia.org/wiki/File:WLE_2026_Bangladesh_Foggy_morning_landscape_with_Mango_and_Palmyra_palm_trees_by_Sahadat_Hossain.jpg', by: 'Sahadat247', lic: 'CC BY-SA 4.0', caption: 'শীতের কুয়াশাঘেরা সকাল' },
  spring: { src: 'https://commons.wikimedia.org/wiki/File:%E0%A6%B6%E0%A6%BF%E0%A6%AE%E0%A7%81%E0%A6%B2_%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%BE%E0%A6%A8,_%E0%A6%A4%E0%A6%BE%E0%A6%B9%E0%A6%BF%E0%A6%B0%E0%A6%AA%E0%A7%81%E0%A6%B0,_%E0%A6%B8%E0%A7%81%E0%A6%A8%E0%A6%BE%E0%A6%AE%E0%A6%97%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A5%A4.jpg', by: 'Sumon65', lic: 'CC BY-SA 4.0', caption: 'শিমুল বাগান, তাহিরপুর, সুনামগঞ্জ' },
};

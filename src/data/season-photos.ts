// One credited Wikimedia Commons photo per season card. Every entry is copied from public/places.json
// (a test checks that), so the photographer and licence were already verified there.
// summer and winter still use stand-ins until better season photos are picked with `npm run food:photos`.
export interface SeasonPhoto {
  src: string; // Commons file page
  by: string;
  lic: string;
  caption: string;
}

export const SEASON_PHOTOS: Record<'summer' | 'monsoon' | 'autumn' | 'hemanto' | 'winter' | 'spring', SeasonPhoto | null> = {
  summer: { src: 'https://commons.wikimedia.org/wiki/File:Chopped_Amrapali_mango_on_a_tree,_Kurigram,_Bangladesh.jpg', by: 'Tanvir Rahat', lic: 'CC BY-SA 4.0', caption: 'আম' },
  monsoon: { src: 'https://commons.wikimedia.org/wiki/File:June_2025_Monsoon_view_of_Khoiyachora_Waterfalls_by_Owais_Al_Qarni_30.jpg', by: 'Owais Al Qarni', lic: 'CC BY-SA 4.0', caption: 'বর্ষায় খৈয়াছড়া ঝর্ণা, চট্টগ্রাম' },
  autumn: { src: 'https://commons.wikimedia.org/wiki/File:Kash_at_the_char_of_Dharla_river.jpg', by: 'No machine-readable author provided. Auyon assumed (based on copyright claims).', lic: 'CC BY-SA 3.0', caption: 'কাশফুল, ধরলা নদীর চর, কুড়িগ্রাম' },
  // hemanto: no verified photo yet (null shows a placeholder); pick one with `npm run food:photos`.
  hemanto: null,
  winter: { src: 'https://commons.wikimedia.org/wiki/File:Saint_Martins_Island_with_boats_in_foreground.jpg', by: 'Crysis Rubel, cropped by JamesA', lic: 'CC BY 2.0', caption: 'সেন্টমার্টিন দ্বীপ, কক্সবাজার' },
  spring: { src: 'https://commons.wikimedia.org/wiki/File:%E0%A6%B6%E0%A6%BF%E0%A6%AE%E0%A7%81%E0%A6%B2_%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%BE%E0%A6%A8,_%E0%A6%A4%E0%A6%BE%E0%A6%B9%E0%A6%BF%E0%A6%B0%E0%A6%AA%E0%A7%81%E0%A6%B0,_%E0%A6%B8%E0%A7%81%E0%A6%A8%E0%A6%BE%E0%A6%AE%E0%A6%97%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A5%A4.jpg', by: 'Sumon65', lic: 'CC BY-SA 4.0', caption: 'শিমুল বাগান, তাহিরপুর, সুনামগঞ্জ' },
};

// One credited Wikimedia Commons photo per season card. Every entry is copied from public/places.json
// (a test checks that), so the photographer and licence were already verified there.
export interface SeasonPhoto {
  src: string; // Commons file page
  by: string;
  lic: string;
  caption: string;
}

export const SEASON_PHOTOS: Record<'summer' | 'monsoon' | 'autumn' | 'winter' | 'spring', SeasonPhoto> = {
  summer: { src: 'https://commons.wikimedia.org/wiki/File:Chopped_Amrapali_mango_on_a_tree,_Kurigram,_Bangladesh.jpg', by: 'Tanvir Rahat', lic: 'CC BY-SA 4.0', caption: 'আম' },
  monsoon: { src: 'https://commons.wikimedia.org/wiki/File:Tanguar_Haor_1.jpg', by: 'Abdul Momin', lic: 'CC BY-SA 4.0', caption: 'টাঙ্গুয়ার হাওর, সুনামগঞ্জ' },
  autumn: { src: 'https://commons.wikimedia.org/wiki/File:Sajek_Valley_2_(cropped).jpg', by: 'Biplobkgc', lic: 'CC BY-SA 3.0', caption: 'সাজেক ভ্যালি, রাঙ্গামাটি' },
  winter: { src: 'https://commons.wikimedia.org/wiki/File:Saint_Martins_Island_with_boats_in_foreground.jpg', by: 'Crysis Rubel, cropped by JamesA', lic: 'CC BY 2.0', caption: 'সেন্টমার্টিন দ্বীপ, কক্সবাজার' },
  spring: { src: 'https://commons.wikimedia.org/wiki/File:Godkhali-jashore-khulna-bangladesh.jpg', by: 'SharierKabir', lic: 'CC BY-SA 4.0', caption: 'গদখালীর ফুল, যশোর' },
};

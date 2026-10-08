// Little-known places sent in by travellers, shown on the "আমার এলাকা" page.
// Add an entry ONLY after: (1) you checked the place exists, (2) the sender agreed in writing to be named,
// (3) any photo is theirs (or free-licensed) and saved under public/assets/gems/ with the photographer's name in `photo.by`.
export interface HiddenGem {
  id: string;
  districtId: string; // key of DISTRICT_DETAILS, e.g. 'Sylhet'
  name: string;
  desc: string;
  how?: string; // how to get there
  category: string;
  video?: string; // https link to a YouTube / Facebook video (shown as a link only)
  by: string; // sender's name, shown on the card
  photo?: { src: string; by: string; lic?: string };
}

export const GEM_CATEGORIES = ['প্রকৃতি', 'ঐতিহাসিক স্থান', 'ধর্মীয় স্থান', 'নদী / চর / হাওর', 'পাহাড় / বন', 'গ্রাম ও সংস্কৃতি', 'অন্য'] as const;

export const HIDDEN_GEMS: HiddenGem[] = [];

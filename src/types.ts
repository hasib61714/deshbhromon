export type DistrictId = string;

export interface DistrictInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  areaKm2?: number;
  famousForBn: string;
  centroid: [number, number];
  path: string;
}

export type MapMode = 'visited' | 'wishlist';

export interface MapTheme {
  id: string;
  nameBn: string;
  nameEn: string;
  bg: string;
  visitedFill: string;
  visitedStroke: string;
  wishlistFill: string;
  wishlistStroke: string;
  unvisitedFill: string;
  unvisitedStroke: string;
  divisionStroke: string;
  textDark: boolean;
}

export interface PhotoCredit {
  by?: string;
  lic?: string;
  src?: string;
}

export interface PlaceSpot {
  n: string; // Spot name
  d: string; // Short description
  w?: string; // English / Wiki name
  h?: string; // Overview paragraph
  hx?: string[]; // Longer background paragraphs
  img?: PhotoCredit;
  gal?: PhotoCredit[];
  how?: string;
  best?: string;
  dur?: string;
  cost?: string;
  tips?: string[];
  facts?: [string, string][];
  todo?: string[];
  near?: string[];
  p?: number; // 1 = highlight
  top?: number;
}

export type TransportMode = 'bus' | 'train' | 'launch' | 'air' | 'car' | 'local';

export interface DistrictPlaceData {
  nm?: string; // Origin of the name
  intro?: string;
  km?: number; // Approximate road distance from Dhaka
  time?: string; // Approximate travel time from Dhaka
  go?: [TransportMode, string][];
  food?: string;
  stay?: string[];
  cost?: string;
  fam?: [string, string, PhotoCredit | null][]; // emoji, name, photo
  spots?: PlaceSpot[];
}

export interface TripPlan {
  from: string;
  destinations: string[];
  days: number;
  budgetType: 'budget' | 'standard' | 'luxury';
  travelers: number;
  notes: string;
  checklist: { id: string; text: string; done: boolean }[];
}

export interface TravelLog {
  id: string;
  districtId: string;
  date: string;
  companions: 'solo' | 'friends' | 'family' | 'couple';
  rating: number; // 1-5
  notes: string;
}

export interface FoodItem {
  id: string;
  districtId: string;
  nameBn: string;
  category: 'sweet' | 'main' | 'snack' | 'fruit';
  desc: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  districtId?: string;
}


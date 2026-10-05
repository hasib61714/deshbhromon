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

export interface PlaceSpot {
  n: string; // Spot name
  d: string; // Description
  w?: string; // English / Wiki name
  h?: string; // Highlight overview
  img?: any; // Image metadata
  how?: string;
  best?: string;
  dur?: string;
  cost?: string;
  tips?: string[];
  facts?: [string, string][];
  todo?: string[];
  near?: string[];
}

export interface DistrictPlaceData {
  nm: string;
  intro?: string;
  go?: string;
  food?: string;
  stay?: string;
  cost?: string;
  time?: string;
  fam?: string;
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


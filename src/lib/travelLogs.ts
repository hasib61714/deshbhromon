import type { TravelLog } from '../types';
import { readList } from './storage';

const COMPANIONS = ['solo', 'friends', 'family', 'couple'];

export function isTravelLog(x: unknown): x is TravelLog {
  if (typeof x !== 'object' || x === null) return false;
  const l = x as Record<string, unknown>;
  return (
    typeof l.id === 'string' &&
    typeof l.districtId === 'string' &&
    typeof l.date === 'string' &&
    typeof l.notes === 'string' &&
    typeof l.rating === 'number' &&
    typeof l.companions === 'string' &&
    COMPANIONS.includes(l.companions)
  );
}

export const loadTravelLogs = (): TravelLog[] => readList('travel_logs', isTravelLog);

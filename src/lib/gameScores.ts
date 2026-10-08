import { readList, writeList } from './storage';

// Scores are kept on this device only (no server), so the leaderboard ranks the games played on this phone/computer.
export type GameId = 'mapfind' | 'clue' | 'truefalse' | 'memory';

export const GAME_NAMES: Record<GameId, string> = {
  mapfind: 'ম্যাপে খুঁজুন',
  clue: 'ক্লু থেকে জেলা',
  truefalse: 'সত্য না মিথ্যা',
  memory: 'স্মৃতি জোড়া',
};

export interface ScoreEntry {
  game: GameId;
  name: string;
  points: number;
  at: number;
}

const KEY = 'game_scores';
const KEEP = 50;

const isEntry = (x: unknown): x is ScoreEntry => {
  const e = x as ScoreEntry;
  return !!e && typeof e === 'object' && e.game in GAME_NAMES && typeof e.name === 'string' && Number.isFinite(e.points) && Number.isFinite(e.at);
};

export const readScores = (): ScoreEntry[] => readList(KEY, isEntry);

export function addScore(game: GameId, name: string, points: number, at = Date.now()): ScoreEntry[] {
  const entry: ScoreEntry = { game, name: name.trim().slice(0, 30) || 'আমি', points: Math.max(0, Math.round(points)), at };
  // keep the best KEEP scores per game so storage stays small
  const all = [...readScores(), entry];
  const kept = (Object.keys(GAME_NAMES) as GameId[]).flatMap((g) => topScores(all, g, KEEP));
  writeList(KEY, kept);
  return kept;
}

export const topScores = (all: ScoreEntry[], game: GameId | 'all', n = 10): ScoreEntry[] =>
  all
    .filter((s) => game === 'all' || s.game === game)
    .sort((a, b) => b.points - a.points || b.at - a.at)
    .slice(0, n);

export const personalBest = (all: ScoreEntry[], game: GameId): number => topScores(all, game, 1)[0]?.points ?? 0;

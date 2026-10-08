// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { clueRounds, memoryDeck, shuffle, trueFalseRounds } from './gameRounds';
import { addScore, personalBest, readScores, topScores } from './gameScores';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';

const seeded = (s = 7) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

describe('game rounds come only from the app data', () => {
  it('clue game: 4 distinct options, answer included, clue never names the district', () => {
    const r = clueRounds(10, seeded());
    expect(r).toHaveLength(10);
    for (const x of r) {
      expect(new Set(x.options).size).toBe(4);
      expect(x.options).toContain(x.answer);
      expect(x.clue).not.toContain(DISTRICT_DETAILS[x.answer].bn);
    }
  });
  it('true/false: statements match the data when marked true and contradict it when false', () => {
    for (const r of trueFalseRounds(40, seeded(3))) {
      const m = /^(.+?) জেলা (.+?) বিভাগে অবস্থিত।$/.exec(r.statement);
      if (m) {
        const d = Object.values(DISTRICT_DETAILS).find((x) => x.bn === m[1])!;
        expect(r.truth).toBe(d.dvBn === m[2]);
      }
    }
  });
  it('memory deck: 6 food/district pairs, every pair appears exactly twice', () => {
    const d = memoryDeck(6, seeded(5));
    expect(d).toHaveLength(12);
    for (const c of d) expect(d.filter((x) => x.pair === c.pair)).toHaveLength(2);
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('local leaderboard', () => {
  it('keeps the best scores per game, ranks high to low and survives empty storage', () => {
    localStorage.clear();
    expect(readScores()).toEqual([]);
    addScore('clue', 'রহিম', 70, 1);
    addScore('clue', 'করিম', 90, 2);
    addScore('memory', 'রহিম', 60, 3);
    const all = readScores();
    expect(topScores(all, 'clue').map((s) => s.name)).toEqual(['করিম', 'রহিম']);
    expect(personalBest(all, 'clue')).toBe(90);
    expect(personalBest(all, 'mapfind')).toBe(0);
    expect(topScores(all, 'all')[0].points).toBe(90);
    localStorage.setItem('deshbhromon_game_scores', '{{{');
    expect(readScores()).toEqual([]);
  });
});

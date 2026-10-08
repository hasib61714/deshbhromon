// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { GamesHub } from './GamesHub';
import { readScores } from '../lib/gameScores';

beforeEach(() => { localStorage.clear(); vi.stubGlobal('Path2D', class {}); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const open = (name: RegExp) => fireEvent.click(screen.getByRole('tab', { name }));

describe('games hub', () => {
  it('lists the original quiz plus four new games and the leaderboard', () => {
    render(<GamesHub />);
    const names = screen.getAllByRole('tab').map((t) => t.textContent);
    expect(names).toHaveLength(6);
    for (const n of [/ম্যাপে খুঁজুন/, /ক্লু-জেলা/, /সত্য-মিথ্যা/, /স্মৃতি জোড়া/, /লিডারবোর্ড/]) expect(screen.getByRole('tab', { name: n })).toBeTruthy();
  });

  it('true/false: scores every round and saves the result to the leaderboard', () => {
    render(<GamesHub />);
    open(/সত্য-মিথ্যা/);
    for (let r = 0; r < 10; r++) {
      fireEvent.click(screen.getByRole('button', { name: 'সত্য' }));
      fireEvent.click(screen.getByRole('button', { name: /পরের প্রশ্ন|ফলাফল দেখুন/ }));
    }
    expect(document.querySelector('[data-game-finish]')).toBeTruthy();
    const saved = readScores();
    expect(saved).toHaveLength(1);
    expect(saved[0].game).toBe('truefalse');
    expect(saved[0].points % 10).toBe(0);
    cleanup();
    render(<GamesHub />);
    open(/লিডারবোর্ড/);
    expect(document.querySelectorAll('[data-score-row]')).toHaveLength(1);
  });

  it('clue game: right answer scores 10, wrong scores 0, then the next question appears', () => {
    render(<GamesHub />);
    open(/ক্লু-জেলা/);
    const buttons = screen.getAllByRole('button').filter((b) => b.className.includes('min-h-11') && /text-left/.test(b.className));
    expect(buttons).toHaveLength(4);
    fireEvent.click(buttons[0]);
    expect(screen.getByRole('button', { name: 'পরের প্রশ্ন' })).toBeTruthy();
  });

  it('memory game: shows 12 face-down cards', () => {
    render(<GamesHub />);
    open(/স্মৃতি জোড়া/);
    expect(document.querySelectorAll('[data-memory-card]')).toHaveLength(12);
  });

  it('leaderboard starts empty with an honest local-only note', () => {
    render(<GamesHub />);
    open(/লিডারবোর্ড/);
    expect(screen.getByText(/এখনও কোনো স্কোর নেই/)).toBeTruthy();
    expect(screen.getByText(/শুধু এই ডিভাইসে/)).toBeTruthy();
  });
});

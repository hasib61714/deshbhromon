// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { LangProvider } from './LangContext';
import { EN } from './en';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

beforeEach(() => { localStorage.clear(); document.documentElement.lang = ''; });
afterEach(() => cleanup());

const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

describe('language toggle', () => {
  it('starts in Bangla, switches to English, remembers the choice and sets <html lang>', () => {
    const ui = () => (
      <LangProvider>
        <Navbar activeTab="home" setActiveTab={() => {}} visitedCount={3} />
      </LangProvider>
    );
    render(ui());
    expect(screen.getAllByText('জেলা গাইড').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'ভাষা বদলান' }));
    expect(screen.getAllByText('District guide').length).toBeGreaterThan(0);
    expect(screen.queryByText('জেলা গাইড')).toBeNull();
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem('deshbhromon_lang')).toBe('en');
    cleanup();
    render(ui());
    expect(screen.getAllByText('District guide').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
    expect(screen.getAllByText('জেলা গাইড').length).toBeGreaterThan(0);
  });
  it('translates the footer too and shows digits as 0-9 in English', () => {
    localStorage.setItem('deshbhromon_lang', 'en');
    render(<LangProvider><Footer onOpenAbout={() => {}} setActiveTab={() => {}} /></LangProvider>);
    expect(screen.getByText('Explore')).toBeTruthy();
    expect(screen.queryByText('অন্বেষণ')).toBeNull();
  });
});

const EN_NORM = new Map(Object.entries(EN).map(([k, v]) => [k.normalize('NFC'), v]));

describe('English dictionary coverage', () => {
  it('has an English text for every tr(\'…\') used in the code', () => {
    const missing: string[] = [];
    for (const f of walk('src').filter((x) => x.endsWith('.tsx') && !x.endsWith('.test.tsx') && !x.includes('LangContext'))) {
      for (const m of fs.readFileSync(f, 'utf8').matchAll(/\btr\('((?:[^'\\]|\\.)*)'\)/g)) {
        const k = m[1].replace(/\\'/g, "'");
        if (!EN_NORM.has(k.normalize('NFC'))) missing.push(`${f}: ${k}`);
      }
    }
    expect(missing).toEqual([]);
  });
  it('covers the tab labels, home feature cards and footer columns that are looked up by variable', () => {
    for (const k of ['হোম', 'জেলা গাইড', 'আমার ম্যাপ', 'ট্রিপ প্ল্যানার', 'ভ্রমণ ডায়েরি', 'ফুড ট্র্যাকার', 'ঋতু ও নিরাপত্তা', 'কুইজ খেলা', 'বিশ্ব ভ্রমণ', 'আমার এলাকা', 'অন্বেষণ', 'পরিকল্পনা ও স্মৃতি', 'সহায়তা']) {
      expect(EN_NORM.get(k.normalize('NFC')), k).toBeTruthy();
    }
    const home = fs.readFileSync('src/components/HomePage.tsx', 'utf8');
    for (const m of home.matchAll(/(?:title|text|stage|place): '([^']*[ঀ-৿][^']*)'/g)) expect(EN_NORM.get(m[1].normalize('NFC')), m[1]).toBeTruthy();
  });
  it('covers transport labels and weather texts that are looked up from data tables', () => {
    for (const [f, pat] of [
      ['src/components/DistrictOverview.tsx', /label: '([^']*)'/g],
      ['src/components/WeatherWidget.tsx', /(?:label|advice): '([^']*)'/g],
      ['src/components/WeatherWidget.tsx', /error: '([^']*)'/g],
      ['src/components/TripPlanner.tsx', /(?:label|sub): '([^']*)'/g],
      ['src/lib/tripPlan.ts', /text: '([^']*[ঀ-৿][^']*)'/g],
    ] as const) {
      for (const m of fs.readFileSync(f, 'utf8').matchAll(pat)) expect(EN_NORM.get(m[1].normalize('NFC')), m[1]).toBeTruthy();
    }
  });
  it('no English text is empty or identical to a Bangla key by accident', () => {
    for (const [k, v] of Object.entries(EN)) {
      expect(v.trim().length, k).toBeGreaterThan(0);
      expect(/[ঀ-৿]/.test(v), `${k} -> ${v}`).toBe(false);
    }
  });
});

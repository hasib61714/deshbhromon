// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import fs from 'fs';
import { TripSuggester } from './TripSuggester';
import { ChallengeBanner } from './ChallengeBanner';
import { challengeUrl } from '../lib/challenge';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';

const places = JSON.parse(fs.readFileSync('public/places.json', 'utf8'));
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => places })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.history.replaceState(null, '', '/'); });

describe('TripSuggester', () => {
  it('lists districts for the chosen month and opens a guide', async () => {
    const onOpen = vi.fn();
    render(<TripSuggester visited={new Set()} onOpenDistrict={onOpen} />);
    await waitFor(() => expect(document.querySelectorAll('[data-suggestion]').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByRole('button', { name: /গাইড দেখুন/ })[0]);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
  it('shows an honest message when the data cannot load', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    render(<TripSuggester visited={new Set()} onOpenDistrict={vi.fn()} />);
    expect(await screen.findByText(/লোড করা যায়নি/)).toBeTruthy();
  });
});

describe('ChallengeBanner', () => {
  const ids = Object.keys(DISTRICT_DETAILS).sort();
  it('shows nothing without a challenge link', () => {
    const { container } = render(<ChallengeBanner visited={new Set()} onNavigate={vi.fn()} />);
    expect(container.querySelector('[data-challenge]')).toBeNull();
  });
  it('compares a friend\'s map with the visitor\'s and ignores broken links', () => {
    const url = new URL(challengeUrl('http://localhost', new Set(['Dhaka', 'Sylhet', 'Khulna']), 'রহিম', ids));
    window.history.replaceState(null, '', `/${url.search}`);
    render(<ChallengeBanner visited={new Set(['Dhaka'])} onNavigate={vi.fn()} />);
    expect(screen.getByText(/রহিম ৩\/৬৪ জেলা ঘুরেছেন/)).toBeTruthy();
    expect(screen.getByText(/২টি জেলা পিছিয়ে/)).toBeTruthy();
    cleanup();
    window.history.replaceState(null, '', '/?c=%%%');
    const { container } = render(<ChallengeBanner visited={new Set()} onNavigate={vi.fn()} />);
    expect(container.querySelector('[data-challenge]')).toBeNull();
  });
});

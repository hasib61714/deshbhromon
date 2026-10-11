// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import fs from 'fs';
import { RoutesExplorer } from './RoutesExplorer';

const places = JSON.parse(fs.readFileSync('public/places.json', 'utf8'));
beforeEach(() => vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => places }))));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const cards = () => document.querySelectorAll('[data-route-card]');

describe('routes & fares', () => {
  it('lists every district with its transport options and fares from the guide data', async () => {
    render(<RoutesExplorer onOpenDistrict={vi.fn()} />);
    await waitFor(() => expect(cards().length).toBe(64));
    expect(screen.getAllByText(/গ্রীন লাইন/).length).toBeGreaterThan(0);
  });
  it('filters by transport type, sorts by distance, searches and opens a guide', async () => {
    const open = vi.fn();
    render(<RoutesExplorer onOpenDistrict={open} />);
    await waitFor(() => expect(cards().length).toBe(64));
    fireEvent.click(screen.getByRole('button', { name: 'লঞ্চ / নৌপথ' }));
    const launchCount = cards().length;
    expect(launchCount).toBeGreaterThan(5);
    expect(launchCount).toBeLessThan(64);
    fireEvent.click(screen.getByRole('button', { name: 'সব' }));
    fireEvent.change(screen.getByLabelText('জেলার নাম খুঁজুন'), { target: { value: 'সিলেট' } });
    expect(cards().length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'গাইড দেখুন' }));
    expect(open).toHaveBeenCalledWith('Sylhet');
  });
  it('sorts nearest first by default', async () => {
    render(<RoutesExplorer onOpenDistrict={vi.fn()} />);
    await waitFor(() => expect(cards().length).toBe(64));
    const first = cards()[0].textContent ?? '';
    expect(first).toContain('ঢাকা');
  });
});

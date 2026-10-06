// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { TravelCardModal } from './TravelCardModal';

const K = (k: string) => `deshbhromon_${k}`;
const props = (over = {}) => ({
  onClose: vi.fn(), travelerName: 'রহিম', onTravelerNameChange: vi.fn(),
  visited: new Set(['Dhaka']), wishlist: new Set<string>(), countries: new Set<string>(), ...over,
});

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never; // jsdom has no canvas; drawing is covered in the browser QA
});
afterEach(() => cleanup());

describe('TravelCardModal', () => {
  it('opens as an accessible dialog with an image alt text and enabled download when districts are marked', () => {
    render(<TravelCardModal {...props()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('১টি ঘোরা');
    expect((screen.getByRole('button', { name: /কার্ড ডাউনলোড/ }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('disables download and explains why when nothing is marked', () => {
    render(<TravelCardModal {...props({ visited: new Set() })} />);
    expect((screen.getByRole('button', { name: /কার্ড ডাউনলোড/ }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/অন্তত একটি ঘোরা জেলা/)).toBeTruthy();
  });

  it('only offers the plan and the diary line when that data exists, and never pre-selects the diary text', () => {
    render(<TravelCardModal {...props()} />);
    expect((screen.getByLabelText(/পরবর্তী যাত্রা/) as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByLabelText(/সেরা স্মৃতির লেখা/) as HTMLInputElement).disabled).toBe(true);
    cleanup();
    localStorage.setItem(K('travel_logs'), JSON.stringify([{ id: '1', districtId: 'Sylhet', date: '2025-01', companions: 'solo', rating: 5, notes: 'গোপন স্মৃতি' }]));
    localStorage.setItem(K('trip_planner'), JSON.stringify({ startDistrict: 'Dhaka', stops: ['Sylhet'], days: 3 }));
    render(<TravelCardModal {...props()} />);
    const plan = screen.getByLabelText(/পরবর্তী যাত্রা/) as HTMLInputElement;
    const quote = screen.getByLabelText(/সেরা স্মৃতির লেখা/) as HTMLInputElement;
    expect(plan.disabled).toBe(false);
    expect(plan.checked).toBe(true);
    expect(quote.disabled).toBe(false);
    expect(quote.checked).toBe(false);
    expect((screen.getByRole('textbox', { name: /ক্যাপশন/ }) as HTMLTextAreaElement).value).not.toContain('গোপন');
    fireEvent.click(quote);
    expect(quote.checked).toBe(true);
  });

  it('lets the traveller edit the name and closes with Escape', () => {
    const p = props();
    render(<TravelCardModal {...p} />);
    fireEvent.change(screen.getByLabelText(/কার্ডে যে নাম/), { target: { value: 'করিম' } });
    expect(p.onTravelerNameChange).toHaveBeenCalledWith('করিম');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(p.onClose).toHaveBeenCalled();
  });

  it('survives corrupted diary and planner storage', () => {
    localStorage.setItem(K('travel_logs'), '{{{');
    localStorage.setItem(K('trip_planner'), '[1,2');
    render(<TravelCardModal {...props()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});

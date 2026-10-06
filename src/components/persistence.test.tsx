// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TripPlanner } from './TripPlanner';
import { TravelDiary } from './TravelDiary';
import { TravelSafetyAndSeasons } from './TravelSafetyAndSeasons';
import { PLANNER_KEY, parsePlanner } from '../lib/tripPlan';

const K = (k: string) => `deshbhromon_${k}`;

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('print', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => cleanup());

// "Reload" = unmount everything and mount a fresh tree against the same localStorage.
function reload<T>(ui: () => React.ReactElement) {
  cleanup();
  return render(ui());
}

describe('trip planner persistence', () => {
  const ui = () => <TripPlanner />;

  it('starts from defaults when storage is empty', () => {
    render(ui());
    expect((screen.getByLabelText('সময়কাল (দিন)') as HTMLInputElement).value).toBe('4');
    expect(screen.getByLabelText('কক্সবাজার বাদ দিন')).toBeTruthy();
  });

  it('create → reload: edits survive', async () => {
    const u = userEvent.setup();
    render(ui());
    fireEvent.change(screen.getByLabelText('সময়কাল (দিন)'), { target: { value: '7' } });
    await u.selectOptions(screen.getByLabelText('আরও জেলা যুক্ত করুন'), 'Sylhet');
    reload(ui);
    expect((screen.getByLabelText('সময়কাল (দিন)') as HTMLInputElement).value).toBe('7');
    expect(screen.getByLabelText('সিলেট বাদ দিন')).toBeTruthy();
  });

  it('edit → reload: checklist, notes and costs persist', async () => {
    const u = userEvent.setup();
    render(ui());
    await u.type(screen.getByPlaceholderText(/নতুন কোনো প্রয়োজনীয়/), 'ক্যামেরা');
    await u.click(screen.getByRole('button', { name: 'যোগ করুন' }));
    await u.type(screen.getByPlaceholderText(/সেন্টমার্টিন জাহাজ/), 'ভোরে রওনা');
    fireEvent.change(screen.getByLabelText('পরিবহন খরচ (টাকা)'), { target: { value: '5000' } });
    reload(ui);
    const region = screen.getByRole('region', { name: 'চেকলিস্ট' });
    expect(within(region).getByText('ক্যামেরা')).toBeTruthy();
    expect((screen.getByPlaceholderText(/সেন্টমার্টিন জাহাজ/) as HTMLTextAreaElement).value).toBe('ভোরে রওনা');
    expect((screen.getByLabelText('পরিবহন খরচ (টাকা)') as HTMLInputElement).value).toBe('5000');
  });

  it('delete → reload: a removed stop stays removed', async () => {
    const u = userEvent.setup();
    render(ui());
    await u.click(screen.getByLabelText('বান্দরবান বাদ দিন'));
    reload(ui);
    expect(screen.queryByLabelText('বান্দরবান বাদ দিন')).toBeNull();
    expect(screen.getByLabelText('কক্সবাজার বাদ দিন')).toBeTruthy();
  });

  it('corrupted JSON falls back to defaults and keeps a backup', () => {
    localStorage.setItem(K(PLANNER_KEY), '{not json');
    render(ui());
    expect((screen.getByLabelText('সময়কাল (দিন)') as HTMLInputElement).value).toBe('4');
    expect(localStorage.getItem(K(`${PLANNER_KEY}_unreadable_backup`))).toBe('{not json');
  });

  it('wrong-shaped data is rejected or salvaged field by field', () => {
    expect(parsePlanner([1, 2])).toBeNull();
    expect(parsePlanner('x')).toBeNull();
    const p = parsePlanner({ days: 'many', travelers: 3, stops: ['Nowhere', 'Sylhet', 5], checklist: [{ id: 1 }], budgetTier: 'x' });
    expect(p?.days).toBe(4);
    expect(p?.travelers).toBe(3);
    expect(p?.stops).toEqual(['Sylhet']);
    expect(p?.checklist).toEqual([]);
    expect(p?.budgetTier).toBe('standard');

    localStorage.setItem(K(PLANNER_KEY), JSON.stringify({ days: 9, stops: 'oops' }));
    render(ui());
    expect((screen.getByLabelText('সময়কাল (দিন)') as HTMLInputElement).value).toBe('9');
  });
});

describe('travel diary edit', () => {
  const ui = () => <TravelDiary visited={new Set()} onMarkVisited={() => {}} />;
  const seed = (notes = 'প্রথম স্মৃতি') =>
    localStorage.setItem(
      K('travel_logs'),
      JSON.stringify([{ id: '1', districtId: 'Sylhet', date: '2024-03', companions: 'solo', rating: 3, notes }]),
    );

  async function create(u: ReturnType<typeof userEvent.setup>, text: string) {
    await u.click(screen.getByRole('button', { name: /নতুন স্মৃতি যোগ করুন/ }));
    await u.type(screen.getByRole('textbox'), text);
    await u.click(screen.getByRole('button', { name: 'ডায়েরিতে সেভ করুন' }));
  }

  it('create → edit → reload', async () => {
    const u = userEvent.setup();
    render(ui());
    await create(u, 'মূল লেখা');
    await u.click(screen.getByTitle('সম্পাদনা করুন'));
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(ta.value).toBe('মূল লেখা');
    await u.clear(ta);
    await u.type(ta, 'বদলানো লেখা');
    await u.click(screen.getByRole('button', { name: 'পরিবর্তন সেভ করুন' }));
    reload(ui);
    expect(screen.getByText(/বদলানো লেখা/)).toBeTruthy();
    expect(screen.queryByText(/মূল লেখা/)).toBeNull();
    expect(screen.getAllByTitle('সম্পাদনা করুন')).toHaveLength(1);
  });

  it('edit → cancel leaves the original untouched', async () => {
    seed();
    const u = userEvent.setup();
    render(ui());
    await u.click(screen.getByTitle('সম্পাদনা করুন'));
    await u.type(screen.getByRole('textbox'), ' EXTRA');
    await u.click(screen.getByRole('button', { name: 'বাতিল করুন' }));
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText(/প্রথম স্মৃতি/)).toBeTruthy();
    expect(screen.queryByText(/EXTRA/)).toBeNull();
    expect(JSON.parse(localStorage.getItem(K('travel_logs'))!)[0].notes).toBe('প্রথম স্মৃতি');
  });

  it('Escape cancels and focus returns to the edit button', async () => {
    seed();
    const u = userEvent.setup();
    render(ui());
    const btn = screen.getByTitle('সম্পাদনা করুন');
    await u.click(btn);
    await u.keyboard('{Escape}');
    expect(screen.queryByRole('textbox')).toBeNull();
    await vi.waitFor(() => expect(document.activeElement).toBe(btn));
  });

  it('edit → save keeps id, other fields and updates the changed ones', async () => {
    seed();
    const u = userEvent.setup();
    render(ui());
    await u.click(screen.getByTitle('সম্পাদনা করুন'));
    await u.selectOptions(screen.getByLabelText('জেলা'), 'Bandarban');
    await u.click(screen.getByRole('button', { name: '5 স্টার' }));
    await u.click(screen.getByRole('button', { name: 'পরিবর্তন সেভ করুন' }));
    const saved = JSON.parse(localStorage.getItem(K('travel_logs'))!);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ id: '1', districtId: 'Bandarban', date: '2024-03', companions: 'solo', rating: 5, notes: 'প্রথম স্মৃতি' });
  });

  it('rejects an empty/whitespace edit without changing data', async () => {
    seed();
    const u = userEvent.setup();
    render(ui());
    await u.click(screen.getByTitle('সম্পাদনা করুন'));
    const ta = screen.getByRole('textbox');
    await u.clear(ta);
    await u.type(ta, '   ');
    await u.click(screen.getByRole('button', { name: 'পরিবর্তন সেভ করুন' }));
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(K('travel_logs'))!)[0].notes).toBe('প্রথম স্মৃতি');
  });

  it('delete after editing removes the entry for good', async () => {
    seed();
    const u = userEvent.setup();
    render(ui());
    await u.click(screen.getByTitle('সম্পাদনা করুন'));
    await u.type(screen.getByRole('textbox'), '!');
    await u.click(screen.getByRole('button', { name: 'পরিবর্তন সেভ করুন' }));
    await u.click(screen.getByTitle('মুছুন'));
    reload(ui);
    expect(screen.getByText(/এখনও কোনো ভ্রমণ স্মৃতি/)).toBeTruthy();
  });

  it('survives corrupted storage', () => {
    localStorage.setItem(K('travel_logs'), '{{{');
    render(ui());
    expect(screen.getByText(/এখনও কোনো ভ্রমণ স্মৃতি/)).toBeTruthy();
    expect(localStorage.getItem(K('travel_logs_unreadable_backup'))).toBe('{{{');
  });
});

describe('seasons guide', () => {
  it('covers all six seasons and never lists invented destinations for summer/spring', () => {
    render(<TravelSafetyAndSeasons />);
    for (const s of ['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত']) expect(screen.getAllByText(new RegExp(s)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/তথ্যসূত্র:/)).toHaveLength(3);
  });
});

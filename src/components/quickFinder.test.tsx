// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickFinder } from './QuickFinder';

afterEach(() => cleanup());

describe('quick finder', () => {
  it('finds a district by its Bangla name and opens it', async () => {
    const u = userEvent.setup();
    const onOpenDistrict = vi.fn();
    render(<QuickFinder visited={new Set()} onOpenDistrict={onOpenDistrict} onNavigate={vi.fn()} />);
    await u.type(screen.getByLabelText('জেলা বা খাবার খুঁজুন'), 'সিলেট');
    await u.click(screen.getAllByRole('button').find((b) => /জেলা · /.test(b.textContent ?? '') && /সিলেট/.test(b.textContent ?? ''))!);
    expect(onOpenDistrict).toHaveBeenCalledWith('Sylhet');
  });
  it('finds a food and opens the food tracker', async () => {
    const u = userEvent.setup();
    const onNavigate = vi.fn();
    render(<QuickFinder visited={new Set()} onOpenDistrict={vi.fn()} onNavigate={onNavigate} />);
    await u.type(screen.getByLabelText('জেলা বা খাবার খুঁজুন'), 'ইলিশ');
    await u.click(screen.getAllByText('খাবার')[0].closest('button')!);
    expect(onNavigate).toHaveBeenCalledWith('food');
  });
  it('"show me a new district" avoids already visited ones', async () => {
    const u = userEvent.setup();
    const onOpenDistrict = vi.fn();
    const { DISTRICT_DETAILS } = await import('../data/bangladesh-data');
    const all = Object.keys(DISTRICT_DETAILS);
    render(<QuickFinder visited={new Set(all.filter((d) => d !== 'Bandarban'))} onOpenDistrict={onOpenDistrict} onNavigate={vi.fn()} />);
    await u.click(screen.getByRole('button', { name: /নতুন জেলা/ }));
    expect(onOpenDistrict).toHaveBeenCalledWith('Bandarban');
  });
});

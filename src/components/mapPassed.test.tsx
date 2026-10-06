// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapTracker } from './MapTracker';

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
  vi.stubGlobal('Path2D', class {});
});
afterEach(() => cleanup());

function mount(extra: Partial<React.ComponentProps<typeof MapTracker>> = {}) {
  const onTogglePassed = vi.fn();
  render(
    <MapTracker
      visited={new Set()}
      wishlist={new Set()}
      onToggleVisited={vi.fn()}
      onToggleWishlist={vi.fn()}
      onTogglePassed={onTogglePassed}
      onSelectAll={vi.fn()}
      onClearAll={vi.fn()}
      travelerName=""
      onTravelerNameChange={vi.fn()}
      {...extra}
    />,
  );
  return { onTogglePassed };
}

describe('map: passed-through districts and Saint Martin', () => {
  it('shows a legend with the separate "passed through" colour and Saint Martin', () => {
    mount();
    const legend = document.querySelector('[data-map-legend]')!;
    expect(legend.textContent).toContain('যাত্রাপথে পেরিয়েছি');
    expect(legend.textContent).toContain('সেন্ট মার্টিন');
  });

  it('can mark a district as passed through from the flat list, separately from visited', async () => {
    const u = userEvent.setup();
    const { onTogglePassed } = mount({ passed: new Set(['Sylhet']) });
    await u.click(screen.getByRole('button', { name: /ফ্ল্যাট|সব জেলা/ }));
    const on = screen.getByRole('button', { name: /সিলেট যাত্রাপথে পেরিয়েছি \(আছে\)/ });
    expect(on.getAttribute('aria-pressed')).toBe('true');
    await u.click(screen.getByRole('button', { name: /ঢাকা যাত্রাপথে পেরিয়েছি/ }));
    expect(onTogglePassed).toHaveBeenCalledWith('Dhaka');
  });
});

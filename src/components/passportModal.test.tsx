// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PassportModal } from './PassportModal';

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
  vi.stubGlobal('Path2D', class {});
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const props = (visited: string[]) => ({ onClose: vi.fn(), travelerName: 'রহিম', onTravelerNameChange: vi.fn(), visited: new Set(visited) });

describe('PassportModal', () => {
  it('opens as a dialog, shows a cover tab plus one page per 12 stamps and remembers the cover colour', () => {
    const ids = ['Dhaka', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal', 'Rangpur', 'Bogura', 'Cumilla', 'Feni', 'Noakhali', 'Pabna', 'Natore', 'Jashore'];
    render(<PassportModal {...props(ids)} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'কভার' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'পাতা ১' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'পাতা ২' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'পাতা ৩' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /নীল/ }));
    expect(localStorage.getItem('deshbhromon_passport_cover')).toBe('blue');
    expect(localStorage.getItem('deshbhromon_passport_issued')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('tells the traveller to mark a district first when there are no stamps, and closes with Escape', () => {
    const p = props([]);
    render(<PassportModal {...p} />);
    expect(screen.getByText(/অন্তত একটি জেলা/)).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(p.onClose).toHaveBeenCalled();
  });
});

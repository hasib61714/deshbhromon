// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { InstallButton } from './InstallButton';

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('install button', () => {
  it('is hidden until the browser offers installation, then shows and triggers the prompt', async () => {
    const { container } = render(<InstallButton />);
    expect(container.querySelector('[data-install]')).toBeNull();
    const prompt = vi.fn().mockResolvedValue(undefined);
    const e = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt, userChoice: Promise.resolve({ outcome: 'accepted' as const }) });
    act(() => { window.dispatchEvent(e); });
    fireEvent.click(await screen.findByRole('button', { name: /অ্যাপ হিসেবে রাখুন/ }));
    expect(prompt).toHaveBeenCalled();
  });
});

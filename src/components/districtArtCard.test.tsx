// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DistrictArtCard } from './DistrictArtCard';
import { DISTRICT_IMAGES } from '../data/landmark-images';

afterEach(() => cleanup());

describe('DistrictArtCard photo', () => {
  const photo = DISTRICT_IMAGES.Bagerhat;

  it('shows the credited photo once it loads, with the photo caption and the credit line', () => {
    render(<DistrictArtCard districtId="Bagerhat" />);
    const img = screen.getByRole('img', { name: photo.caption });
    expect(img.getAttribute('src')).toBe(photo.url);
    expect(screen.queryByText(/ছবি:/)).toBeNull(); // not credited until it is really shown
    fireEvent.load(img);
    expect(screen.getByText(/ছবি:/).textContent).toContain(photo.photographer!);
    expect(screen.getByText(/ছবি:/).textContent).toContain(photo.license!);
  });

  it('keeps the illustration (no broken image, no credit) when the photo fails', () => {
    render(<DistrictArtCard districtId="Bagerhat" />);
    fireEvent.error(screen.getByRole('img', { name: photo.caption }));
    expect(screen.queryByRole('img', { name: photo.caption })).toBeNull();
    expect(screen.queryByText(/ছবি:/)).toBeNull();
    expect(screen.getByText('বাগেরহাট')).toBeTruthy();
  });

  it('never prints an AI prompt anywhere on the card', () => {
    const { container } = render(<DistrictArtCard districtId="Bagerhat" />);
    expect(container.textContent).not.toMatch(/AI Prompt/i);
  });
});

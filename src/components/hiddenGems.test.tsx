// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HiddenGems } from './HiddenGems';
import { buildMessage, mailtoUrl, validateGem, whatsappUrl } from '../lib/gemSubmission';
import { HIDDEN_GEMS } from '../data/hidden-gems';
import { DISTRICT_DETAILS } from '../data/bangladesh-data';

afterEach(() => cleanup());

const good = { districtId: 'Sylhet', name: 'লালাখাল', desc: 'নীল পানির নদী আর দুই পাশে চা বাগান, নৌকায় ঘোরা যায়।', how: '', video: '', category: 'প্রকৃতি', sender: 'রহিম', consent: true };

describe('hidden gems submission', () => {
  it('requires district, name, description, sender and consent', () => {
    expect(validateGem(good)).toEqual([]);
    expect(validateGem({ ...good, consent: false })).toHaveLength(1);
    expect(validateGem({ ...good, districtId: '', name: '', desc: 'ছোট', sender: '' })).toHaveLength(4 + 0);
  });
  it('accepts only https YouTube / Facebook video links', () => {
    expect(validateGem({ ...good, video: 'https://youtu.be/abc' })).toEqual([]);
    expect(validateGem({ ...good, video: 'http://youtu.be/abc' })).toHaveLength(1);
    expect(validateGem({ ...good, video: 'https://evil.example/x' })).toHaveLength(1);
    expect(validateGem({ ...good, video: 'javascript:alert(1)' })).toHaveLength(1);
  });
  it('builds a message with the sender name and consent line, and contact links', () => {
    const m = buildMessage(good);
    expect(m).toContain('সিলেট');
    expect(m).toContain('প্রেরক: রহিম');
    expect(m).toContain('অনুমতি');
    expect(whatsappUrl('+880 1700-000000', m)).toMatch(/^https:\/\/wa\.me\/8801700000000\?text=/);
    expect(mailtoUrl('a@b.test', m)).toMatch(/^mailto:a@b\.test\?subject=/);
  });
  it('published gems all point at a real district and carry the sender name', () => {
    for (const g of HIDDEN_GEMS) {
      expect(DISTRICT_DETAILS[g.districtId], g.id).toBeDefined();
      expect(g.by.length, g.id).toBeGreaterThan(1);
      if (g.photo) expect(g.photo.src.startsWith('/assets/gems/') || g.photo.src.startsWith('https://upload.wikimedia.org'), g.id).toBe(true);
    }
  });
});

describe('HiddenGems page', () => {
  it('shows an honest empty state, then the message after a valid form, and never sends anything itself', () => {
    render(<HiddenGems gems={[]} contact={{ whatsapp: '', email: '' }} />);
    expect(document.querySelector('[data-gems-empty]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /জায়গা পাঠান/ }));
    fireEvent.click(screen.getByRole('button', { name: /মেসেজ তৈরি করুন/ }));
    expect(screen.getByRole('alert')).toBeTruthy();
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'Sylhet' } });
    fireEvent.change(screen.getByLabelText(/জায়গার নাম/), { target: { value: good.name } });
    fireEvent.change(screen.getByLabelText(/জায়গাটি সম্পর্কে লিখুন/), { target: { value: good.desc } });
    fireEvent.change(screen.getByLabelText(/আপনার নাম/), { target: { value: good.sender } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /মেসেজ তৈরি করুন/ }));
    expect(document.querySelector('[data-gem-message]')).toBeTruthy();
    expect(screen.queryByRole('link', { name: /WhatsApp/ })).toBeNull();
  });
  it('lists published gems and filters by district', () => {
    const gems = [
      { id: 'a', districtId: 'Sylhet', name: 'লালাখাল', desc: 'বর্ণনা', category: 'প্রকৃতি', by: 'রহিম' },
      { id: 'b', districtId: 'Bogura', name: 'মহাস্থান', desc: 'বর্ণনা', category: 'ঐতিহাসিক স্থান', by: 'করিম' },
    ];
    render(<HiddenGems gems={gems} contact={{ whatsapp: '', email: '' }} />);
    expect(document.querySelectorAll('[data-gem]').length).toBe(2);
    fireEvent.change(screen.getByLabelText('জেলা অনুযায়ী দেখুন'), { target: { value: 'Bogura' } });
    expect(document.querySelectorAll('[data-gem]').length).toBe(1);
    expect(screen.getByText('পাঠিয়েছেন: করিম')).toBeTruthy();
  });
});

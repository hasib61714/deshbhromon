import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readString, writeString } from '../lib/storage';
import { toBengaliNumber } from '../data/bangladesh-data';
import { EN } from './en';

export type Lang = 'bn' | 'en';

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

// Bengali letters such as ড় can be typed two ways that look identical; compare them in NFC so a lookup never misses
const EN_NORM = new Map(Object.entries(EN).map(([k, v]) => [k.normalize('NFC'), v]));

const Ctx = createContext<LangValue>({ lang: 'bn', setLang: () => {} });

// Bangla is the default; the choice is remembered on this device
export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => (readString('lang', 'bn') === 'en' ? 'en' : 'bn'));
  useEffect(() => {
    writeString('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// tr('বাংলা বাক্য') returns the English text in English mode (the Bangla sentence is the key); falls back to Bangla
// n(5) gives ৫ in Bangla and 5 in English
export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  return {
    lang,
    setLang,
    tr: (bn: string): string => (lang === 'en' ? EN_NORM.get(bn.normalize('NFC')) ?? bn : bn),
    n: (x: number | string): string => (lang === 'en' ? String(x) : toBengaliNumber(x)),
  };
}

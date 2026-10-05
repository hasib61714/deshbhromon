import React from 'react';
import { ExternalLink, Map, PhoneCall } from 'lucide-react';
import type { NavTabId } from './Navbar';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenEmergency?: () => void;
  setActiveTab: (tab: NavTabId) => void;
}

const COLUMNS: { title: string; links: { tab: NavTabId; label: string }[] }[] = [
  {
    title: 'অন্বেষণ',
    links: [
      { tab: 'home', label: 'হোম' },
      { tab: 'guide', label: 'জেলা গাইড' },
      { tab: 'map', label: 'আমার ম্যাপ' },
      { tab: 'world', label: 'বিশ্ব ভ্রমণ' },
    ],
  },
  {
    title: 'পরিকল্পনা ও স্মৃতি',
    links: [
      { tab: 'plan', label: 'ট্রিপ প্ল্যানার' },
      { tab: 'diary', label: 'ভ্রমণ ডায়েরি' },
      { tab: 'food', label: 'ফুড ট্র্যাকার' },
      { tab: 'safety', label: 'ঋতু ও নিরাপত্তা' },
    ],
  },
];

const linkClass = 'inline-block py-1.5 text-sm text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer';

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenEmergency, setActiveTab }) => {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center" aria-hidden="true">
                <Map className="w-4.5 h-4.5" />
              </span>
              <span className="font-extrabold text-lg tracking-tight text-stone-900">দেশভ্রমণ</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">DeshBhromon</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              বাংলাদেশের প্রতিটি জেলা, প্রতিটি গল্প, প্রতিটি ভ্রমণ — এক জায়গায়। ভ্রমণ গাইড, ম্যাপ, প্ল্যানার ও ডায়েরি।
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.tab}>
                    <button type="button" onClick={() => setActiveTab(l.tab)} className={linkClass}>
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="সহায়তা">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">সহায়তা</h2>
            <ul>
              <li>
                <button type="button" onClick={() => setActiveTab('quiz')} className={linkClass}>
                  কুইজ খেলা
                </button>
              </li>
              {onOpenEmergency && (
                <li>
                  <button type="button" onClick={onOpenEmergency} className={`${linkClass} !text-rose-700 hover:!text-rose-900 font-bold inline-flex items-center gap-1.5`}>
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                    জরুরি নম্বর
                  </button>
                </li>
              )}
              <li>
                <button type="button" onClick={onOpenAbout} className={linkClass}>
                  প্রকল্প ও যোগাযোগ
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} দেশভ্রমণ · DeshBhromon. ছবি: উইকিমিডিয়া কমন্স (CC লাইসেন্স)।
          </p>
          <p className="flex items-center gap-1.5">
            <span>Designed &amp; developed by</span>
            <a
              href="https://hasibul-hasan-portfolio-main.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 py-2 font-semibold text-stone-800 hover:text-emerald-800 transition-colors"
            >
              Md. Hasibul Hasan
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

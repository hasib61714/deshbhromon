import React from 'react';
import { Map, Heart, Mail, Sparkles, PhoneCall } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenEmergency?: () => void;
  setActiveTab: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenEmergency, setActiveTab }) => {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
                <Map className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-stone-900">
                দেশভ্রমণ (DeshBhromon)
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              বাংলাদেশের ৬৪ জেলার ডিজিটাল ভ্রমণ মানচিত্র, দর্শনীয় স্থানের গাইড, ট্রিপ প্ল্যানার ও
              ভৌগোলিক কুইজ প্ল্যাটফর্ম।
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-stone-600">
            <button
              onClick={() => setActiveTab('map')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              আমার ম্যাপ
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              জেলা গাইড
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              ট্রিপ প্ল্যানার
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              কুইজ খেলা
            </button>
            <button
              onClick={() => setActiveTab('world')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              বিশ্ব ভ্রমণ
            </button>
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>জরুরি হেল্পলাইন (২৪/৭)</span>
              </button>
            )}
            <button
              onClick={onOpenAbout}
              className="text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer"
            >
              নির্মাতা পরিচিতি (মোঃ হাসিবুল হাসান)
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} দেশভ্রমণ · সম্পূর্ণ স্বাধীন ও উন্মুক্ত ট্রাভেল প্রজেক্ট
          </div>

          <div className="flex items-center gap-1.5 text-stone-600">
            <span>Developed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>by</span>
            <a
              href="https://hasibul-hasan-portfolio-main.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-stone-900 hover:text-emerald-700 underline ml-0.5"
            >
              মোঃ হাসিবুল হাসান (Md. Hasibul Hasan)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

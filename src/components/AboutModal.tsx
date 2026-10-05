import {
  dialogProps
} from '../lib/dialog';
import React, { useState } from 'react';
import {
  X,
  Mail,
  Check,
  Sparkles,
  Heart,
  Globe2,
  ShieldCheck,
  ExternalLink,
  Copy,
  MessageCircle,
  Briefcase,
  Cpu,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const email = 'mh.hasan14200@gmail.com';
  const portfolioUrl = 'https://hasibul-hasan-portfolio-main.vercel.app/';

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppContact = () => {
    const msg = `হ্যালো মোঃ হাসিবুল হাসান ভাই! আমি দেশভ্রমণ (DeshBhromon) অ্যাপ দেখে আপনার সাথে সফটওয়্যার প্রজেক্ট বা কলাবোরেশন নিয়ে যোগাযোগ করতে চাই।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const skills = [
    'React 19 & Next.js',
    'TypeScript (Strict)',
    'Tailwind CSS Architecture',
    'HTML5 Canvas & GIS Map Systems',
    'Node.js & Express API',
    'Full-Stack System Design',
    'Open-Meteo Satellite Integrations',
    'Performance & PWA Optimization'
  ];

  return (
    <div {...dialogProps(onClose, "creator and project information")} className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto outline-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer shadow-md"
         aria-label="বন্ধ করুন">
          <X className="w-5 h-5" />
        </button>

        {/* Executive Profile Header */}
        <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Developer Avatar Badge */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-200 p-0.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-stone-950 flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-black tracking-wider text-emerald-300">MH</span>
                  <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">DEV</span>
                </div>
              </div>
              <span className="absolute -bottom-2 -right-1 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-stone-950 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span>VERIFIED</span>
              </span>
            </div>

            {/* Name & Credentials */}
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Lead Full-Stack Software Engineer & Creator</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                মোঃ হাসিবুল হাসান
              </h2>
              <span className="text-stone-300 text-xs font-semibold block">
                Md. Hasibul Hasan · Software Architect & Creative Technologist
              </span>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                উচ্চক্ষমতাসম্পন্ন ওয়েব সিস্টেম, ইন্টারঅ্যাক্টিভ জিওস্প্যাশিয়াল আর্কিটেকচার এবং ব্যবহারকারীকেন্দ্রিক ডিজিটাল অভিজ্ঞতার নির্মাতা।
              </p>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-stone-950" />
              <span>লাইভ পোর্টফোলিও ওয়েবসাইট</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-900" />
            </a>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-300" />
              <span>ইমেইল পাঠান</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-emerald-200 font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ইমেইল কপি</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>হোয়াটসঅ্যাপ মেসেজ</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Mission & Purpose */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>দেশভ্রমণ (DeshBhromon) প্রজেক্ট ভিশন</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200">
              বাংলাদেশের ১৮ কোটি মানুষ ও আন্তর্জাতিক ভ্রমণপিপাসুদের জন্য এটি একটি সম্পূর্ণ <strong>উন্মুক্ত, সার্বজনীন এবং বাণিজ্যিক মানের (Enterprise Grade)</strong> ভ্রমণ প্ল্যাটফর্ম হিসেবে তৈরি করা হয়েছে। শতভাগ সঠিক রিয়েল-টাইম স্যাটেলাইট আবহাওয়া, উইকিমিডিয়া অনুমোদিত খাঁটি বাস্তব আলোকচিত্র, নির্ভুল জেলা গাইড, গুগল ম্যাপ নেভিগেশন এবং স্মার্ট ট্রিপ বাজেট ক্যালকুলেটরের মাধ্যমে প্রত্যেকে যেন উপকৃত হতে পারে—এটাই আমার মূল লক্ষ্য।
            </p>
          </div>

          {/* Technical Proficiency & Architecture */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>ডেভেলপমেন্ট স্কিলস ও টেকনোলজি স্ট্যাক</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-stone-100 border border-stone-200/80 text-stone-800 text-xs font-semibold rounded-xl"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>স্বাধীন ও স্বত্বাধিকার-মুক্ত কোড</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-snug">
                সম্পূর্ণ নিজস্ব ও আধুনিক আর্কিটেকচারে তৈরি নিরাপদ ও নির্ভরযোগ্য কোডবেস।
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                <Briefcase className="w-4 h-4 text-stone-700" />
                <span>প্রজেক্ট অনুসন্ধান ও হায়ারিং</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                যেকোনো ওয়েব অ্যাপ্লিকেশন, এন্টারপ্রাইজ প্রজেক্ট বা ফ্রিল্যান্স কাজের জন্য যোগাযোগ করতে পারেন।
              </p>
            </div>
          </div>

          {/* Footer Direct Contact Bar */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <strong className="block text-emerald-400 font-bold">সরাসরি ইমেইল এড্রেস:</strong>
              <span className="text-stone-300 font-mono text-[11px]">{email}</span>
            </div>

            <a
              href={`mailto:${email}?subject=Project%20Inquiry%20from%20DeshBhromon`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shrink-0"
            >
              যোগাযোগ করুন
            </a>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> by{' '}
            <strong className="text-stone-800">মোঃ হাসিবুল হাসান</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

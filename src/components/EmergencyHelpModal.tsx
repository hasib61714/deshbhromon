import {
  dialogProps
} from '../lib/dialog';
import React from 'react';
import {
  X,
  Siren,
  Phone,
  ShieldCheck
} from 'lucide-react';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Only numbers confirmed from public sources are listed. Numbers can change, so the
  // modal asks travellers to double-check before a trip.
  const emergencyContacts = [
    {
      category: 'জাতীয় জরুরি ও ট্যুরিস্ট পুলিশ',
      badge: 'সার্বক্ষণিক ২৪/৭',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      items: [
        {
          name: 'জাতীয় জরুরি সেবা (৯৯৯)',
          desc: 'পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স এক সাথে',
          phone: '999',
          tel: '999',
          color: 'bg-rose-600 text-white',
        },
        {
          name: 'ট্যুরিস্ট পুলিশ হেল্পলাইন',
          desc: 'পর্যটকদের সহায়তা ও নিরাপত্তা (২৪ ঘণ্টা)',
          phone: '01320-222222',
          tel: '01320222222',
          color: 'bg-emerald-800 text-white',
        },
        {
          name: 'ট্যুরিস্ট পুলিশ হেল্পলাইন (বিকল্প)',
          desc: 'প্রথম নম্বরে না পেলে এটি চেষ্টা করুন',
          phone: '01887-878787',
          tel: '01887878787',
          color: 'bg-emerald-700 text-white',
        },
      ],
    },
    {
      category: 'ফায়ার সার্ভিস ও রেলওয়ে',
      badge: 'সহায়তা নম্বর',
      badgeColor: 'bg-blue-100 text-blue-800',
      items: [
        {
          name: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স',
          desc: 'অগ্নিদুর্ঘটনা ও উদ্ধার সহায়তা',
          phone: '16163',
          tel: '16163',
          color: 'bg-rose-700 text-white',
        },
        {
          name: 'বাংলাদেশ রেলওয়ে সহায়তা',
          desc: 'ট্রেনের তথ্য ও সেবা সংক্রান্ত সহায়তা',
          phone: '131',
          tel: '131',
          color: 'bg-amber-600 text-white',
        },
      ],
    },
  ];


  return (
    <div {...dialogProps(onClose, "জরুরি সেবা")} className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto outline-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
         aria-label="বন্ধ করুন">
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-red-950 text-white p-6 sm:p-7 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-rose-200 text-xs font-bold border border-white/20">
            <Siren className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>জরুরি ভ্রমণ হেল্পলাইন ও সাপোর্ট ডিরেক্টরি</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            বাংলাদেশ ট্রাভেলার্স ইমার্জেন্সি সাপোর্ট
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-xl">
            ভ্রমণপথে যেকোনো দুর্ঘটনা, নিরাপত্তা শঙ্কা, ছিনতাই বা জরুরি সহযোগিতার প্রয়োজনে নিচের নম্বরগুলোতে সরাসরি ট্যাপ করে ফোন করুন।
          </p>
        </div>

        {/* Helpline Lists */}
        <div className="p-5 sm:p-6 space-y-6">
          {emergencyContacts.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{section.category}</span>
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section.badgeColor}`}>
                  {section.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {section.items.map((contact, cIdx) => (
                  <a
                    key={cIdx}
                    href={`tel:${contact.tel}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-300 transition-all shadow-xs group"
                  >
                    <div className="space-y-0.5 max-w-[65%]">
                      <strong className="text-xs font-bold text-stone-900 group-hover:text-emerald-950 block truncate">
                        {contact.name}
                      </strong>
                      <span className="text-[10px] text-stone-500 line-clamp-1 block">
                        {contact.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-extrabold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs ${contact.color}`}>
                        <Phone className="w-3 h-3" />
                        <span>{contact.phone}</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Practical Tourist Guidelines */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-1.5">
            <strong className="block font-bold text-amber-900">
              💡 জরুরি অবস্থায় দ্রুত পদক্ষেপ পরামর্শ:
            </strong>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 text-[11px] leading-relaxed">
              <li>অচেনা এলাকায় রাত গভীরে একাকী একা নির্জন স্থানে ঘোরাঘুরি পরিহার করুন।</li>
              <li>পাহাড়ি ও ট্র্যাকিং ট্রেইলে নামার আগে অবশ্যই স্থানীয় গাইড বা আর্মি/বিজিবি চেকপোস্টে নাম এন্ট্রি করুন।</li>
              <li>সমুদ্র সৈকত বা হাওরে নামার আগে লাল পতাকা সংকেত ও লাইভ আবহাওয়ার পূর্বাভাস পর্যবেক্ষণ করুন।</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2 text-xs text-stone-500">
          <span className="pr-3">নম্বর বদলাতে পারে। ভ্রমণের আগে যাচাই করে নিন।</span>
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

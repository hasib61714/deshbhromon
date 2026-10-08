import React, { useState } from 'react';
import { Copy, Facebook } from 'lucide-react';

interface ShareLinksProps {
  url: string;
  text: string;
}

// Facebook share link plus "copy link" for a page address. Nothing is sent anywhere by the app itself.
export const ShareLinks: React.FC<ShareLinksProps> = ({ url, text }) => {
  const [status, setStatus] = useState('');
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('লিংক কপি হয়েছে');
    } catch {
      setStatus('কপি করা যায়নি');
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={fb}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
      >
        <Facebook className="w-4 h-4" aria-hidden="true" />
        <span>Facebook-এ শেয়ার</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
      >
        <Copy className="w-4 h-4" aria-hidden="true" />
        <span>লিংক কপি</span>
      </button>
      <span role="status" aria-live="polite" className="text-[11px] text-emerald-700 min-h-4">{status}</span>
    </div>
  );
};

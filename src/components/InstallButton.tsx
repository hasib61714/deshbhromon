import React, { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

// Chrome fires this when the site can be installed; it is not in the standard DOM typings
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

const isIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

// "Install app" button: uses the browser's own install prompt when it offers one (Android Chrome, desktop Chrome/Edge);
// on iPhone Safari there is no prompt, so it shows the "Add to Home Screen" steps instead. Hidden once installed.
export const InstallButton: React.FC = () => {
  const { lang, tr } = useLang();
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState<boolean>(isStandalone);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setEvt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;
  const ios = isIos();
  if (!evt && !ios) return null;

  const click = async () => {
    if (evt) {
      await evt.prompt();
      const choice = await evt.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
      setEvt(null);
    } else {
      setShowIos((v) => !v);
    }
  };

  return (
    <div data-install className="space-y-2">
      <button
        type="button"
        onClick={click}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/25 text-white text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        {tr('ফোনে অ্যাপ হিসেবে রাখুন')}
      </button>
      {showIos && (
        <p className="text-xs text-emerald-100 leading-relaxed max-w-xs">
          {lang === 'en' ? 'Tap the' : 'Safari-র নিচের'} <Share className="inline w-3.5 h-3.5 align-text-bottom" aria-hidden="true" /> {tr('(শেয়ার) বোতাম চেপে "Add to Home Screen" বেছে নিন।')}
        </p>
      )}
    </div>
  );
};

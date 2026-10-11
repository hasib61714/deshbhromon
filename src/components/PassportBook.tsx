import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PassportBookProps {
  images: string[]; // cover first, then the pages
  index: number;
  onChange: (index: number) => void;
  label: string;
  prevLabel: string;
  nextLabel: string;
}

const TURN_MS = 650;

// A book you leaf through: the top page swings round its left edge (like turning a real page) to show the next one.
// Works with the arrow buttons, the ← → keys and a swipe.
export const PassportBook: React.FC<PassportBookProps> = ({ images, index, onChange, label, prevLabel, nextLabel }) => {
  const [shown, setShown] = useState(index); // the page that is currently face-up
  const [turn, setTurn] = useState<{ from: number; to: number } | null>(null);
  const touchX = useRef<number | null>(null);
  const last = Math.max(0, images.length - 1);

  // A new page chosen from outside (page buttons, arrows): start turning towards it. This is derived while rendering
  // so no effect has to set state.
  const [seenIndex, setSeenIndex] = useState(index);
  if (index !== seenIndex) {
    setSeenIndex(index);
    const from = turn ? turn.to : shown;
    if (turn) setShown(turn.to);
    setTurn(from === index ? null : { from, to: index });
  }
  useEffect(() => {
    if (!turn) return;
    const t = window.setTimeout(() => {
      setShown(turn.to);
      setTurn(null);
    }, TURN_MS);
    return () => window.clearTimeout(t);
  }, [turn]);

  const go = (to: number) => {
    if (turn || to < 0 || to > last || to === shown) return;
    onChange(to);
  };

  const forward = turn ? turn.to > turn.from : true;
  // forward: the current page lifts away over the next one; backward: the previous page lands on top of the current one
  const base = turn ? (forward ? turn.to : turn.from) : shown;
  const flipper = turn ? (forward ? turn.from : turn.to) : null;

  const img = (i: number) => images[Math.min(i, images.length - 1)];

  return (
    <div
      className="w-full max-w-[420px] select-none"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(shown + 1);
        if (e.key === 'ArrowLeft') go(shown - 1);
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (dx < -50) go(shown + 1);
        if (dx > 50) go(shown - 1);
      }}
    >
      <div
        role="img"
        aria-label={label}
        tabIndex={0}
        data-book
        className="relative mx-auto rounded-r-xl shadow-2xl bg-stone-300"
        style={{ aspectRatio: '1080 / 1350', perspective: '1800px' }}
      >
        {images.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-stone-500" role="status">…</div>
        ) : (
          <>
            <img src={img(base)} alt="" draggable={false} className="absolute inset-0 w-full h-full rounded-r-xl rounded-l-sm" />
            {flipper !== null && (
              <img
                key={`${turn!.from}-${turn!.to}`}
                src={img(flipper)}
                alt=""
                draggable={false}
                data-turning
                className="absolute inset-0 w-full h-full rounded-r-xl rounded-l-sm"
                style={{
                  transformOrigin: 'left center',
                  backfaceVisibility: 'hidden',
                  animation: `${forward ? 'passport-turn-out' : 'passport-turn-in'} ${TURN_MS}ms ease-in-out forwards`,
                  boxShadow: '8px 0 24px rgba(0,0,0,0.25)',
                }}
              />
            )}
            {/* spine and page edge, for the look of a bound book */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-black/30 to-transparent" />
            <span aria-hidden="true" className="pointer-events-none absolute -right-1 top-1 bottom-1 w-1 rounded-r bg-stone-100 shadow" />
          </>
        )}
      </div>
      <style>{`
        @keyframes passport-turn-out { 0% { transform: rotateY(0deg); opacity: 1; } 75% { opacity: 1; } 100% { transform: rotateY(-115deg); opacity: 0; } }
        @keyframes passport-turn-in { 0% { transform: rotateY(-115deg); opacity: 0; } 25% { opacity: 1; } 100% { transform: rotateY(0deg); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { [data-turning] { animation-duration: 1ms !important; } }
      `}</style>

      <div className="mt-3 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(shown - 1)} disabled={shown === 0 || !!turn} aria-label={prevLabel} className="w-11 h-11 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center disabled:opacity-30 cursor-pointer">
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <span className="text-xs font-bold text-stone-500 tabular-nums" aria-live="polite">{shown + 1} / {Math.max(1, images.length)}</span>
        <button type="button" onClick={() => go(shown + 1)} disabled={shown >= last || !!turn} aria-label={nextLabel} className="w-11 h-11 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center disabled:opacity-30 cursor-pointer">
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

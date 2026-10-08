import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import { DISTRICT_DETAILS, toBengaliNumber } from '../data/bangladesh-data';
import { clueRounds, memoryDeck, shuffle, trueFalseRounds, type MemoryCard } from '../lib/gameRounds';
import { addScore, GAME_NAMES, personalBest, readScores, topScores, type GameId, type ScoreEntry } from '../lib/gameScores';
import { readString } from '../lib/storage';

type MapData = typeof import('../data/map-data').DATA;
const bn = (id: string) => DISTRICT_DETAILS[id]?.bn ?? id;
const playerName = () => readString('traveler_name', '') || 'আমি';
const btn = 'px-4 py-3 min-h-11 rounded-xl border text-sm font-bold text-left transition-colors cursor-pointer';

// End-of-game card: shows the points, saves them to this device's leaderboard once
const Finish: React.FC<{ game: GameId; points: number; max: number; onAgain: () => void }> = ({ game, points, max, onAgain }) => {
  // The previous best is read before this score is saved
  const [best] = useState(() => personalBest(readScores(), game));
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    addScore(game, playerName(), points);
  }, [game, points]);
  return (
    <div data-game-finish className="text-center space-y-3 py-6">
      <Trophy className="w-10 h-10 mx-auto text-amber-500" aria-hidden="true" />
      <h3 className="text-xl font-extrabold text-stone-900">{toBengaliNumber(points)} / {toBengaliNumber(max)} পয়েন্ট</h3>
      <p className="text-sm text-stone-600" role="status">
        {points > best ? 'নতুন সেরা স্কোর! 🎉' : `আপনার সেরা: ${toBengaliNumber(best)}`}
      </p>
      <button type="button" onClick={onAgain} className="inline-flex items-center gap-2 px-5 py-2.5 min-h-11 rounded-2xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 cursor-pointer">
        <RotateCcw className="w-4 h-4" aria-hidden="true" /> আবার খেলুন
      </button>
    </div>
  );
};

const Header: React.FC<{ title: string; hint: string; round?: number; total?: number; points: number }> = ({ title, hint, round, total, points }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-2">
    <div>
      <h2 className="text-lg font-extrabold text-stone-900">{title}</h2>
      <p className="text-xs text-stone-500">{hint}</p>
    </div>
    <div className="text-xs font-bold text-emerald-800">
      {round !== undefined && total !== undefined && <span>প্রশ্ন {toBengaliNumber(round)}/{toBengaliNumber(total)} · </span>}
      পয়েন্ট {toBengaliNumber(points)}
    </div>
  </div>
);

// ---------- Clue -> district ----------
const ClueGame: React.FC = () => {
  const [rounds, setRounds] = useState(() => clueRounds());
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const again = () => { setRounds(clueRounds()); setI(0); setPicked(null); setPoints(0); setStreak(0); };
  if (i >= rounds.length) return <Finish game="clue" points={points} max={rounds.length * 10 + 90} onAgain={again} />;
  const r = rounds[i];
  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === r.answer) { setPoints((p) => p + 10 + streak * 2); setStreak((s) => s + 1); } else setStreak(0);
  };
  return (
    <div className="space-y-4" data-game="clue">
      <Header title="ক্লু থেকে জেলা চেনো" hint="যার পরিচিতি পড়ছেন, সেটা কোন জেলা?" round={i + 1} total={rounds.length} points={points} />
      <p className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-stone-900 font-bold">{r.clue}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {r.options.map((o) => (
          <button key={o} type="button" disabled={!!picked} onClick={() => choose(o)}
            className={`${btn} ${picked ? (o === r.answer ? 'bg-emerald-100 border-emerald-500' : o === picked ? 'bg-red-100 border-red-400' : 'bg-white border-stone-200 opacity-60') : 'bg-white border-stone-200 hover:border-emerald-400'}`}>
            {bn(o)}
          </button>
        ))}
      </div>
      {picked && (
        <button type="button" onClick={() => { setPicked(null); setI(i + 1); }} className="px-5 py-2.5 min-h-11 rounded-2xl bg-stone-900 text-white text-sm font-bold cursor-pointer">
          {i + 1 === rounds.length ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন'}
        </button>
      )}
    </div>
  );
};

// ---------- True / false ----------
const TrueFalseGame: React.FC = () => {
  const [rounds, setRounds] = useState(() => trueFalseRounds());
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const again = () => { setRounds(trueFalseRounds()); setI(0); setPicked(null); setPoints(0); };
  if (i >= rounds.length) return <Finish game="truefalse" points={points} max={rounds.length * 10} onAgain={again} />;
  const r = rounds[i];
  const choose = (v: boolean) => {
    if (picked !== null) return;
    setPicked(v);
    if (v === r.truth) setPoints((p) => p + 10);
  };
  return (
    <div className="space-y-4" data-game="truefalse">
      <Header title="সত্য না মিথ্যা?" hint="বাক্যটি ঠিক হলে 'সত্য', ভুল হলে 'মিথ্যা' চাপুন।" round={i + 1} total={rounds.length} points={points} />
      <p className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-stone-900 font-bold">{r.statement}</p>
      <div className="grid grid-cols-2 gap-2">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" disabled={picked !== null} onClick={() => choose(v)}
            className={`${btn} text-center ${picked !== null ? (v === r.truth ? 'bg-emerald-100 border-emerald-500' : v === picked ? 'bg-red-100 border-red-400' : 'bg-white border-stone-200 opacity-60') : 'bg-white border-stone-200 hover:border-emerald-400'}`}>
            {v ? 'সত্য' : 'মিথ্যা'}
          </button>
        ))}
      </div>
      {picked !== null && (
        <button type="button" onClick={() => { setPicked(null); setI(i + 1); }} className="px-5 py-2.5 min-h-11 rounded-2xl bg-stone-900 text-white text-sm font-bold cursor-pointer">
          {i + 1 === rounds.length ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন'}
        </button>
      )}
    </div>
  );
};

// ---------- Memory: food <-> district ----------
const MemoryGame: React.FC = () => {
  const [deck, setDeck] = useState<MemoryCard[]>(() => memoryDeck());
  const [open, setOpen] = useState<string[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const again = () => { setDeck(memoryDeck()); setOpen([]); setDone(new Set()); setMoves(0); };
  const pairs = deck.length / 2;
  const points = Math.max(10, 100 - Math.max(0, moves - pairs) * 5);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((k) => deck.find((c) => c.key === k)!);
    const t = setTimeout(() => {
      if (a.pair === b.pair) setDone((d) => new Set(d).add(a.pair));
      setOpen([]);
    }, a.pair === b.pair ? 250 : 800);
    return () => clearTimeout(t);
  }, [open, deck]);

  if (done.size === pairs) return <Finish game="memory" points={points} max={100} onAgain={again} />;
  const flip = (k: string) => {
    if (open.length >= 2 || open.includes(k)) return;
    const next = [...open, k];
    setOpen(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };
  return (
    <div className="space-y-4" data-game="memory">
      <Header title="স্মৃতি জোড়া" hint="খাবার আর তার জেলার কার্ড মেলান। কম চালে মিলালে বেশি পয়েন্ট।" points={points} />
      <p className="text-xs text-stone-500">চাল: {toBengaliNumber(moves)} · মিলেছে {toBengaliNumber(done.size)}/{toBengaliNumber(pairs)}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {deck.map((c) => {
          const shown = open.includes(c.key) || done.has(c.pair);
          return (
            <button key={c.key} type="button" data-memory-card aria-label={shown ? c.label : 'বন্ধ কার্ড'} onClick={() => flip(c.key)} disabled={done.has(c.pair)}
              className={`min-h-20 p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${done.has(c.pair) ? 'bg-emerald-100 border-emerald-400' : shown ? (c.kind === 'food' ? 'bg-amber-100 border-amber-400' : 'bg-sky-100 border-sky-400') : 'bg-emerald-800 border-emerald-900 text-emerald-800'}`}>
              {shown ? c.label : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Find the district on the map ----------
const MapFindGame: React.FC = () => {
  const [map, setMap] = useState<MapData | null>(null);
  const [failed, setFailed] = useState(false);
  const [order, setOrder] = useState<string[]>(() => shuffle(Object.keys(DISTRICT_DETAILS)).slice(0, 10));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let live = true;
    import('../data/map-data').then((m) => live && setMap(m.DATA)).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const again = () => { setOrder(shuffle(Object.keys(DISTRICT_DETAILS)).slice(0, 10)); setI(0); setPicked(null); setPoints(0); setStreak(0); };
  const click = useCallback((id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === order[i]) { setPoints((p) => p + 10 + streak * 2); setStreak((s) => s + 1); } else setStreak(0);
  }, [picked, order, i, streak]);

  if (failed) return <p className="text-sm text-stone-600">মানচিত্র লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>;
  if (i >= order.length) return <Finish game="mapfind" points={points} max={order.length * 10 + 90} onAgain={again} />;
  const target = order[i];
  return (
    <div className="space-y-4" data-game="mapfind">
      <Header title="ম্যাপে খুঁজুন" hint="নামটি যে জেলার, মানচিত্রে সেই জেলায় ট্যাপ করুন।" round={i + 1} total={order.length} points={points} />
      <p className="text-center text-2xl font-extrabold text-emerald-800">{bn(target)}</p>
      {!map ? (
        <p className="text-sm text-stone-500 text-center" role="status">মানচিত্র লোড হচ্ছে…</p>
      ) : (
        <svg viewBox={`0 0 ${map.w} ${map.h}`} className="w-full max-w-[420px] mx-auto" role="group" aria-label="বাংলাদেশের জেলার মানচিত্র">
          {map.f.map((f) => (
            <path
              key={f.n} d={f.d} data-district={f.n}
              onClick={() => click(f.n)}
              fill={picked ? (f.n === target ? '#34d399' : f.n === picked ? '#f87171' : '#e2ece7') : '#e2ece7'}
              stroke="#94a3b8" strokeWidth={0.8}
              className={picked ? '' : 'cursor-pointer hover:fill-emerald-200'}
            />
          ))}
        </svg>
      )}
      {picked && (
        <div className="text-center space-y-2">
          <p className="text-sm font-bold" role="status">{picked === target ? 'সঠিক! ✅' : `ভুল। আপনি ${bn(picked)} চেপেছেন; ${bn(target)} সবুজ দেখানো হয়েছে।`}</p>
          <button type="button" onClick={() => { setPicked(null); setI(i + 1); }} className="px-5 py-2.5 min-h-11 rounded-2xl bg-stone-900 text-white text-sm font-bold cursor-pointer">
            {i + 1 === order.length ? 'ফলাফল দেখুন' : 'পরের জেলা'}
          </button>
        </div>
      )}
    </div>
  );
};

// ---------- Leaderboard (this device) ----------
export const Leaderboard: React.FC = () => {
  const [game, setGame] = useState<GameId | 'all'>('all');
  const [all] = useState<ScoreEntry[]>(() => readScores());
  const rows = useMemo(() => topScores(all, game, 10), [all, game]);
  return (
    <div className="space-y-4" data-game="leaderboard">
      <Header title="লিডারবোর্ড" hint="এই ফোন/কম্পিউটারে খেলা সেরা ১০টি স্কোর।" points={rows[0]?.points ?? 0} />
      <label className="block text-xs font-bold text-stone-600">
        কোন খেলা
        <select value={game} onChange={(e) => setGame(e.target.value as GameId | 'all')} className="block mt-1 px-3 py-2 min-h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm">
          <option value="all">সব খেলা</option>
          {(Object.keys(GAME_NAMES) as GameId[]).map((g) => <option key={g} value={g}>{GAME_NAMES[g]}</option>)}
        </select>
      </label>
      {rows.length === 0 ? (
        <p className="text-sm text-stone-600" role="status">এখনও কোনো স্কোর নেই। একটা খেলা খেলে প্রথম স্কোর জমা করুন!</p>
      ) : (
        <ol className="space-y-1.5">
          {rows.map((r, k) => (
            <li key={`${r.at}-${k}`} data-score-row className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm">
              <span className="font-extrabold w-6">{['🥇', '🥈', '🥉'][k] ?? toBengaliNumber(k + 1)}</span>
              <span className="flex-1 min-w-0 truncate font-bold text-stone-800">{r.name}</span>
              <span className="text-xs text-stone-500 hidden sm:inline">{GAME_NAMES[r.game]}</span>
              <span className="font-extrabold text-emerald-800">{toBengaliNumber(r.points)}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="text-[11px] text-stone-400">স্কোর শুধু এই ডিভাইসে সংরক্ষিত থাকে; সবার সাথে মিলিয়ে র‍্যাংক করার সুবিধা সার্ভার ছাড়া সম্ভব নয়।</p>
    </div>
  );
};

export const NEW_GAMES: { id: string; label: string; node: React.ReactNode }[] = [
  { id: 'mapfind', label: '🗺️ ম্যাপে খুঁজুন', node: <MapFindGame /> },
  { id: 'clue', label: '💡 ক্লু-জেলা', node: <ClueGame /> },
  { id: 'truefalse', label: '✅ সত্য-মিথ্যা', node: <TrueFalseGame /> },
  { id: 'memory', label: '🃏 স্মৃতি জোড়া', node: <MemoryGame /> },
  { id: 'board', label: '🏆 লিডারবোর্ড', node: <Leaderboard /> },
];

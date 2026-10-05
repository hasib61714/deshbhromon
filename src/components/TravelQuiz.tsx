import React, { useState, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz-questions';
import { DISTRICT_DETAILS, toBengaliNumber } from '../data/bangladesh-data';
import { DISTRICT_IMAGES } from '../data/landmark-images';
import {
  Trophy,
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Share2,
  Award,
  Zap,
  ArrowRight,
  Camera,
  Utensils,
  Puzzle,
  Gamepad2,
  Brain,
  Check,
  Flame,
  Star,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

type GameMode = 'quiz' | 'photo' | 'food' | 'anagram';

// Photo Mystery Questions
const PHOTO_MYSTERY_ITEMS = [
  {
    districtId: 'Dhaka',
    landmarkName: 'লালবাগ কেল্লা ও পরীবিবির মাজার',
    options: ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'মুন্সীগঞ্জ'],
    correct: 'ঢাকা',
    hint: 'বুড়িগঙ্গার কাছে অবস্থিত মুঘল সুবেদার শায়েস্তা খাঁর আমলের দুর্গ।'
  },
  {
    districtId: 'Bagerhat',
    landmarkName: 'ঐতিহাসিক ষাট গম্বুজ মসজিদ',
    options: ['খুলনা', 'বাগেরহাট', 'যশোর', 'বরিশাল'],
    correct: 'বাগেরহাট',
    hint: 'ইউনেস্কো বিশ্ব ঐতিহ্য, হযরত খান জাহান আলী (র.)-এর অমর কীর্তি।'
  },
  {
    districtId: 'Bogura',
    landmarkName: 'মহাস্থানগড় ও গোবিন্দ ভিটা',
    options: ['দিনাজপুর', 'বগুড়া', 'নাটোর', 'রাজশাহী'],
    correct: 'বগুড়া',
    hint: 'প্রাচীন বাংলার পুন্ড্রনগরের ধ্বংসাবশেষ ও সুস্বাদু দইয়ের জেলা।'
  },
  {
    districtId: 'Dinajpur',
    landmarkName: 'কান্তজিউ নবরত্ন টেরাকোটা মন্দির',
    options: ['রংপুর', 'পঞ্চগড়', 'দিনাজপুর', 'ঠাকুরগাঁও'],
    correct: 'দিনাজপুর',
    hint: 'কাহারোল উপজেলায় অবস্থিত অসাধারণ পোড়ামাটির টেরাকোটা স্থাপত্য।'
  },
  {
    districtId: 'Sylhet',
    landmarkName: 'রাতারগুল সোয়াম্প ফরেস্ট ও জাফলং',
    options: ['মৌলভীবাজার', 'সুনামগঞ্জ', 'সিলেট', 'হবিগঞ্জ'],
    correct: 'সিলেট',
    hint: 'মিঠাপানির সোয়াম্প ফরেস্ট এবং পিয়াইন নদীর স্বচ্ছ পাথুরে জলধারা।'
  },
  {
    districtId: "Cox's Bazar",
    landmarkName: 'কক্সবাজার সমুদ্র সৈকত ও মেরিন ড্রাইভ',
    options: ['পটুয়াখালী', "কক্সবাজার", 'চট্টগ্রাম', 'ভোলা'],
    correct: "কক্সবাজার",
    hint: 'বিশ্বের দীর্ঘতম ১২০ কিলোমিটার অবিচ্ছিন্ন প্রাকৃতিক বালুকাময় সৈকত।'
  },
  {
    districtId: 'Bandarban',
    landmarkName: 'নীলগিরি ও নীলাচল পাহাড়ের চূড়া',
    options: ['রাঙ্গামাটি', 'খাগড়াছড়ি', 'বান্দরবান', 'চট্টগ্রাম'],
    correct: 'বান্দরবান',
    hint: 'মেঘের ভেলায় ভাসমান নীলগিরি রিসোর্ট ও নাফাখুম জলপ্রপাতের জেলা।'
  },
  {
    districtId: 'Natore',
    landmarkName: 'উত্তরা গণভবন (দিঘাপতিয়া রাজবাড়ি)',
    options: ['নাটোর', 'পাবনা', 'নওগাঁ', 'কুষ্টিয়া'],
    correct: 'নাটোর',
    hint: 'ঐতিহাসিক দিঘাপতিয়া রাজবাড়ি এবং সুস্বাদু খাঁটি কাঁচাগোল্লা।'
  },
  {
    districtId: 'Panchagarh',
    landmarkName: 'তেঁতুলিয়া জিরো পয়েন্ট ও কাঞ্চনজঙ্ঘা দৃশ্য',
    options: ['নীলফামারী', 'কুড়িগ্রাম', 'দিনাজপুর', 'পঞ্চগড়'],
    correct: 'পঞ্চগড়',
    hint: 'বাংলাদেশের সর্বউত্তরের জেলা যেখান থেকে হিমালয়ের বরফশৃঙ্গ দেখা যায়।'
  },
  {
    districtId: 'Sunamganj',
    landmarkName: 'টাঙ্গুয়ার হাওর ও নীলাদ্রি লেক',
    options: ['নেত্রকোণা', 'কিশোরগঞ্জ', 'সুনামগঞ্জ', 'হবিগঞ্জ'],
    correct: 'সুনামগঞ্জ',
    hint: 'ইউনেস্কো রামসার সাইট, তাহিরপুরের অপরূপ নীল পানির হ্রদ।'
  }
];

// Food Matching Pairs
const FOOD_MATCH_PAIRS = [
  { id: '1', food: 'বগুড়ার ঐতিহ্যবাহী দই', district: 'বগুড়া', districtId: 'Bogura' },
  { id: '2', food: 'মাতৃভাণ্ডারের রসমলাই', district: 'কুমিল্লা', districtId: 'Cumilla' },
  { id: '3', food: 'নাটোরের খাঁটি কাঁচাগোল্লা', district: 'নাটোর', districtId: 'Natore' },
  { id: '4', food: 'পোড়াবাড়ির সুস্বাদু চমচম', district: 'টাঙ্গাইল', districtId: 'Tangail' },
  { id: '5', food: 'মুক্তাগাছার রাজকীয় মণ্ডা', district: 'ময়মনসিংহ', districtId: 'Mymensingh' },
  { id: '6', food: 'মহিষের দুধের ঘন দই', district: 'ভোলা', districtId: 'Bhola' },
  { id: '7', food: 'ঐতিহ্যবাহী সাবিত্রী ও রসকদম্ব', district: 'মেহেরপুর', districtId: 'Meherpur' },
  { id: '8', food: 'চাটগাঁর বিখ্যাত মেজবানি মাংস', district: 'চট্টগ্রাম', districtId: 'Chattogram' },
];

// District Word Scramble / Anagram Challenges
const ANAGRAM_PUZZLES = [
  {
    id: 1,
    letters: ['ব', 'ন্দা', 'র', 'বা', 'ন'],
    solution: 'বান্দরবান',
    hint: 'বিভাগ: চট্টগ্রাম · বিখ্যাত: নীলগিরি, স্বর্ণ মন্দির ও পাহাড়।'
  },
  {
    id: 2,
    letters: ['গ', 'ঞ্জ', 'সুনাম'],
    solution: 'সুনামগঞ্জ',
    hint: 'বিভাগ: সিলেট · বিখ্যাত: টাঙ্গুয়ার হাওর ও নীলাদ্রি লেক।'
  },
  {
    id: 3,
    letters: ['প', 'ড়', 'পঞ্চ', 'গ'],
    solution: 'পঞ্চগড়',
    hint: 'বিভাগ: রংপুর · বিখ্যাত: তেঁতুলিয়া জিরো পয়েন্ট ও কাঞ্চনজঙ্ঘা।'
  },
  {
    id: 4,
    letters: ['বা', 'হাট', 'গের'],
    solution: 'বাগেরহাট',
    hint: 'বিভাগ: খুলনা · বিখ্যাত: বিশ্ব ঐতিহ্য ষাট গম্বুজ মসজিদ।'
  },
  {
    id: 5,
    letters: ['রা', 'ঙা', 'টি', 'মা'],
    solution: 'রাঙ্গামাটি',
    hint: 'বিভাগ: চট্টগ্রাম · বিখ্যাত: কাপ্তাই হ্রদ ও ঝুলন্ত সেতু।'
  },
  {
    id: 6,
    letters: ['টু', 'প', 'য়া', 'লী', 'খা'],
    solution: 'পটুয়াখালী',
    hint: 'বিভাগ: বরিশাল · বিখ্যাত: সাগরকন্যা কুয়াকাটা সৈকত।'
  },
  {
    id: 7,
    letters: ['কু', 'ল্লা', 'মি'],
    solution: 'কুমিল্লা',
    hint: 'বিভাগ: চট্টগ্রাম · বিখ্যাত: ময়নামতী শালবন বিহার ও রসমলাই।'
  },
  {
    id: 8,
    letters: ['মে', 'পুর', 'হের'],
    solution: 'মেহেরপুর',
    hint: 'বিভাগ: খুলনা · বিখ্যাত: ঐতিহাসিক প্রথম রাজধানী মুজিবনগর।'
  }
];

export const TravelQuiz: React.FC = () => {
  const [activeMode, setActiveMode] = useState<GameMode>('quiz');

  // --- MODE 1: Standard Quiz State ---
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // --- MODE 2: Photo Mystery State ---
  const [photoIdx, setPhotoIdx] = useState<number>(0);
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [photoScore, setPhotoScore] = useState<number>(0);
  const [photoStreak, setPhotoStreak] = useState<number>(0);
  const [photoFinished, setPhotoFinished] = useState<boolean>(false);

  // --- MODE 3: Food Matching State ---
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchWrong, setMatchWrong] = useState<string | null>(null);
  const [foodMoves, setFoodMoves] = useState<number>(0);

  // --- MODE 4: Anagram Puzzle State ---
  const [anagramIdx, setAnagramIdx] = useState<number>(0);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [anagramSolved, setAnagramSolved] = useState<boolean>(false);
  const [anagramScore, setAnagramScore] = useState<number>(0);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Handle Quiz selection
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      const newScore = score + 10 + streak * 2;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuiz = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsFinished(false);
  };

  // Handle Photo selection
  const currentPhotoItem = PHOTO_MYSTERY_ITEMS[photoIdx];
  const currentPhotoMeta = DISTRICT_IMAGES[currentPhotoItem.districtId];

  const handlePhotoSelect = (option: string) => {
    if (photoSelected) return;
    setPhotoSelected(option);

    if (option === currentPhotoItem.correct) {
      setPhotoScore((prev) => prev + 15 + photoStreak * 3);
      setPhotoStreak((prev) => prev + 1);
    } else {
      setPhotoStreak(0);
    }
  };

  const handleNextPhoto = () => {
    if (photoIdx + 1 < PHOTO_MYSTERY_ITEMS.length) {
      setPhotoIdx(photoIdx + 1);
      setPhotoSelected(null);
    } else {
      setPhotoFinished(true);
    }
  };

  const handleRestartPhoto = () => {
    setPhotoIdx(0);
    setPhotoSelected(null);
    setPhotoScore(0);
    setPhotoStreak(0);
    setPhotoFinished(false);
  };

  // Handle Food matching
  const handleFoodClick = (foodText: string) => {
    setSelectedFood(foodText);
    setMatchWrong(null);
  };

  const handleDistrictClick = (districtName: string) => {
    if (!selectedFood) return;
    setFoodMoves((m) => m + 1);

    const pair = FOOD_MATCH_PAIRS.find((p) => p.food === selectedFood);
    if (pair && pair.district === districtName) {
      setMatchedPairs((prev) => new Set([...prev, pair.id]));
      setSelectedFood(null);
    } else {
      setMatchWrong(districtName);
      setTimeout(() => setMatchWrong(null), 1000);
    }
  };

  const handleResetFood = () => {
    setMatchedPairs(new Set());
    setSelectedFood(null);
    setMatchWrong(null);
    setFoodMoves(0);
  };

  // Handle Anagram Tile Click
  const currentAnagram = ANAGRAM_PUZZLES[anagramIdx];

  const handleTileClick = (letter: string, tileIndex: number) => {
    const updated = [...userLetters, letter];
    setUserLetters(updated);

    if (updated.join('') === currentAnagram.solution) {
      setAnagramSolved(true);
      setAnagramScore((prev) => prev + 25);
    }
  };

  const handleRemoveLetter = (index: number) => {
    const updated = [...userLetters];
    updated.splice(index, 1);
    setUserLetters(updated);
    setAnagramSolved(false);
  };

  const handleNextAnagram = () => {
    if (anagramIdx + 1 < ANAGRAM_PUZZLES.length) {
      setAnagramIdx(anagramIdx + 1);
      setUserLetters([]);
      setAnagramSolved(false);
    }
  };

  const handleResetAnagram = () => {
    setAnagramIdx(0);
    setUserLetters([]);
    setAnagramSolved(false);
    setAnagramScore(0);
  };

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header & Mode Tabs */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/80">
              <Brain className="w-3.5 h-3.5 text-amber-600" />
              <span>ভ্রমণ ব্রেন গেমস ও কুইজ এরিনা</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              ব্রেন টিজার ও ভৌগোলিক চ্যালেঞ্জ
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              বাংলাদেশের দর্শনীয় স্থান, আসল ছবি, বিখ্যাত ঐতিহ্যবাহী খাবার ও জেলা নিয়ে বুদ্ধির পরীক্ষা দিন।
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-2xl shrink-0">
            <div className="text-center">
              <span className="block text-[10px] text-stone-500 font-bold uppercase">মোট পয়েন্ট</span>
              <strong className="text-xl font-black text-emerald-700">
                {toBengaliNumber(score + photoScore + matchedPairs.size * 20 + anagramScore)}
              </strong>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-center">
              <span className="block text-[10px] text-stone-500 font-bold uppercase">স্ট্রাইক</span>
              <strong className="text-xl font-black text-amber-600 flex items-center gap-0.5">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{toBengaliNumber(Math.max(streak, photoStreak))}</span>
              </strong>
            </div>
          </div>
        </div>

        {/* 4 Interactive Game Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setActiveMode('quiz')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'quiz'
                ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>১. ভূগোল কুইজ (৩০টি)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('photo')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'photo'
                ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>২. ছবি দেখে জেলা চিনুন</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('food')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'food'
                ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-4 h-4 text-rose-400" />
            <span>৩. ঐতিহ্যবাহী খাবার মেলান</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('anagram')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'anagram'
                ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Puzzle className="w-4 h-4 text-blue-400" />
            <span>৪. বর্ণ সাজিয়ে জেলা আবিষ্কার</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: Standard Geography Quiz (30 Questions) */}
      {/* ============================================================== */}
      {activeMode === 'quiz' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {!isFinished ? (
            <>
              {/* Question Progress Header */}
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-3">
                <span className="font-bold text-emerald-800">
                  প্রশ্ন: {toBengaliNumber(currentIdx + 1)} / {toBengaliNumber(totalQuestions)}
                </span>
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  কুইজ স্কোর: {toBengaliNumber(score)}
                </span>
              </div>

              {/* Question Title */}
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {currentQ.question}
              </h2>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = 'border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-stone-800';

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'border-rose-400 bg-rose-100 text-rose-950 font-bold';
                    } else {
                      btnStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1 animate-in fade-in">
                  <strong className="block font-bold flex items-center gap-1.5 text-emerald-800">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>ব্যাখ্যা ও তথ্য:</span>
                  </strong>
                  <p className="leading-relaxed text-emerald-900/90">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Question Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <span>{currentIdx + 1 === totalQuestions ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Quiz Finished Summary
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                অভিনন্দন! ভূগোল কুইজ সম্পন্ন হয়েছে!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                আপনি ৩০টি প্রশ্নের মধ্যে আপনার অসাধারণ ভৌগোলিক মেধার পরিচয় দিয়েছেন।
              </p>
              <div className="inline-block bg-stone-50 border border-stone-200 p-4 rounded-2xl">
                <span className="text-xs text-stone-500 uppercase font-bold block">মোট অর্জিত স্কোর</span>
                <strong className="text-3xl font-black text-emerald-700">{toBengaliNumber(score)} পয়েন্ট</strong>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-emerald-900 shadow-md cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় খেলুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: Photo Mystery - Guess District by Landmark Picture */}
      {/* ============================================================== */}
      {activeMode === 'photo' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {!photoFinished ? (
            <>
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-3">
                <span className="font-bold text-emerald-800">
                  ছবি চ্যালেঞ্জ: {toBengaliNumber(photoIdx + 1)} / {toBengaliNumber(PHOTO_MYSTERY_ITEMS.length)}
                </span>
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  ফটো স্কোর: {toBengaliNumber(photoScore)}
                </span>
              </div>

              {/* Authentic Landmark Photo Showcase */}
              <div className="space-y-2">
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-sm group">
                  <img
                    src={currentPhotoMeta?.url}
                    alt={currentPhotoItem.landmarkName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs text-amber-300 font-semibold block">প্রশ্ন: এই বিখ্যাত স্থানটি কোন জেলায় অবস্থিত?</span>
                    <strong className="text-base sm:text-lg font-bold">{currentPhotoItem.landmarkName}</strong>
                    <span className="block text-[10px] text-stone-300 pt-0.5">{currentPhotoMeta?.credit}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-500 italic bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
                  💡 <strong>ক্লু / ইঙ্গিত:</strong> {currentPhotoItem.hint}
                </div>
              </div>

              {/* 4 District Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentPhotoItem.options.map((opt, idx) => {
                  let btnStyle = 'border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-stone-800';

                  if (photoSelected) {
                    if (opt === currentPhotoItem.correct) {
                      btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black scale-105 shadow-sm';
                    } else if (opt === photoSelected) {
                      btnStyle = 'border-rose-400 bg-rose-100 text-rose-950 font-bold';
                    } else {
                      btnStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!!photoSelected}
                      onClick={() => handlePhotoSelect(opt)}
                      className={`p-3.5 rounded-2xl border text-center text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {photoSelected && (
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-bold ${photoSelected === currentPhotoItem.correct ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {photoSelected === currentPhotoItem.correct ? '✓ সঠিক উত্তর! +১৫ পয়েন্ট' : `✕ সঠিক উত্তর ছিল: ${currentPhotoItem.correct}`}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    <span>পরবর্তী ছবি</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Photo finished summary
            <div className="text-center py-8 space-y-4">
              <Camera className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-black text-stone-900">ছবি চেনার চ্যালেঞ্জ সম্পন্ন!</h2>
              <p className="text-xs sm:text-sm text-stone-600">আপনি বাংলাদেশের ঐতিহাসিক ও প্রাকৃতিক ল্যান্ডমার্ক নিখুঁতভাবে শনাক্ত করেছেন।</p>
              <div className="inline-block bg-stone-50 p-4 rounded-2xl border border-stone-200 font-black text-2xl text-emerald-800">
                স্কোর: {toBengaliNumber(photoScore)} পয়েন্ট
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleRestartPhoto}
                  className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900"
                >
                  আবার খেলুন
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: Traditional Food Matching Board */}
      {/* ============================================================== */}
      {activeMode === 'food' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-rose-500" />
                <span>ঐতিহ্যবাহী খাবার ও জেলা মেলান</span>
              </h3>
              <p className="text-xs text-stone-500">প্রথমে খাবার নির্বাচন করুন, এরপর সংশ্লিষ্ট জেলা নির্বাচন করুন।</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-emerald-800">
                মেলেছে: {toBengaliNumber(matchedPairs.size)} / {toBengaliNumber(FOOD_MATCH_PAIRS.length)}
              </span>
              <button
                type="button"
                onClick={handleResetFood}
                className="text-stone-400 hover:text-stone-700"
                title="রিসেট করুন"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Foods Column */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                ১. বিখ্যাত ঐতিহ্যবাহী খাবার:
              </span>
              <div className="space-y-2">
                {FOOD_MATCH_PAIRS.map((item) => {
                  const isMatched = matchedPairs.has(item.id);
                  const isSelected = selectedFood === item.food;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleFoodClick(item.food)}
                      className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through opacity-70'
                          : isSelected
                          ? 'bg-rose-100 border-rose-500 text-rose-950 shadow-sm scale-102'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <span>{item.food}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Districts Column (Shuffled order) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                ২. সংশ্লিষ্ট জেলা নির্বাচন করুন:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {FOOD_MATCH_PAIRS.map((item) => {
                  const isMatched = matchedPairs.has(item.id);
                  const isWrong = matchWrong === item.district;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isMatched || !selectedFood}
                      onClick={() => handleDistrictClick(item.district)}
                      className={`p-3 rounded-2xl border text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isMatched
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900 opacity-60'
                          : isWrong
                          ? 'bg-rose-200 border-rose-500 text-rose-950 animate-shake'
                          : selectedFood
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 hover:bg-amber-100 hover:scale-105'
                          : 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {item.district}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {matchedPairs.size === FOOD_MATCH_PAIRS.length && (
            <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-950 text-center font-bold text-sm animate-in zoom-in-95">
              🎉 অসাধারণ! আপনি সবগুলো খাবার ও জেলার সঠিক জুটি মিলিয়েছেন!
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: Scrambled Letters District Anagram */}
      {/* ============================================================== */}
      {activeMode === 'anagram' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-blue-600" />
                <span>এলোমেলো বর্ণ সাজিয়ে জেলা আবিষ্কার</span>
              </h3>
              <p className="text-xs text-stone-500">বর্ণগুলোতে ক্লিক করে সঠিক জেলার নাম বানিয়ে ফেলুন।</p>
            </div>
            <div className="text-xs font-bold text-emerald-800">
              ধাঁধা: {toBengaliNumber(anagramIdx + 1)} / {toBengaliNumber(ANAGRAM_PUZZLES.length)}
            </div>
          </div>

          <div className="space-y-4 max-w-lg mx-auto text-center">
            {/* Clue Box */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-950">
              💡 <strong>ক্লু:</strong> {currentAnagram.hint}
            </div>

            {/* Answer Display Slots */}
            <div className="flex items-center justify-center gap-2 min-h-14 p-3 rounded-2xl bg-stone-50 border border-stone-200">
              {userLetters.length === 0 ? (
                <span className="text-xs text-stone-400">নিচের বর্ণগুলোতে ক্লিক করুন...</span>
              ) : (
                userLetters.map((letter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRemoveLetter(idx)}
                    className="w-11 h-11 rounded-xl bg-emerald-800 text-white font-black text-base shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
                    title="মুছতে ক্লিক করুন"
                  >
                    {letter}
                  </button>
                ))
              )}
            </div>

            {/* Scrambled Letter Tiles */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {currentAnagram.letters.map((letter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTileClick(letter, idx)}
                  className="w-12 h-12 rounded-2xl bg-white border-2 border-stone-200 hover:border-emerald-500 text-stone-900 font-extrabold text-base shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Clear Button */}
            {userLetters.length > 0 && !anagramSolved && (
              <div>
                <button
                  type="button"
                  onClick={() => setUserLetters([])}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  রিসেট করুন
                </button>
              </div>
            )}

            {/* Solved celebration */}
            {anagramSolved && (
              <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-950 font-bold text-sm space-y-2 animate-in zoom-in-95">
                <div>🎉 সঠিক উত্তর! জেলা: {currentAnagram.solution} (+২৫ পয়েন্ট)</div>
                {anagramIdx + 1 < ANAGRAM_PUZZLES.length ? (
                  <button
                    type="button"
                    onClick={handleNextAnagram}
                    className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900"
                  >
                    পরবর্তী ধাঁধা ➔
                  </button>
                ) : (
                  <div className="text-xs text-emerald-800">আপনি সবগুলো জেলার ধাঁধা সমাধান করেছেন!</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

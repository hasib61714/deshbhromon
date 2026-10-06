import React, { useState, useEffect, useRef } from 'react';
import {
  TravelLog
} from '../types';
import {
  writeList
} from '../lib/storage';
import { loadTravelLogs } from '../lib/travelLogs';

const newLogId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
import {
  DISTRICT_DETAILS,
  toBengaliNumber
} from '../data/bangladesh-data';
import {
  BookOpen,
  Calendar,
  Users,
  Star,
  Plus,
  Trash2,
  Pencil,
  MapPin,
  Sparkles,
  Smile,
  IdCard
} from 'lucide-react';

interface TravelDiaryProps {
  visited: Set<string>;
  onMarkVisited: (district: string) => void;
  onOpenTravelCard?: () => void;
}

export const TravelDiary: React.FC<TravelDiaryProps> = ({ visited, onMarkVisited, onOpenTravelCard }) => {
  const [logs, setLogs] = useState<TravelLog[]>(loadTravelLogs);

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Bandarban');
  const [travelDate, setTravelDate] = useState<string>('2025-01');
  const [companion, setCompanion] = useState<'solo' | 'friends' | 'family' | 'couple'>('friends');
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const lastEditBtn = useRef<HTMLElement | null>(null);

  useEffect(() => {
    writeList('travel_logs', logs);
  }, [logs]);

  useEffect(() => {
    if (isAdding) notesRef.current?.focus();
  }, [isAdding, editingId]);

  const resetForm = () => {
    setNotes('');
    setError('');
    setEditingId(null);
    setIsAdding(false);
  };

  const closeForm = () => {
    const back = lastEditBtn.current;
    resetForm();
    if (back && back.isConnected) setTimeout(() => back.focus(), 0);
    lastEditBtn.current = null;
  };

  const startAdd = () => {
    if (isAdding && editingId === null) {
      resetForm();
      return;
    }
    setEditingId(null);
    setError('');
    setNotes('');
    setIsAdding(true);
  };

  const startEdit = (log: TravelLog, trigger: HTMLElement) => {
    lastEditBtn.current = trigger;
    setEditingId(log.id);
    setSelectedDistrict(log.districtId in DISTRICT_DETAILS ? log.districtId : 'Bandarban');
    setTravelDate(/^\d{4}-\d{2}$/.test(log.date) ? log.date : '2025-01');
    setCompanion(log.companions as typeof companion);
    setRating(Math.min(5, Math.max(1, Math.round(log.rating) || 5)));
    setNotes(log.notes);
    setError('');
    setIsAdding(true);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('স্মৃতির লেখা খালি রাখা যাবে না।');
      return;
    }
    if (!/^\d{4}-\d{2}$/.test(travelDate)) {
      setError('ভ্রমণের মাস ও বছর সঠিকভাবে নির্বাচন করুন।');
      return;
    }

    if (editingId !== null) {
      setLogs(
        logs.map((l) =>
          l.id === editingId
            ? { ...l, districtId: selectedDistrict, date: travelDate, companions: companion, rating, notes: notes.trim() }
            : l,
        ),
      );
      onMarkVisited(selectedDistrict);
      closeForm();
      return;
    }

    const newLog: TravelLog = {
      id: newLogId(),
      districtId: selectedDistrict,
      date: travelDate,
      companions: companion,
      rating,
      notes: notes.trim(),
    };

    setLogs([newLog, ...logs]);
    onMarkVisited(selectedDistrict);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
    if (editingId === id) resetForm();
  };

  const companionLabels: Record<string, string> = {
    solo: 'একাকী (Solo)',
    friends: 'বন্ধুদের সাথে',
    family: 'পরিবারের সাথে',
    couple: 'প্রিয়জন / কাপল',
  };

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>ভ্রমণ স্মৃতি ও ট্রাভেল জার্নাল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              আমার ভ্রমণ ডায়েরি (Travel Journal)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              যে জেলাগুলোতে ঘুরেছেন সেখানকার ব্যক্তিগত স্মৃতি, অভিজ্ঞতা ও রেটিং টুকে রাখুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenTravelCard && (
              <button
                type="button"
                onClick={onOpenTravelCard}
                className="flex items-center gap-2 px-4 py-2.5 min-h-10 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold transition-transform active:scale-95 cursor-pointer"
              >
                <IdCard className="w-4 h-4" aria-hidden="true" />
                <span>ট্রাভেল কার্ড বানান</span>
              </button>
            )}
            <button
              type="button"
              onClick={startAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন স্মৃতি যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Memory Form Modal / Card */}
      {isAdding && (
        <form
          onSubmit={handleSaveLog}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeForm();
          }}
          aria-label={editingId !== null ? 'ভ্রমণ স্মৃতি সম্পাদনা' : 'নতুন ভ্রমণ স্মৃতি'}
          className="bg-white border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-5 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{editingId !== null ? 'ভ্রমণ স্মৃতি সম্পাদনা করুন' : 'নতুন ভ্রমণ স্মৃতি লিখুন'}</span>
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-stone-500 hover:text-stone-800 text-sm font-bold min-h-10 px-2"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            {/* District Selector */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">জেলা নির্বাচন করুন:</label>
              <select
                aria-label="জেলা"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800"
              >
                {Object.keys(DISTRICT_DETAILS).map((d) => (
                  <option key={d} value={d}>
                    {DISTRICT_DETAILS[d].bn} ({DISTRICT_DETAILS[d].dvBn})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Date */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">ভ্রমণের মাস ও বছর:</label>
              <input
                type="month"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800"
              />
            </div>

            {/* Companions */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">ভ্রমণ সঙ্গী:</label>
              <select
                value={companion}
                onChange={(e) => setCompanion(e.target.value as typeof companion)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800"
              >
                <option value="solo">একাকী (Solo)</option>
                <option value="friends">বন্ধুদের সাথে (Friends)</option>
                <option value="family">পরিবারের সাথে (Family)</option>
                <option value="couple">প্রিয়জন / পার্টনার (Couple)</option>
              </select>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-bold text-stone-700">
              অভিজ্ঞতার রেটিং (Rating):
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal)}
                  aria-label={`${starVal} স্টার`}
                  aria-pressed={starVal === rating}
                  className="p-1.5 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      starVal <= rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-stone-500 ml-2 font-bold">
                ({toBengaliNumber(rating)} / ৫ স্টার)
              </span>
            </div>
          </div>

          {/* Memory Text */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-bold text-stone-700">
              ভ্রমণ স্মৃতি ও বিশেষ অনুভূতি:
            </label>
            <textarea
              ref={notesRef}
              required
              rows={3}
              placeholder="কী কী দেখেছেন? প্রিয় খাবার বা মজার কোনো অভিজ্ঞতা..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs font-bold text-rose-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {editingId !== null && (
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors"
              >
                বাতিল করুন
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs"
            >
              {editingId !== null ? 'পরিবর্তন সেভ করুন' : 'ডায়েরিতে সেভ করুন'}
            </button>
          </div>
        </form>
      )}

      {/* Memory Logs List */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-3">
            <Smile className="w-12 h-12 text-stone-300 mx-auto" />
            <h2 className="font-bold text-base text-stone-700">
              এখনও কোনো ভ্রমণ স্মৃতি যুক্ত করা হয়নি
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              উপরের 'নতুন স্মৃতি যোগ করুন' বাটনে ক্লিক করে আপনার ভ্রমণের সুন্দর মুহূর্তগুলো লিখে রাখুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logs.map((log) => {
              const districtInfo = DISTRICT_DETAILS[log.districtId];
              return (
                <div
                  key={log.id}
                  className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-base">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{districtInfo?.bn || log.districtId}</span>
                          <span className="text-xs text-stone-400 font-normal">
                            ({districtInfo?.dvBn} বিভাগ)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>{log.date}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-stone-400" />
                            <span>{companionLabels[log.companions]}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center shrink-0">
                        <button
                          type="button"
                          onClick={(e) => startEdit(log, e.currentTarget)}
                          className="text-stone-500 hover:text-emerald-700 w-10 h-10 inline-flex items-center justify-center transition-colors"
                          title="সম্পাদনা করুন"
                          aria-label={`${districtInfo?.bn || log.districtId} স্মৃতি সম্পাদনা করুন`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(log.id)}
                          className="text-stone-500 hover:text-rose-600 w-10 h-10 inline-flex items-center justify-center transition-colors"
                          title="মুছুন"
                          aria-label={`${districtInfo?.bn || log.districtId} স্মৃতি মুছুন`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Star Display */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < log.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Memory Quote Text */}
                    <p className="text-xs sm:text-sm text-stone-700 bg-stone-50/80 p-3 rounded-xl border border-stone-100 leading-relaxed italic">
                      "{log.notes}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Clock, Coins, ExternalLink, MapPin, Navigation, Lightbulb, CalendarDays, Camera, ChevronDown } from 'lucide-react';
import { SafeImage } from './SafeImage';
import type { PlaceSpot } from '../types';

interface SpotCardProps {
  spot: PlaceSpot;
  districtBn: string;
  photo: { url: string; credit?: string; sourceUrl?: string } | null;
  fallbackPhotoUrl?: string;
}

// One tourist place: key facts first, long background tucked into an expandable section
export const SpotCard: React.FC<SpotCardProps> = ({ spot, districtBn, photo, fallbackPhotoUrl }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.n} ${districtBn} বাংলাদেশ`)}`;
  const paragraphs = spot.hx && spot.hx.length ? spot.hx : spot.h ? [spot.h] : [];
  const hasMore = paragraphs.length > 0 || (spot.facts?.length ?? 0) > 0 || (spot.todo?.length ?? 0) > 0 || (spot.near?.length ?? 0) > 0;

  return (
    <article className="border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-xs hover:border-emerald-300 transition-colors">
      <div className="flex flex-col md:flex-row">
        {photo && (
          <figure className="relative w-full md:w-52 h-44 md:h-auto md:min-h-48 shrink-0 bg-stone-900 m-0">
            <SafeImage
              src={photo.url}
              alt={`${spot.n}, ${districtBn}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              fallbackSrc={fallbackPhotoUrl}
            />
            {photo.credit && (
              <figcaption className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 text-[10px] text-white/85 bg-gradient-to-t from-black/75 to-transparent truncate">
                <Camera className="w-3 h-3 inline mr-1 -mt-0.5" aria-hidden="true" />
                {photo.credit}
              </figcaption>
            )}
          </figure>
        )}

        <div className="flex-1 min-w-0 p-4 space-y-3">
          <div>
            <h4 className="font-extrabold text-base text-stone-900 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-1" aria-hidden="true" />
              <span>{spot.n}</span>
            </h4>
            {spot.w && <span className="text-xs text-stone-400 font-medium block ml-5.5">{spot.w}</span>}
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">{spot.d || spot.h}</p>

          <ul className="flex flex-wrap gap-1.5 text-[11px]">
            {spot.best && (
              <li className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                <CalendarDays className="w-3 h-3" aria-hidden="true" />
                <span><span className="sr-only">ভালো সময়: </span>{spot.best}</span>
              </li>
            )}
            {spot.dur && (
              <li className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span><span className="sr-only">সময় লাগবে: </span>{spot.dur}</span>
              </li>
            )}
            {spot.cost && (
              <li className="inline-flex items-start gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                <Coins className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
                <span><span className="sr-only">আনুমানিক খরচ: </span>{spot.cost}</span>
              </li>
            )}
          </ul>

          {spot.how && (
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-800">কীভাবে যাবেন: </strong>
              {spot.how}
            </p>
          )}

          {spot.tips && spot.tips.length > 0 && (
            <div className="text-xs text-emerald-900 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
              <strong className="flex items-center gap-1 mb-1">
                <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" /> পরামর্শ
              </strong>
              <ul className="list-disc pl-4 space-y-0.5">
                {spot.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {hasMore && (
            <details className="group rounded-xl border border-stone-200 bg-stone-50">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-bold text-stone-800">
                আরও জানুন
                <ChevronDown className="w-4 h-4 text-stone-500 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div className="px-3 pb-3 space-y-3 text-sm text-stone-700 leading-relaxed">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {spot.facts && spot.facts.length > 0 && (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                    {spot.facts.map(([k, v], i) => (
                      <React.Fragment key={i}>
                        <dt className="font-bold text-stone-500">{k}</dt>
                        <dd className="text-stone-800">{v}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                )}
                {spot.todo && spot.todo.length > 0 && (
                  <div>
                    <strong className="text-xs text-stone-800">কী করবেন</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs">
                      {spot.todo.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {spot.near && spot.near.length > 0 && (
                  <div>
                    <strong className="text-xs text-stone-800">কাছাকাছি</strong>
                    <ul className="flex flex-wrap gap-1.5 mt-1">
                      {spot.near.map((t, i) => (
                        <li key={i} className="text-[11px] px-2 py-1 rounded-lg bg-white border border-stone-200">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-10 text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            গুগল ম্যাপে খুঁজুন
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
            <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
          </a>
        </div>
      </div>
    </article>
  );
};

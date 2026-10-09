import { useLang } from '../i18n/LangContext';
import React, { useState, useEffect } from 'react';
import {
  DISTRICT_COORDS
} from '../data/district-coords';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Droplets,
  RotateCw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface WeatherWidgetProps {
  districtId: string;
  districtNameBn: string;
}

interface CurrentWeather {
  temp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export function getWeatherCondition(code: number): {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  advice: string;
  color: string;
} {
  if (code === 0) {
    return {
      label: 'পরিষ্কার রোদঝলমলে আকাশ',
      icon: Sun,
      advice: 'ঘোরাঘুরির জন্য চমৎকার নির্মল দিন! সানগ্লাস সাথে রাখুন।',
      color: 'text-amber-500',
    };
  }
  if (code === 1 || code === 2) {
    return {
      label: 'আংশিক মেঘলা ও মনোরম',
      icon: CloudSun,
      advice: 'ভ্রমণ ও ছবি তোলার জন্য উপযুক্ত আরামদায়ক আবহাওয়া।',
      color: 'text-sky-500',
    };
  }
  if (code === 3) {
    return {
      label: 'মেঘলা আকাশ',
      icon: Cloud,
      advice: 'রোদ নেই, দর্শনীয় স্থানগুলো ঘুরে দেখার দারুণ সুযোগ।',
      color: 'text-slate-500',
    };
  }
  if (code === 45 || code === 48) {
    return {
      label: 'কুয়াশাচ্ছন্ন',
      icon: CloudFog,
      advice: 'সড়কে চলাচলের সময় সাবধানে চলুন, কুয়াশার কারণে দৃষ্টিসীমা কম হতে পারে।',
      color: 'text-stone-400',
    };
  }
  if (code >= 51 && code <= 57) {
    return {
      label: 'গুড়ি গুড়ি বৃষ্টি',
      icon: CloudDrizzle,
      advice: 'হালকা বৃষ্টির সম্ভাবনা আছে, সাথে ছোট ছাতা বা উইন্ডব্রেকার রাখুন।',
      color: 'text-cyan-500',
    };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: 'বৃষ্টিপাত',
      icon: CloudRain,
      advice: 'বৃষ্টি হচ্ছে বা সম্ভাবনা আছে। রেইনকোট বা ছাতা ব্যবহার করুন।',
      color: 'text-blue-500',
    };
  }
  if (code >= 95) {
    return {
      label: 'বজ্রবৃষ্টি ও ঝড়ো হাওয়া',
      icon: CloudLightning,
      advice: 'বজ্রপাতের সময় নিরাপদ আশ্রয়ে থাকুন, খোলা স্থানে বের হওয়া থেকে বিরত থাকুন।',
      color: 'text-indigo-600',
    };
  }
  return {
    label: 'স্বাভাবিক আবহাওয়া',
    icon: CloudSun,
    advice: 'ভ্রমণের জন্য সাধারণ আবহাওয়া বিরাজ করছে।',
    color: 'text-emerald-500',
  };
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  districtId,
  districtNameBn,
}) => {
  const { lang, tr, n } = useLang();
  const [attempt, setAttempt] = useState<number>(0);
  const [result, setResult] = useState<{
    key: string;
    current: CurrentWeather | null;
    forecast: DailyForecast[];
    error: string | null;
  } | null>(null);

  // Loading is derived: it is true until a result for the current district/attempt arrives
  const key = `${districtId}:${attempt}`;
  const loading = result?.key !== key;
  const current = result?.key === key ? result.current : null;
  const forecast = result?.key === key ? result.forecast : [];
  const error = result?.key === key ? result.error : null;
  const fetchWeather = () => setAttempt((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    const coords = DISTRICT_COORDS[districtId] || DISTRICT_COORDS['Dhaka'];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FDhaka&forecast_days=4`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('weather request failed');
        return res.json();
      })
      .then((data) => {
        const times: string[] = data.daily?.time || [];
        const codes: number[] = data.daily?.weather_code || [];
        const maxs: number[] = data.daily?.temperature_2m_max || [];
        const mins: number[] = data.daily?.temperature_2m_min || [];
        const daily: DailyForecast[] = times.map((date, i) => ({
          date,
          weatherCode: codes[i] ?? 0,
          tempMax: Math.round(maxs[i] ?? 0),
          tempMin: Math.round(mins[i] ?? 0),
        }));
        if (cancelled) return;
        setResult({
          key,
          forecast: daily,
          error: null,
          current: {
            temp: Math.round(data.current.temperature_2m),
            apparentTemp: Math.round(data.current.apparent_temperature),
            humidity: Math.round(data.current.relative_humidity_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
            time: data.current.time,
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setResult({ key, current: null, forecast: [], error: 'আবহাওয়ার তথ্য লোড করা সম্ভব হয়নি। সংযোগ পরীক্ষা করুন।' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [districtId, key]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-center gap-3 py-8 text-xs font-semibold text-emerald-800">
        <RotateCw className="w-5 h-5 animate-spin text-emerald-600" />
        <span>{lang === 'en' ? `Loading live weather for ${districtNameBn}...` : `${districtNameBn} জেলার লাইভ আবহাওয়ার তথ্য আনা হচ্ছে...`}</span>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{tr(error || 'আবহাওয়ার তথ্য পাওয়া যায়নি')}</span>
        </div>
        <button
          type="button"
          onClick={fetchWeather}
          className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg font-bold text-stone-800 cursor-pointer text-xs"
        >
          {tr('পুনরায় চেষ্টা করুন')}
        </button>
      </div>
    );
  }

  const cond = getWeatherCondition(current.weatherCode);
  const WeatherIcon = cond.icon;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white border border-emerald-700/40 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
      {/* Top Banner: District name & Refresh */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-extrabold text-sm sm:text-base text-white">
            {lang === 'en' ? `Current weather in ${districtNameBn}` : `${districtNameBn} জেলার বর্তমান আবহাওয়া`}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-emerald-200 uppercase tracking-wider">
            Live
          </span>
        </div>

        <button
          type="button"
          onClick={fetchWeather}
          title={tr('রিফ্রেশ করুন')}
          className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Temp & Condition Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/15 shadow-inner">
            <WeatherIcon className={`w-8 h-8 ${cond.color}`} />
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {n(current.temp)}°
              </span>
              <span className="text-sm font-bold text-emerald-200">{lang === 'en' ? '°C' : 'সে.'}</span>
              <span className="text-xs text-stone-300 ml-2 font-medium">
                ({lang === 'en' ? 'feels like' : 'অনুভূত'}: {n(current.apparentTemp)}°{lang === 'en' ? 'C' : 'সে.'})
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">
              {tr(cond.label)}
            </div>
          </div>
        </div>

        {/* Humidity & Wind stats */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-xs w-full sm:w-auto justify-around sm:justify-start">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Droplets className="w-4 h-4 text-cyan-300" />
            <div>
              <span className="block text-[10px] text-stone-300">{tr('আর্দ্রতা')}</span>
              <strong className="font-bold text-white">
                {n(current.humidity)}%
              </strong>
            </div>
          </div>

          <div className="h-6 w-px bg-white/15" />

          <div className="flex items-center gap-1.5 text-emerald-200">
            <Wind className="w-4 h-4 text-emerald-300" />
            <div>
              <span className="block text-[10px] text-stone-300">{tr('বাতাসের গতি')}</span>
              <strong className="font-bold text-white">
                {n(current.windSpeed)} {lang === 'en' ? 'km/h' : 'কিমি/ঘ.'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Advice Banner */}
      <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-emerald-100">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <span>
          <strong>{tr('ভ্রমণ পরামর্শ:')}</strong> {tr(cond.advice)}
        </span>
      </div>

      {/* 4-Day Mini Forecast */}
      {forecast.length > 0 && (
        <div className="pt-2">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-2">
            {tr('পরবর্তী দিনগুলোর পূর্বাভাস:')}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {forecast.map((day, idx) => {
              const dayCond = getWeatherCondition(day.weatherCode);
              const DayIcon = dayCond.icon;
              const dayName =
                idx === 0
                  ? tr('আজ')
                  : idx === 1
                  ? tr('আগামীকাল')
                  : new Date(day.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', { weekday: 'short' });

              return (
                <div
                  key={day.date}
                  className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl p-2.5 text-center space-y-1"
                >
                  <span className="block text-[11px] font-bold text-emerald-200">
                    {dayName}
                  </span>
                  <DayIcon className={`w-5 h-5 mx-auto ${dayCond.color}`} />
                  <div className="text-[11px] font-black text-white">
                    {n(day.tempMax)}° /{' '}
                    <span className="text-stone-400 font-semibold">
                      {n(day.tempMin)}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

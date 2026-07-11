'use client';

import { useEffect, useState } from 'react';

const WMO_LABELS = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe thunderstorm',
};

const WMO_ICONS = {
  0: '☀', 1: '🌤', 2: '⛅', 3: '☁',
  45: '🌫', 48: '🌫',
  51: '🌦', 53: '🌧', 55: '🌧',
  61: '🌦', 63: '🌧', 65: '🌧',
  71: '🌨', 73: '❄', 75: '❄', 77: '❄',
  80: '🌦', 81: '🌧', 82: '⛈',
  85: '🌨', 86: '🌨',
  95: '⛈', 96: '⛈', 99: '⛈',
};

export default function JarvisWeather() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude: lat, longitude: lon } = coords;
          const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}` +
            `&current_weather=true&temperature_unit=celsius&windspeed_unit=mph&forecast_days=1`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('fetch failed');
          const data = await res.json();
          const cw = data.current_weather;
          /* Derive city from IANA timezone e.g. "Europe/London" → "London" */
          const tz = data.timezone ?? '';
          const city = tz.includes('/') ? tz.split('/').pop().replace(/_/g, ' ') : tz;
          setWeather({
            temp: Math.round(cw.temperature),
            code: cw.weathercode,
            label: WMO_LABELS[cw.weathercode] ?? 'Unknown',
            icon: WMO_ICONS[cw.weathercode] ?? '🌡',
            city: city || null,
          });
          setStatus('ok');
        } catch {
          setStatus('error');
        }
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    );
  }, []);

  if (status === 'loading') {
    return (
      <div className="jarvis-weather-widget flex items-center px-3 py-1.5 rounded-lg border border-[#ffb700]/15 bg-[#1a0800]/40">
        <span className="text-[#ffb700]/40 text-[9px] uppercase tracking-widest">Weather…</span>
      </div>
    );
  }

  if (status === 'denied' || status === 'error') {
    return (
      <div className="jarvis-weather-widget group relative flex items-center px-3 py-1.5 rounded-lg border border-[#ffb700]/10 bg-[#1a0800]/30 cursor-help">
        <span className="text-[#ffb700]/30 text-[9px] uppercase tracking-widest">
          {status === 'denied' ? '—°' : 'Offline'}
        </span>
        <span className="absolute bottom-full mb-1.5 right-0 hidden group-hover:block text-[9px] text-[#ffb700]/70 bg-[#0a0600]/95 border border-[#ffb700]/15 rounded px-2 py-1 whitespace-nowrap">
          {status === 'denied' ? 'Enable location to show weather' : 'Weather unavailable'}
        </span>
      </div>
    );
  }

  return (
    <div className="jarvis-weather-widget flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#ffb700]/15 bg-[#1a0800]/40">
      <span className="text-sm leading-none" aria-hidden>{weather.icon}</span>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#fff8e1]/95 text-sm tabular-nums font-light">{weather.temp}°C</span>
          <span className="text-[9px] uppercase tracking-wider text-[#ffb700]/60">{weather.label}</span>
        </div>
        {weather.city && (
          <span className="text-[8px] text-[#ffb700]/38 tracking-wide mt-0.5">{weather.city}</span>
        )}
      </div>
    </div>
  );
}

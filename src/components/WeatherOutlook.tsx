'use client';

import { format } from 'date-fns';

interface WeatherData {
  days: WeatherDay[];
}

interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
}

interface WeatherOutlookProps {
  weatherData: WeatherData;
}

const weatherIcons: { [key: number]: string } = {
  0: '☀️',
  1: '🌤️',
  2: '⛅️',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

const windDirectionArrows: { [key: number]: string } = {
    0: '↑ N',
    45: '↗ NE',
    90: '→ E',
    135: '↘ SE',
    180: '↓ S',
    225: '↙ SW',
    270: '← W',
    315: '↖ NW',
};

function getWindArrow(degrees: number) {
    const normalized = (degrees + 22.5) % 360;
    const direction = Math.floor(normalized / 45) * 45;
    return windDirectionArrows[direction];
}

export default function WeatherOutlook({ weatherData }: WeatherOutlookProps) {
  if (!weatherData || !weatherData.days) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">3-Day Weather Outlook</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherData.days.map((day, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800">{format(new Date(day.date), 'EEEE')}</p>
              <p className="text-2xl">{weatherIcons[day.weatherCode] || '❓'}</p>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-800">High:</span> {day.tempMax.toFixed(1)}°F</p>
              <p><span className="font-medium text-gray-800">Low:</span> {day.tempMin.toFixed(1)}°F</p>
              <p><span className="font-medium text-gray-800">Wind:</span> {day.windSpeed.toFixed(1)} mph {getWindArrow(day.windDirection)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

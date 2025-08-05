import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ForecastListItem } from '@/types';
import WeatherOutlook from './WeatherOutlook';

interface ForecastListItemProps {
  forecast: ForecastListItem;
}

export default function ForecastListItem({ forecast }: ForecastListItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractEbirdCount = (ebirdSummary: string) => {
    if (!ebirdSummary) return null;
    const match = ebirdSummary.match(/reports (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const ebirdCount = extractEbirdCount(forecast.ebird_summary);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start cursor-pointer hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors" onClick={handleToggle}>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {forecast.species}
          </h3>
          <div className="flex items-center space-x-3">
            <p className="text-sm text-gray-600">ZIP: {forecast.zip}</p>
            {ebirdCount !== null && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm font-medium text-green-700">
                  {ebirdCount} sightings
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right flex items-center space-x-2">
          <div>
            <p className="text-xs text-gray-500">
              {formatDate(forecast.created_at)}
            </p>
          </div>
          <div className="text-gray-400">
            {expanded ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 prose prose-sm prose-gray max-w-none">
          {forecast.weather_data && <WeatherOutlook weatherData={forecast.weather_data} />}
          <ReactMarkdown 
            components={{
              h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 mb-3">{children}</h1>,
              h2: ({children}) => <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>,
              h3: ({children}) => <h3 className="text-base font-medium text-gray-900 mb-2">{children}</h3>,
              p: ({children}) => <p className="text-gray-700 mb-2 leading-relaxed">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside text-gray-700 mb-2 space-y-1">{children}</ol>,
              li: ({children}) => <li className="">{children}</li>,
              strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({children}) => <em className="italic">{children}</em>,
            }}
          >
            {forecast.forecast}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

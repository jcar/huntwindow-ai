import type { ForecastListItem } from '@/types';

interface ForecastListItemProps {
  forecast: ForecastListItem;
}

export default function ForecastListItem({ forecast }: ForecastListItemProps) {
  // Extract first few sentences as summary
  const getSummary = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {forecast.species}
          </h3>
          <p className="text-sm text-gray-600">ZIP: {forecast.zip}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {formatDate(forecast.created_at)}
          </p>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {getSummary(forecast.forecast)}
        </p>
      </div>
    </div>
  );
}

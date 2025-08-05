'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ForecastListItem from '@/components/ForecastListItem';
import type { ForecastListItem as ForecastType } from '@/types';

export default function ForecastsPage() {
  const [forecasts, setForecasts] = useState<ForecastType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const response = await fetch('/api/forecasts');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch forecasts');
        }
        
        setForecasts(data.forecasts || []);
      } catch (err) {
        console.error('Error fetching forecasts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load forecasts');
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Recent Forecasts</h1>
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Forecast
            </Link>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">Loading forecasts...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Recent Forecasts</h1>
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Forecast
            </Link>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recent Forecasts</h1>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Forecast
          </Link>
        </div>

        {forecasts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No forecasts found.</p>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Create your first forecast
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {forecasts.map((forecast) => (
              <ForecastListItem key={forecast.id} forecast={forecast} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ForecastListItem from '@/components/ForecastListItem';
import { useAuth } from '@/contexts/AuthContext';
import type { ForecastListItem as ForecastType } from '@/types';

export default function MyForecastsPage() {
  const [forecasts, setForecasts] = useState<ForecastType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchMyForecasts = async () => {
      if (!session?.access_token) return;

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        };

        const response = await fetch('/api/my-forecasts', { headers });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch forecasts');
        }
        
        setForecasts(data.forecasts || []);
      } catch (err) {
        console.error('Error fetching my forecasts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load forecasts');
      } finally {
        setLoading(false);
      }
    };

    if (user && session?.access_token) {
      fetchMyForecasts();
    }
  }, [user, session]);

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center py-8">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Forecasts</h1>
              <Link 
                href="/" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Forecast
              </Link>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Loading your forecasts...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Forecasts</h1>
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
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Forecasts</h1>
              <p className="text-gray-600 mt-1">
                Your personalized hunting forecasts ({forecasts.length} total)
              </p>
            </div>
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Forecast
            </Link>
          </div>

          {forecasts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🦆</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No forecasts yet</h2>
              <p className="text-gray-600 mb-6">Generate your first hunting forecast to get started!</p>
              <Link 
                href="/" 
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Forecast
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
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import HuntForm from '@/components/HuntForm';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { zipToLatLon } from '@/lib/geocode';
import ReactMarkdown from "react-markdown";

export default function HomePage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { user, session } = useAuth();

  const handleSubmit = async ({
    species,
    zip,
  }: {
    species: string;
    zip: string;
  }) => {
    // Prevent non-authenticated users from generating forecasts
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { lat, lon } = await zipToLatLon(zip);

      const query = new URLSearchParams({
        species,
        lat: lat.toString(),
        lon: lon.toString(),
        zip,
      }).toString();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/forecast?${query}`, { headers });
      const data = await res.json();
      setResult(data.forecast || 'No forecast returned.');
    } catch (err) {
      console.error(err);
      setResult('Something went wrong while fetching forecast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 text-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Generate Your Hunting Forecast</h1>
            <p className="text-lg text-gray-600">AI-powered forecasts combining weather data and bird sighting intelligence</p>
            {!user && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">🔒 Please sign in to create personalized hunting forecasts</p>
              </div>
            )}
          </div>
          <HuntForm onSubmit={handleSubmit} disabled={!user} />
          {loading && <p className="text-center mt-6">Loading forecast...</p>}
          {result && (
            <div className="bg-white shadow-lg p-6 mt-8 max-w-3xl mx-auto border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Hunting Forecast</h2>
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        mode="signup"
      />
    </>
  );
}
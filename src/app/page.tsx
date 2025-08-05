'use client';

import { useState } from 'react';
import HuntForm from '@/components/HuntForm';
import { zipToLatLon } from '@/lib/geocode';
import ReactMarkdown from "react-markdown";

export default function HomePage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({
    species,
    zip,
  }: {
    species: string;
    zip: string;
  }) => {
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

      const res = await fetch(`/api/forecast?${query}`);
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
    <main className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6">HuntWindow AI</h1>
      <HuntForm onSubmit={handleSubmit} />
      {loading && <p className="text-center mt-6">Loading forecast...</p>}
      {result && (
        <div className="bg-white shadow p-4 mt-6 max-w-2xl mx-auto whitespace-pre-wrap border border-gray-300 rounded text-gray-900">
          <h2 className="text-xl font-semibold mb-2">Forecast Result</h2>
          <p><ReactMarkdown>{result}</ReactMarkdown></p>
        </div>
      )}
    </main>
  );
}
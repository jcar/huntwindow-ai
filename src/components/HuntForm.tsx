'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (params: {
    species: string;
    zip: string;
  }) => void;
};

export default function HuntForm({ onSubmit }: Props) {
  const [species, setSpecies] = useState('dove');
  const [zip, setZip] = useState('76201');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ species, zip });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block mb-1 font-semibold text-gray-800">Species</label>
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full border border-gray-400 rounded p-2 text-gray-900"
        >
          <option value="dove">Dove</option>
          <option value="duck">Duck</option>
          <option value="whitetail deer">Whitetail Deer</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-800">ZIP Code</label>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="w-full border border-gray-400 rounded p-2 text-gray-900"
        />
      </div>

      <button
        type="submit"
        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full"
      >
        Get Hunting Forecast
      </button>
    </form>
  );
}
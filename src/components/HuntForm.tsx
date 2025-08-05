'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (params: {
    species: string;
    zip: string;
  }) => void;
  disabled?: boolean;
};

export default function HuntForm({ onSubmit, disabled }: Props) {
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
          disabled={disabled}
          className={`w-full border rounded p-2 text-gray-900 ${
            disabled 
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
              : 'border-gray-400 bg-white'
          }`}
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
          disabled={disabled}
          className={`w-full border rounded p-2 text-gray-900 ${
            disabled 
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
              : 'border-gray-400 bg-white'
          }`}
        />
      </div>

      <button
        type="submit"
        className={`font-bold py-2 px-4 rounded w-full transition-colors ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
            : 'bg-green-700 hover:bg-green-800 text-white'
        }`}
        disabled={disabled}
      >
        {disabled ? '🔒 Sign In Required' : 'Get Hunting Forecast'}
      </button>
    </form>
  );
}
import type { NextApiRequest, NextApiResponse } from "next";
import { getWeatherForecast } from "../../lib/weather";
import { getForecastFromAI } from "../../lib/openai";
import { getRecentSightingsBySpecies } from '@/lib/ebird';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon, species, zip } = req.query;
  const speciesStr = String(species).toLowerCase();

  if (!lat || !lon || !species || !zip) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const weather = await getWeatherForecast(Number(lat), Number(lon));

    let ebirdSummary = '';

    if (speciesStr === 'dove') {
      const sightings = await getRecentSightingsBySpecies({
        lat: Number(lat),
        lon: Number(lon),
        speciesCode: 'moudov', // mourning dove
      });

      ebirdSummary = `eBird reports ${sightings.length} mourning dove sightings in the last 7 days within 25km of ZIP ${zip}.`;
    }

    if (speciesStr=== 'duck') {
      const sightings = await getRecentSightingsBySpecies({
        lat: Number(lat),
        lon: Number(lon),
        speciesCode: 'mallar3', // mallard
      });

      ebirdSummary = `eBird reports ${sightings.length} mallard sightings in the last 7 days within 25km of ZIP ${zip}.`;
    }

    const forecast = await getForecastFromAI({
      species: String(speciesStr),
      zip: String(zip),
      weatherDays: weather.days,
      ebirdSummary
    });

    await supabase.from('forecasts').insert([
    {
      species: speciesStr,
      zip: String(zip),
      lat: Number(lat),
      lon: Number(lon),
      forecast,
      ebird_summary: ebirdSummary,
      weather_data: weather, // optional, comment this out if too large
    },
    ]);
   

    res.status(200).json({ forecast });
  } catch (err: any) {
    console.error("Forecast generation error:", err.message || err);
    res.status(500).json({ error: "Failed to generate hunting forecast" });
  }

}
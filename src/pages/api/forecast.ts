import type { NextApiRequest, NextApiResponse } from "next";
import { getWeatherForecast } from "../../lib/weather";
import { getForecastFromAI } from "../../lib/openai";
import { getRecentSightingsBySpecies } from '@/lib/ebird';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, supabaseAdmin } from '../../lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon, species, zip } = req.query;
  const speciesStr = String(species).toLowerCase();

  if (!lat || !lon || !species || !zip) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  // Get the authenticated user
  const user = await getUserFromRequest(req);
  
  if (!user) {
    console.log('Unauthorized forecast attempt');
    return res.status(401).json({ error: 'Authentication required to create forecasts' });
  }
  
  const userId = user.id;
  console.log('Authenticated user:', user.id, user.email);

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

    console.log('Inserting forecast with user_id:', userId);
    
    const insertData = {
      user_id: userId,
      species: speciesStr,
      zip: String(zip),
      lat: Number(lat),
      lon: Number(lon),
      forecast,
      ebird_summary: ebirdSummary,
      weather_data: weather, // optional, comment this out if too large
    };
    
    console.log('Insert data:', JSON.stringify(insertData, null, 2));
    
    // Create a Supabase client with the user's session token if available
    let supabaseClient = supabaseAdmin;
    
    if (user) {
      // Get the token from the request headers
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // Create a client with the user's token for RLS compliance
        supabaseClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        );
      }
    }
    
    const { data, error } = await supabaseClient.from('forecasts').insert([insertData]);
    
    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`Failed to save forecast: ${error.message}`);
    }
    
    console.log('Forecast inserted successfully:', data);
   

    res.status(200).json({ forecast });
  } catch (err: any) {
    console.error("Forecast generation error:", err.message || err);
    res.status(500).json({ error: "Failed to generate hunting forecast" });
  }

}
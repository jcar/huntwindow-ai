import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '../../lib/supabaseClient';
import type { Forecast } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: forecasts, error } = await supabase
      .from('forecasts')
      .select('id, user_id, species, zip, forecast, ebird_summary, created_at, weather_data')
      .order('created_at', { ascending: false })
      .limit(50); // Get the 50 most recent forecasts

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch forecasts' });
    }

    res.status(200).json({ forecasts: forecasts || [] });
  } catch (err: any) {
    console.error('Error fetching forecasts:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch forecasts' });
  }
}

// src/pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getWeatherForecast } from "../../lib/weather";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon } = req.query;

  console.log("Incoming request:", { lat, lon });

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  try {
    const forecast = await getWeatherForecast(Number(lat), Number(lon));
    res.status(200).json(forecast);
  } catch (err: any) {
    console.error("Weather API error:", err.message || err);
    res.status(500).json({ error: "Weather API error" });
  }
}
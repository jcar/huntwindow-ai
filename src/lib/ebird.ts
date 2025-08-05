// lib/ebird.ts
import axios from "axios";

export async function getRecentSightingsBySpecies({
  lat,
  lon,
  speciesCode,
  radius = 25,
  daysBack = 7,
}: {
  lat: number;
  lon: number;
  speciesCode: string;
  radius?: number;
  daysBack?: number;
}) {
  try {
    const res = await axios.get(
      `https://api.ebird.org/v2/data/obs/geo/recent/${speciesCode}`,
      {
        params: { lat, lng: lon, dist: radius, back: daysBack },
        headers: { "X-eBirdApiToken": process.env.EBIRD_API_KEY! },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("eBird API error:", err.response?.data || err.message);
    throw new Error("Failed to fetch eBird data");
  }
}
// src/lib/geocode.ts
import axios from "axios";

export async function zipToLatLon(zip: string): Promise<{ lat: number; lon: number }> {
  const res = await axios.get(
    `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=USA&format=json&limit=1`
  );

  if (!res.data || res.data.length === 0) {
    throw new Error(`Could not find coordinates for ZIP: ${zip}`);
  }

  const result = res.data[0];
  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
  };
}
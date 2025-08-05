// src/lib/weather.ts
import axios from "axios";
import { getMoonPhase, getMoonPhaseName } from "./moon"; // Assuming moon.ts is in the same directory

export async function getWeatherForecast(lat: number, lon: number) {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant,weathercode,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=3&temperature_unit=fahrenheit`;

  try {
    const response = await axios.get(forecastUrl);
    const daily = response.data.daily;
    console.log(daily);

    return {
      days: daily.time.map((date: string, i: number) => ({
        date,
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        windSpeed: daily.windspeed_10m_max[i],
        windDirection: daily.winddirection_10m_dominant[i],
        uvIndex: daily.uv_index_max[i],
        sunrise: daily.sunrise[i],
        sunset: daily.sunset[i],
        moonPhase: getMoonPhase(new Date(date)),
        moonPhaseName: getMoonPhaseName(getMoonPhase(new Date(date))),
        weatherCode: daily.weathercode[i],
      })),
    };
  } catch (err: any) {
    console.error("Weather API fetch failed:", err.response?.data || err.message);
    throw new Error("Weather API error");
  }
}
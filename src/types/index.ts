export interface Forecast {
  id: string;
  user_id: string | null;
  species: string;
  zip: string;
  lat: number;
  lon: number;
  forecast: string;
  ebird_summary: string;
  weather_data?: any;
  created_at: string;
}

export interface ForecastListItem {
  id: string;
  user_id: string | null;
  species: string;
  zip: string;
  created_at: string;
  forecast: string;
  ebird_summary: string;
}

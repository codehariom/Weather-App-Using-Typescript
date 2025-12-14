export interface ApiConfigType {
  BASE_URL: string
  GEO_URL: string
  API_KEY: string
  DEFAULT_PARAMS: {
    units: "metric" | "imperial"
    appid: string
  }
}

export const ApiConfig = {
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEO_URL: "https://api.openweathermap.org/geo/1.0",
  API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  DEFAULT_PARAMS: {
    units: "metric",
  },
}

if (!ApiConfig.API_KEY) {
  throw new Error("❌ OpenWeather API key is missing. Check .env file.");
}


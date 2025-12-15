import { ApiConfig } from "./apiConfig"
import type {
  Coordinates,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from "./types"

class WeatherAPI {
  // ============================
  // Build URL with query params
  // ============================
  private createURL(
    endpoint: string,
    params: Record<string, string | number>
  ): string {
    const searchParams = new URLSearchParams({
      appid: ApiConfig.API_KEY,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ),
    })

    return `${endpoint}?${searchParams.toString()}`
  }

  // ============================
  // Generic fetch handler
  // ============================
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  // ============================
  // Current Weather
  // ============================
  async getCurrentWeather(
    { lat, lon }: Coordinates
  ): Promise<WeatherData> {
    const url = this.createURL(`${ApiConfig.BASE_URL}/weather`, {
      lat,
      lon,
      units: ApiConfig.DEFAULT_PARAMS.units,
    })

    return this.fetchData<WeatherData>(url)
  }

  // ============================
  // 5 Day / 3 Hour Forecast
  // ============================
  async getForecast(
    { lat, lon }: Coordinates
  ): Promise<ForecastData> {
    const url = this.createURL(`${ApiConfig.BASE_URL}/forecast`, {
      lat,
      lon,
      units: ApiConfig.DEFAULT_PARAMS.units,
    })

    return this.fetchData<ForecastData>(url)
  }

  // Reverse Geocoding

  async geocodingRes(
    { lat, lon }: Coordinates
  ): Promise<GeocodingResponse> {
    const url = this.createURL(`${ApiConfig.GEO_URL}/reverse`, {
      lat,
      lon,
      limit: 1,
    })

    return this.fetchData<GeocodingResponse>(url)
  }
  // search Location 
    async searchLocation(
    query:string
  ): Promise<GeocodingResponse> {
    const url = this.createURL(`${ApiConfig.GEO_URL}/direct`, {
      q:query,   
      limit: 5,
    })

    return this.fetchData<GeocodingResponse>(url)
  }
}

export const weatherAPI = new WeatherAPI()
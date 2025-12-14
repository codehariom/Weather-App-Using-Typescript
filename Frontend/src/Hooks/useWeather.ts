import type { Coordinates, ForecastData, GeocodingItem, GeocodingResponse, WeatherData } from "@/Api/types";
import { weatherAPI } from "@/Api/weather";
import { useQuery } from "@tanstack/react-query";

export const weatherKeys={
    weather : (coords:Coordinates)=>["weather",coords] as const,
    forecast : (coords:Coordinates)=>["forecast",coords] as const,
    location : (coords:Coordinates)=>["location",coords] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery<WeatherData>({
    queryKey: weatherKeys.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.getCurrentWeather(coordinates!),
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery<ForecastData>({
    queryKey: weatherKeys.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.getForecast(coordinates!),
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery<GeocodingResponse, Error, GeocodingItem | undefined>({
    queryKey: weatherKeys.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.geocodingRes(coordinates!),
    enabled: !!coordinates,
    select: (data) => data[0],
  });
}
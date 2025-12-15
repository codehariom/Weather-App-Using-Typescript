import type { ForecastData } from "@/Api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowBigDown, ArrowBigUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const dateKey = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: forecast.dt,
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
      };
    } else {
      acc[dateKey].temp_min = Math.min(
        acc[dateKey].temp_min,
        forecast.main.temp_min
      );
      acc[dateKey].temp_max = Math.max(
        acc[dateKey].temp_max,
        forecast.main.temp_max
      );
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecast).slice(0, 5);
  const formatTemp = (t: number) => `${Math.round(t)}°`;

  return (
    <Card className="backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-wide">
          5-Day Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl p-4 border "
            >
              {/* LEFT: Date + Weather */}
              <div className="flex items-center gap-4 w-full sm:w-1/3">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                  alt={day.weather.description}
                  className="h-12 w-12"
                />
                <div>
                  <p className="font-medium">
                    {format(new Date(day.date * 1000), "EEE, MMM d")}
                  </p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {day.weather.description}
                  </p>
                </div>
              </div>

              {/* CENTER: Temp */}
              <div className="flex items-center gap-6 text-lg font-medium">
                <span className="flex items-center gap-1 text-blue-500">
                  <ArrowBigDown className="h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <ArrowBigUp className="h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              {/* RIGHT: Stats */}
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                  <Droplets className="h-4 w-4 text-sky-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </div>

                <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                  <Wind className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">{day.wind} m/s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
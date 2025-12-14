import type { WeatherData, GeocodingItem } from "../../Api/types"
import { Card, CardContent } from "../ui/card"
import {
  ArrowBigDown,
  ArrowBigUp,
  Droplets,
  Wind,
} from "lucide-react"

interface CurrentWeatherProps {
  data: WeatherData
  locationName?: GeocodingItem
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data

  const formatTemp = (t: number) => `${Math.round(t)}°`

  return (
    <Card className="overflow-hidden backdrop-blur-xl shadow-xl">
      <CardContent className="p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 items-center">

{/* LEFT */}
          <div className="space-y-6">
            {/* Location */}
            <div>
              <h2 className="text-3xl font-bold tracking-wide">
                {locationName?.name}
                {locationName?.state && (
                  <span className="ml-2 text-lg font-medium text-muted-foreground">
                    {locationName.state}
                  </span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {locationName?.country}
              </p>
            </div>

            {/* Temperature */}
            <div className="flex items-center gap-4">
              <p className="text-7xl font-bold leading-none">
                {formatTemp(temp)}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>

                <div className="flex gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowBigDown className="h-4 w-4" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-rose-500">
                    <ArrowBigUp className="h-4 w-4" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
                <Droplets className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">
                    {humidity}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
                <Wind className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Wind</p>
                  <p className="text-sm text-muted-foreground">
                    {speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/*  RIGHT  */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative aspect-square w-48 md:w-56">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain drop-shadow-xl"
              />
              <p className="absolute bottom-2 w-full text-center text-sm font-medium capitalize text-muted-foreground">
                {currentWeather.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentWeather
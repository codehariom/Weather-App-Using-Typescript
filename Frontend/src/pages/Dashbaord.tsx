import CurrentWeather from "@/components/common/CurrentWeather";
import HourrlyTemp from "@/components/common/HourrlyTemp";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import WeatherDetails from "@/components/common/WeatherDetails";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useGeoLocation from "@/Hooks/useGeoLocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/Hooks/useWeather";
import { MapPinAreaIcon, ArrowsClockwiseIcon } from "@phosphor-icons/react";

function Dashboard() {
  /* ================= GEO LOCATION ================= */
  const { coordinates, isLoading, error, getLocation } = useGeoLocation();

  /* ================= API QUERIES ================= */
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const isFetching =
    weatherQuery.isFetching ||
    forecastQuery.isFetching ||
    locationQuery.isFetching;

const locationName = locationQuery.data;

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  /* ================= LOCATION ERROR ================= */
  if (error || !coordinates) {
    return (
      <Alert variant="destructive" className="space-y-4 text-white">
        <AlertTitle>
          {error ? "Location Error" : "Location Required"}
        </AlertTitle>

        <AlertDescription className="space-y-2">
          <p>
            {error ??
              "Please enable location access to see your local weather."}
          </p>

          <Button
            onClick={getLocation}
            variant="outline"
            className="border-rose-700 text-white"
          >
            <MapPinAreaIcon size={20} weight="bold" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  /* ================= API ERROR ================= */
  if (weatherQuery.isError || forecastQuery.isError) {
    return (
      <Alert variant="destructive" className="space-y-4 text-white">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Failed to fetch weather data.</p>
          <Button onClick={getLocation} variant="outline">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  /* ================= DATA LOADING ================= */
  if (!weatherQuery.data || !forecastQuery.data) {
    return <LoadingSkeleton />;
  }

  /* ================= UI ================= */
return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold tracking-wide">
        My Location
      </h1>

      <Button
        variant="outline"
        size="icon"
        onClick={getLocation}
        disabled={isFetching}
      >
        <ArrowsClockwiseIcon
          size={20}
          className={isFetching ? "animate-spin" : ""}
        />
      </Button>
    </div>

    {/* Weather Content */}
    <div className="grid gap-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <CurrentWeather
          data={weatherQuery.data}
          locationName={locationName}
        />
        <HourrlyTemp data={forecastQuery.data} /> 
      </div>

      {/* Future sections */}
      {/* <WeatherDetails /> */}
      <WeatherDetails data={weatherQuery.data}/>
      {/* <WeeklyForecast /> */}
    </div>
  </div>
);
}

export default Dashboard;
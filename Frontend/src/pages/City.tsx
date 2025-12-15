import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import WeatherDetails from "@/components/common/WeatherDetails";
import WeatherForecast from "@/components/common/WeatherForecast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useWeatherQuery } from "@/Hooks/useWeather";
import { useParams, useSearchParams } from "react-router-dom"
import  HourrlyTemp  from '@/components/common/HourrlyTemp';
import CurrentWeather from "@/components/common/CurrentWeather";
import FavButton from "@/components/common/FavButton";



function City() {
  const[searchParams] = useSearchParams()
  const params = useParams();
  const lat =parseFloat(searchParams.get("lat") || "0")
  const lon =parseFloat(searchParams.get("lon") || "0")
  const coordinates = {lat,lon};
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

    if (weatherQuery.isError || forecastQuery.isError) {
    return (
      <Alert variant="destructive" className="space-y-4 text-white">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Failed to fetch weather data.</p>
        </AlertDescription>
      </Alert>
    );
  }

    /* ================= DATA LOADING ================= */
  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <LoadingSkeleton />;
  }

  return (
   <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold tracking-wider">
        {params.cityName},{weatherQuery.data.sys.country}
      </h1>
      {/* <div>Favorite Button </div> */}
      <div>
        <FavButton data={{...weatherQuery.data,name:params.cityName}}/>
      </div>  
    </div>

    {/* Weather Content */}
    <div className="grid gap-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <CurrentWeather
          data={weatherQuery.data}
        />
        <HourrlyTemp data={forecastQuery.data} /> 
      </div>

      {/* Future sections */}
      {/* <WeatherDetails /> */}
      <WeatherDetails data={weatherQuery.data}/>
      {/* <WeeklyForecast /> */}
      <WeatherForecast data={forecastQuery.data}/>
    </div>
  </div>
  )
}

export default City
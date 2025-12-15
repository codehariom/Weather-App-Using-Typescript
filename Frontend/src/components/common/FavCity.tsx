import { useFavLocation } from "@/Hooks/useFavorite";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/Hooks/useWeather";
import { Button } from "../ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FavCityTabletProps {
  name: string;
  lat: number;
  lon: number;
  onRemove: () => void;
}

const FavCity = () => {
  const { favorites, removeFav } = useFavLocation();

  if (!favorites.length) return null;

  return (
    <>
      <h1 className="text-xl font-bold tracking-wide">Favorites</h1>

      <ScrollArea className="pb-4 ">
  <div className="flex  gap-4">
    {favorites.map((city) => (
      <FavCityTablet
        key={city.id}
        name={city.name}
        lat={city.lat}
        lon={city.lon}
        onRemove={() => {
          removeFav.mutate(city.id);
          toast.error(`Removed ${city.name} from favorites`);
        }}
      />
    ))}
  </div>
</ScrollArea>
    </>
  );
};

function FavCityTablet({ name, lat, lon, onRemove }: FavCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      tabIndex={0}
      className="relative min-w-55 cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
    >
      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-2 top-2 h-6 w-6 p-0 hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : weather ? (
        <div className="flex items-center gap-4">
          {/* Icon */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="h-14 w-14"
          />

          {/* Info */}
          <div className="flex flex-col">
            <p className="font-semibold leading-none">{name}</p>
            <p className="text-xs text-muted-foreground">
              {weather.sys.country}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-xl font-bold">
                {Math.round(weather.main.temp)}°
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {weather.weather[0].description}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FavCity;

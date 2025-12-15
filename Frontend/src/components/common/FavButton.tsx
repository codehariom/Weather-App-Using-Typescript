import type { WeatherData } from "@/Api/types";
import { useFavLocation } from "@/Hooks/useFavorite";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavButtonProps {
  data: WeatherData;
}

const FavButton = ({ data }: FavButtonProps) => {
  const { addToFav, isFav, removeFav } = useFavLocation();

  const isCurrentlyFav = isFav(data.coord.lat, data.coord.lon);

  const handleToggleFav = () => {
    if (isCurrentlyFav) {
      removeFav.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from favorites`);
    } else {
      addToFav.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to favorites`);
    }
  };

  return (
    <Button
      size="icon"
      onClick={handleToggleFav}
      variant={isCurrentlyFav ? "default" : "outline"}
      className={`h-10 w-10 transition ${
        isCurrentlyFav
          ? "bg-amber-500 hover:bg-amber-600"
          : "hover:bg-amber-100"
      }`}
    >
      <Star
        className={`h-6 w-6 transition ${
          isCurrentlyFav ? "fill-current text-white" : ""
        }`}
      />
    </Button>
  );
};

export default FavButton;
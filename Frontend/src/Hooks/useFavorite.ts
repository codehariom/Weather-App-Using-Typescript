import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalHistory";

export interface FavCityItem {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  addedAt: number;
}

const QUERY_KEY = ["fav"];

export function useFavLocation() {
  const queryClient = useQueryClient();

  const [fav, setFav] = useLocalStorage<FavCityItem[]>("fav", []);

  /* ================= QUERY ================= */
  const favQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => fav,
    initialData: fav,
    enabled: false,
    staleTime: Infinity,
  });

  /* ================= ADD ================= */
  const addToFav = useMutation({
    mutationFn: async (
      city: Omit<FavCityItem, "id" | "addedAt">
    ) => {
      const exists = fav.some(
        (item) => item.lat === city.lat && item.lon === city.lon
      );

      if (exists) return fav;

      const newFav: FavCityItem = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      const newFavorites = [...fav, newFav].slice(0, 10);
      setFav(newFavorites);

      return newFavorites;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });

  /* ================= REMOVE ================= */
  const removeFav = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = fav.filter((city) => city.id !== cityId);
      setFav(newFavorites);
      return newFavorites;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });

  /* ================= CHECK ================= */
  const isFav = (lat: number, lon: number) =>
    fav.some((city) => city.lat === lat && city.lon === lon);

  return {
    favorites: favQuery.data ?? [],
    addToFav,
    removeFav,
    isFav,
  };
}
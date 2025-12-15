import { useState } from "react";
import { Button } from "../ui/button";
import {
  Clock,
  Loader,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { useNavigate } from "react-router-dom";
import { useLocationSerach } from "@/Hooks/useWeather";
import { useSearchHistory } from "@/Hooks/useSearchHistory";
import { format } from "date-fns";
import { useFavLocation } from "@/Hooks/useFavorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: locations, isLoading } = useLocationSerach(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favorites } = useFavLocation();
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    const [lat, lon, name, country] = value.split("|");

    addToHistory.mutate({
      query,
      name,
      lat: Number(lat),
      lon: Number(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-muted-foreground mr-2  md:w-40 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a city name..."
          value={query}
          onValueChange={setQuery}
        />
        <Command>
        <CommandList>
          {/* EMPTY STATE */}
          {query.length > 2 && !isLoading && locations?.length === 0 && (
            <CommandEmpty>No city found</CommandEmpty>
          )}
          {/* FAVORITES */}
          {favorites.length > 0 && (
            <>
              <CommandGroup heading="Favorites">
                {favorites.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="mr-2 h-4 w-4 fill-amber-500 text-yellow-500" />
                    <span>{item.name}</span>
                    {item.state && (
                      <span className="ml-1 text-sm text-muted-foreground">
                        , {item.state}
                      </span>
                    )}
                    <span className="ml-1 text-sm text-muted-foreground">
                      , {item.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* RECENT SEARCHES */}
          {history.length > 0 && (
            <>
              <CommandGroup>
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-medium">Recent Searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Clear
                  </Button>
                </div>

                {history.map((item) => (
                  <CommandItem
                    key={`${item.lat}-${item.lon}`}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                    {item.state && (
                      <span className="ml-1 text-sm text-muted-foreground">
                        , {item.state}
                      </span>
                    )}
                    <span className="ml-1 text-sm text-muted-foreground">
                      , {item.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(item.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* SUGGESTIONS */}
          {query.length > 2 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader className="h-4 w-4 animate-spin" />
                </div>
              )}

              {locations?.map((loc) => (
                <CommandItem
                  key={`${loc.lat}-${loc.lon}`}
                  value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{loc.name}</span>
                  {loc.state && (
                    <span className="ml-1 text-sm text-muted-foreground">
                      , {loc.state}
                    </span>
                  )}
                  <span className="ml-1 text-sm text-muted-foreground">
                    , {loc.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
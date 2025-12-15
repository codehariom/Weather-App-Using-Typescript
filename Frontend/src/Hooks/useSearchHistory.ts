import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalHistory";

export interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

const QUERY_KEY = ["search-history"];

export function useSearchHistory() {
  const queryClient = useQueryClient();

  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    "search-history",
    []
  );

  /* ================= QUERY ================= */
  const historyQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => history,
    initialData: history,
    enabled: false, // 🔑 prevent unnecessary query execution
  });

  /* ================= ADD ================= */
  const addToHistory = useMutation({
    mutationFn: async (
      search: Omit<SearchHistoryItem, "id" | "searchedAt">
    ) => {
      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };

      const newHistory = [
        newSearch,
        ...history.filter(
          (item) => item.lat !== search.lat || item.lon !== search.lon
        ),
      ].slice(0, 10);

      setHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      queryClient.setQueryData(QUERY_KEY, newHistory);
    },
  });

  /* ================= CLEAR ================= */
  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY, []);
    },
  });

  return {
    history: historyQuery.data ?? [],
    addToHistory,
    clearHistory,
  };
}
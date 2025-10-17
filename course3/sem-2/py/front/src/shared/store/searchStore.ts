import { create } from "zustand";

export type SearchState = {
  query: string | null
  setQuery: (qury: string) => void
}
export const useSearchStore = create<SearchState>((set) => ({
  query: null,
  setQuery: (newQuery) => set(() => ({
    query: newQuery,
  })),
}))
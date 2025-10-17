import { create } from "zustand";

export type UserState = {
  user: {jwt: string} | null;
  setUser: (jwt: string) => void
}
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (jwt) => set(() => ({
    user: {jwt},
  })),
}))
import { create } from "zustand";
import { Flag } from "@/shared/types/model/flag";
import { mockFlags } from "@/mocks/flag";

export type FlagState = {
  flags: Flag[];
  setFlags: (newFlags: Flag[]) => void;
}
export const useFlagStore = create<FlagState>((set) => ({
  flags: mockFlags,
  setFlags: (newFlags) => set(() => ({ flags: newFlags }))
}))
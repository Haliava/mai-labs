import { create } from "zustand";

import { User } from "../types/model/user";
import { mockAccessControls } from "@/mocks/access_controls";
import { AccessControls } from "../types/model/permission";

export type UserState = {
  user: User | null,
  userPermissions: AccessControls[],
  setUser: (user: User  | null) => void,
  setUserPermissions: (permissions: AccessControls[]) => void,
}
export const useUserStore = create<UserState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  userPermissions: mockAccessControls,
  setUser: (user) => set(() => ({
    user,
  })),
  setUserPermissions: (permissions) => set(() => ({
    userPermissions: permissions,
  }))
}))
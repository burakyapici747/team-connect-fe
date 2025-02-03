import { create } from "zustand";
import { CurrentUser } from "@/features/users/model/user";

interface UserStore {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: CurrentUser | null) => set({ user }),
  clearUser: () => set({ user: null }),
}));
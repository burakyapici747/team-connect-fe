import { create } from "zustand";
import { UserPrivateOutput } from "@/core/types/user";
import { UserProfilePrivateOutput } from "@/core/types/user-profile";

interface UserStore {
  user: UserPrivateOutput | null;
  userProfile: UserProfilePrivateOutput | null;
  setUser: (user: UserPrivateOutput | null) => void;
  setUserProfile: (profile: UserProfilePrivateOutput | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userProfile: null,
  setUser: (user) => set({ user }),
  setUserProfile: (profile: UserProfilePrivateOutput | null) =>
    set({ userProfile: profile }),
  clearUser: () => set({ user: null, userProfile: null }),
}));

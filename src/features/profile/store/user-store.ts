import { create } from "zustand";
import { UserProfilePrivateOutput } from "@/core/types/user-profile";
import {CurrentUser} from "@/features/users/model/user";

interface UserStore {
  user: CurrentUser | null;
  userProfile: UserProfilePrivateOutput | null;
  setUser: (user: CurrentUser | []) => void;
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

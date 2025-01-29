import { api } from "@/services/api";
import { UserPrivateOutput } from "@/core/types/user";
import { UserProfilePrivateOutput } from "@/core/types/user-profile";

export const userAPI = {
  getCurrentUser: async (): Promise<UserPrivateOutput> => {
    const { data } = await api.get<UserPrivateOutput>("/users/me");
    return data;
  },

  getCurrentUserProfile: async (): Promise<UserProfilePrivateOutput> => {
    const { data } = await api.get<UserProfilePrivateOutput>(
      "/users/me/profile"
    );
    return data;
  },

  updateProfile: async (
    data: Partial<UserProfilePrivateOutput>
  ): Promise<UserProfilePrivateOutput> => {
    const response = await api.patch<UserProfilePrivateOutput>(
      "/users/me/profile",
      data
    );
    return response.data;
  },

  updateUser: async (
    data: Partial<UserPrivateOutput>
  ): Promise<UserPrivateOutput> => {
    const response = await api.patch<UserPrivateOutput>("/users/me", data);
    return response.data;
  },
};

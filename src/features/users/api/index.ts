import { index } from "@/shared/api/genericAPI";
import { UserPrivateOutput } from "@/core/types/user";
import { UserProfilePrivateOutput } from "@/core/types/user-profile";

export const userAPI = {
  getCurrentUser: async (): Promise<UserPrivateOutput> => {
    const { data } = await index.get<UserPrivateOutput>("/users/me");
    return data;
  },

  getCurrentUserProfile: async (): Promise<UserProfilePrivateOutput> => {
    const { data } = await index.get<UserProfilePrivateOutput>(
      "/users/me/profile"
    );
    return data;
  },

  updateProfile: async (
    data: Partial<UserProfilePrivateOutput>
  ): Promise<UserProfilePrivateOutput> => {
    const response = await index.patch<UserProfilePrivateOutput>(
      "/users/me/profile",
      data
    );
    return response.data;
  },

  updateUser: async (
    data: Partial<UserPrivateOutput>
  ): Promise<UserPrivateOutput> => {
    const response = await index.patch<UserPrivateOutput>("/users/me", data);
    return response.data;
  },
};

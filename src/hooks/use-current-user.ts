import { useQuery } from "@tanstack/react-query";
import { userAPI } from "@/services/api/user";
import { useUserStore } from "@/store/features/user-store";
import { UserPrivateOutput } from "@/types/user";
import { UserProfilePrivateOutput } from "@/types/user-profile";
import React from "react";

export const useCurrentUser = () => {
  const { setUser, setUserProfile } = useUserStore();

  const userQuery = useQuery<UserPrivateOutput>({
    queryKey: ["currentUser"],
    queryFn: userAPI.getCurrentUser,
    enabled: false,
    retry: false,
  });

  const profileQuery = useQuery<UserProfilePrivateOutput>({
    queryKey: ["currentUserProfile"],
    queryFn: userAPI.getCurrentUserProfile,
    enabled: false,
    retry: false,
  });

  React.useEffect(() => {
    if (userQuery.data) {
      console.log("Setting user data:", userQuery.data);
      setUser(userQuery.data);
    }
  }, [userQuery.data, setUser]);

  React.useEffect(() => {
    if (profileQuery.data) {
      console.log("Setting profile data:", profileQuery.data);
      setUserProfile(profileQuery.data);
    }
  }, [profileQuery.data, setUserProfile]);

  const fetchUserData = async () => {
    console.log("Fetching user data...");
    try {
      const [userData, profileData] = await Promise.all([
        userQuery.refetch(),
        profileQuery.refetch(),
      ]);

      if (userData.data) {
        console.log("Fetched user data:", userData.data);
        setUser(userData.data);
      }
      if (profileData.data) {
        console.log("Fetched profile data:", profileData.data);
        setUserProfile(profileData.data);
      }
      return { userData, profileData };
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  return {
    user: userQuery.data,
    userProfile: profileQuery.data,
    isLoading: userQuery.isLoading || profileQuery.isLoading,
    fetchUserData,
  };
};

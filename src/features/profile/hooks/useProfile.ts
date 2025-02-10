import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/api/response/response";
import { UserProfilePrivateOutput } from "@/features/profile/api/output/UserProfilePrivateOutput";
import { getCurrentUserProfile } from "@/features/profile/api";

export const useProfile = () => {
    const currentUserProfileQuery = useQuery<ApiResponse<UserProfilePrivateOutput>, Error, UserProfilePrivateOutput>({
        queryKey: ['currentUserProfile'],
        queryFn: getCurrentUserProfile,
        select: (response) => {
            if(response.isSuccess){
                return response.data;
            }else{
                throw new Error(response.message);
            }
        },
        retry: false,
        staleTime: Infinity
    });

    return {
        currentUserProfile: currentUserProfileQuery.data,
        isLoading: currentUserProfileQuery.isLoading,
        error: currentUserProfileQuery.error
    };
};
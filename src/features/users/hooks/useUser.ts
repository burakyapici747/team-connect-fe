import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/users/api";
import {CurrentUser} from "@/features/users/model/user";
import {ApiResponse} from "@/shared/api/response/response";

export const useUser = () => {
    const currentUserQuery = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () : Promise<CurrentUser> => {
            const response: ApiResponse<CurrentUser> = await getCurrentUser();
            return response.data.data;
        },
        retry: false,
        staleTime: Infinity
    });

    return {
        user: currentUserQuery.data,
        isLoading: currentUserQuery.isLoading,
        error: currentUserQuery.error
    }
};
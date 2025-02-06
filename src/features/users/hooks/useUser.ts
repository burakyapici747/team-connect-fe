import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/users/api";

export const useUser = () => {
    const currentUserQuery = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: Infinity
    });

    return {
        user: currentUserQuery.data,
        isLoading: currentUserQuery.isLoading,
        error: currentUserQuery.error
    }
};
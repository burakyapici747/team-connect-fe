import { useQuery } from "@tanstack/react-query";
import { getFriendships, getOutgoingFriendRequests, getIncomingFriendRequests } from "@/features/friends/api";
import { FriendshipOutput } from "@/features/friends/api/output/FriendshipOutput";
import { ApiResponse } from "@/shared/api/response/response";

export const useFriends = () => {
    const currentUserFriendsQuery = useQuery<ApiResponse<FriendshipOutput[]>, Error, FriendshipOutput[]>({
        queryKey: ['currentUserFriends'],
        queryFn: getFriendships,
        select: (response) => {
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        },
        retry: false,
        staleTime: Infinity
    });

    const outgoingFriendRequestsQuery = useQuery<ApiResponse<FriendshipOutput[]>, Error, FriendshipOutput[]>({
        queryKey: ['outgoingFriendRequests'],
        queryFn: getOutgoingFriendRequests,
        select: (response) => {
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        },
        retry: false,
        staleTime: Infinity
    });

    const incomingFriendRequestsQuery = useQuery<ApiResponse<FriendshipOutput[]>, Error, FriendshipOutput[]>({
        queryKey: ['incomingFriendRequests'],
        queryFn: getIncomingFriendRequests,
        select: (response) => {
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        },
        retry: false,
        staleTime: Infinity
    });

    return {
        currentUserFriends: currentUserFriendsQuery.data,
        isLoadingCurrentUserFriends: currentUserFriendsQuery.isLoading,
        errorCurrentUserFriends: currentUserFriendsQuery.error,

        outgoingFriendRequests: outgoingFriendRequestsQuery.data,
        isLoadingOutgoingRequests: outgoingFriendRequestsQuery.isLoading,
        errorOutgoingRequests: outgoingFriendRequestsQuery.error,

        incomingFriendRequests: incomingFriendRequestsQuery.data,
        isLoadingIncomingRequests: incomingFriendRequestsQuery.isLoading,
        errorIncomingRequests: incomingFriendRequestsQuery.error,
    };
};

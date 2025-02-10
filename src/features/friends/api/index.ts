import { ApiResponse } from "@/shared/api/response/response";
import { FriendshipOutput } from "@/features/friends/api/output/FriendshipOutput";
import { getAllWithRequestParameter } from "@/shared/api/genericAPI";
import { API_ENDPOINTS } from "@/core/config/axios/api-endpoints";

export const getFriendships: () => Promise<ApiResponse<FriendshipOutput[]>> = async (): Promise<ApiResponse<FriendshipOutput[]>> => {
    return await getAllWithRequestParameter(API_ENDPOINTS.FRIENDSHIPS.CURRENT_USER_FRIENDSHIPS);
};

export const getOutgoingFriendRequests: () => Promise<ApiResponse<FriendshipOutput[]>> = async (): Promise<ApiResponse<FriendshipOutput[]>> => {
    return await getAllWithRequestParameter(API_ENDPOINTS.FRIENDSHIPS.CURRENT_USER_OUTGOING_FRIENDSHIPS);
};

export const getIncomingFriendRequests: () => Promise<ApiResponse<FriendshipOutput[]>> = async (): Promise<ApiResponse<FriendshipOutput[]>> => {
    return await getAllWithRequestParameter(API_ENDPOINTS.FRIENDSHIPS.CURRENT_USER_INCOMING_FRIENDSHIPS);
};
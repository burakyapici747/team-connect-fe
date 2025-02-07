import {ApiResponse} from "@/shared/api/response/response";
import {UserProfilePrivateOutput} from "@/features/profile/api/output/UserProfilePrivateOutput";
import {getSingleWithRequestParameter} from "@/shared/api/genericAPI";
import {API_ENDPOINTS} from "@/core/config/axios/api-endpoints";

export const getCurrentUserProfile: () => Promise<ApiResponse<UserProfilePrivateOutput>> = async (): Promise<ApiResponse<UserProfilePrivateOutput>> => {
    return await getSingleWithRequestParameter(API_ENDPOINTS.PROFILE.CURRENT_USER_PROFILE);
};
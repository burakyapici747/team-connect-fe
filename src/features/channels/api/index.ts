import {ApiResponse} from "@/shared/api/response/response";
import {DMChannel} from "@/core/types/channel";
import {getSingleWithRequestParameter} from "@/shared/api/genericAPI";
import {API_ENDPOINTS} from "@/core/config/axios/api-endpoints";

export const getCurrentUserDMChannels: () => Promise<ApiResponse<DMChannel>> = async (): Promise<ApiResponse<DMChannel>> => {
    return await getSingleWithRequestParameter(API_ENDPOINTS.DM_CHANNELS.GET_CURRENT_USER_DM_CHANNELS, {});
};
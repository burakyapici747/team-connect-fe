import {getSingleWithRequestParameter} from "@/shared/api/genericAPI";
import {API_ENDPOINTS} from "@/core/config/axios/api-endpoints";
import {CurrentUser} from "@/features/users/model/user";
import {ApiResponse} from "@/shared/api/response/response";

export const getCurrentUser = async (): Promise<ApiResponse<CurrentUser>> => {
  return await getSingleWithRequestParameter(API_ENDPOINTS.USERS.ME, {}, { withCredentials: true });
};

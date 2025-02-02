import {ApiResponse} from "@/shared/api/response/response";
import {API_ENDPOINTS} from "@/core/config/axios/api-endpoints";
import {postSingleRequestParameter} from "@/shared/api/genericAPI";
import {LoginInput} from "@/features/auth/types";

export const login = async (loginInput: LoginInput): Promise<ApiResponse<[]>> => {
    return await postSingleRequestParameter(API_ENDPOINTS.AUTH.LOGIN, loginInput, {});
};
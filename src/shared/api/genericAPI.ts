import axios, { AxiosResponse } from "axios";
import { ApiResponse, ErrorType } from "@/shared/api/response/response";
import { getWithRequestParameter } from "@/core/config/axios/instance";

const requestHandler = async <T>(axiosResponse: Promise<AxiosResponse>): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosResponse;
        const data: T = await response.data;

        return {
            message: "Successful Fetching",
            isSuccess: true,
            data: data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                message: error.message,
                isSuccess: false,
                errorType: ErrorType.ERROR
            }
        }

        return {
            message: "Unknown Error",
            isSuccess: false,
            errorType: ErrorType.ERROR
        }
    }
};

export const getAllWithRequestParameter = async <T extends object>(
    url: string,
    requestParameters: { [key: string]: string | number | boolean }
): Promise<ApiResponse<Array<T>>> => {
    return requestHandler<Array<T>>(getWithRequestParameter(url, requestParameters));
};

export const getSingleWithRequestParameter = async <T extends object>(
    url: string,
    requestParameters: { [key: string]: string | number | boolean }
): Promise<ApiResponse<T>> => {
    return requestHandler<T>(getWithRequestParameter(url, requestParameters));
};


import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { ApiResponse, ErrorType } from "@/shared/api/response/response";
import {
    getWithPathVariable,
    getWithRequestParameter,
    postWithPathVariable,
    postWithRequestParameter
} from "@/core/config/axios/instance";

const requestHandler = async <T>(
    axiosResponse: Promise<AxiosResponse>
): Promise<ApiResponse<T>> => {
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
    requestParameters: { [key: string]: string | number | boolean } = {},
    config: AxiosRequestConfig = {}
): Promise<ApiResponse<Array<T>>> => {
    return requestHandler<Array<T>>(getWithRequestParameter(url, requestParameters, config));
};

export const getAllWithPathVariable = async <T extends object>(
    url: string,
    pathTemplate: string,
    pathVariable: {[key: string] : string | number | boolean} = {},
    config: AxiosRequestConfig = {}
) => {
    return requestHandler<Array<T>>(getWithPathVariable(url, pathTemplate, pathVariable, config));
};

export const getSingleWithRequestParameter = async <T extends object>(
    url: string,
    requestParameters: { [key: string]: string | number | boolean } = {},
    config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
    return requestHandler<T>(getWithRequestParameter(url, requestParameters, config));
};

export const postSingleRequestParameter = async <TRequest extends object, TResponse>(
    url:string,
    requestBody: TRequest,
    requestParameters: {[key:string]: string | number | boolean},
    config: AxiosRequestConfig = {}
): Promise<ApiResponse<TResponse>> =>{
    return await requestHandler<TResponse>(postWithRequestParameter(url, requestParameters, requestBody, config));
};

export const postSingleWithPathVariable = async <TRequest extends object, TResponse>(
    url:string,
    requestBody: TRequest,
    pathTemplate: string,
    pathVariable: {[key: string] : string | number | boolean} = {},
    config: AxiosRequestConfig = {}
): Promise<ApiResponse<TResponse>> =>{
    return await requestHandler<TResponse>(postWithPathVariable(url, pathTemplate, pathVariable, requestBody, config));
};

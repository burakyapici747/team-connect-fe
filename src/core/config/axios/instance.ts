import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        timeout: 10000,
        headers: { 'Content-Type': "application/json" },
    });

    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        return config;
    }, (error: AxiosError) => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        async (error: AxiosError) => {
            return Promise.reject(error);
        },
    );
    return instance;
};

const createFullURLForRequestParameter = (requestParameters: { [key: string]: string | number | boolean }): string => {
    if (!requestParameters || Object.keys(requestParameters).length === 0) return '';

    const queryString = Object.entries(requestParameters)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

    return `?${queryString}`;
};

const createFullURLForPathVariable = (pathTemplate: string, pathParams: { [key: string]: string | number | boolean }): string => {
    return pathTemplate.replace(/{(\w+)}/g, (_, key) => {
        if (pathParams[key] === undefined) {
            throw new Error(`Missing value for path variable: ${key}`);
        }
        return encodeURIComponent(pathParams[key]);
    });
};

export const getWithRequestParameter = async (url: string, requestParameters: { [key: string]: string | boolean | number }, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    const fullURL: string = url + createFullURLForRequestParameter(requestParameters);

    if (Object.keys(config).length === 0) {
        return axiosInstance().get(fullURL);
    }else{
        return axiosInstance().get(fullURL, config);
    }
};

export const getWithPathVariable = async (url: string, pathVariables: {[key:string]: string | number | boolean}, config: AxiosRequestConfig): Promise<AxiosResponse> => {
    const fullURL :string = url + createFullURLForPathVariable(url, pathVariables);

    if (Object.keys(config).length === 0) {
        return axiosInstance().get(fullURL);
    }else{
        return axiosInstance().get(fullURL, config);
    }
};
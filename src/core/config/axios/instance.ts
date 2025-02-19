import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        timeout: 10000,
        headers: { 'Content-Type': "application/json" },
        withCredentials: true,
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

const createFullURLForRequestParameter = (
    requestParameters: { [key: string]: string | number | boolean }
): string => {
    if (!requestParameters || Object.keys(requestParameters).length === 0) return '';

    const queryString = Object.entries(requestParameters)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

    return `?${queryString}`;
};

const createFullURLForPathVariable = (
    pathTemplate: string,
    pathVariables: { [key: string]: string | number | boolean }
): string => {
    let path = pathTemplate;
    for (const key in pathVariables) {
        path = path.replace(`{${key}}`, encodeURIComponent(String(pathVariables[key])));
    }
    return path;
};


export const getWithRequestParameter = async (
    url: string,
    requestParameters: { [key: string]: string | boolean | number },
    config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
    const fullURL: string = url + createFullURLForRequestParameter(requestParameters);

    if (Object.keys(config).length === 0) {
        return axiosInstance().get(fullURL);
    }else{
        return axiosInstance().get(fullURL, config);
    }
};

export const getWithPathVariable = async (
    url: string,
    pathTemplate: string,
    pathVariables: {[key:string]: string | number | boolean},
    config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
    const fullURL :string = url + createFullURLForPathVariable(pathTemplate, pathVariables);
    if (Object.keys(config).length === 0) {
        return axiosInstance().get(fullURL);
    }else{
        return axiosInstance().get(fullURL, config);
    }
};

export const postWithRequestParameter = async <T extends object>(
    url: string,
    requestParameters: {[key:string]: string | number | boolean},
    requestBody: T,
    config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
    const fullURL: string = url + createFullURLForRequestParameter(requestParameters);

    if(Object.keys(config).length === 0){
        return axiosInstance().post(fullURL, requestBody);
    }else{
        return axiosInstance().post(fullURL, requestBody, config);
    }
}

export const postWithPathVariable = async <T extends object>(
    url: string,
    pathTemplate: string,
    pathVariables: {[key:string]: string | number | boolean},
    requestBody: T,
    config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
    const fullURL:string = url + createFullURLForPathVariable(pathTemplate, pathVariables);

    if(Object.keys(config).length === 0){
        return axiosInstance().post(fullURL, requestBody);
    }else{
        return axiosInstance().post(fullURL, requestBody, config);
    }
};
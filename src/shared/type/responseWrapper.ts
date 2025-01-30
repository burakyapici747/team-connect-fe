import {BaseResponse} from "@/shared/model/baseResponse";

export interface ResponseWrapper<T extends BaseResponse>{
    message: string,
    status: number,
    data: T,
}
import {BaseModel} from "@/shared/model/BaseModel";

export interface CurrentUser extends BaseModel{
    username: string;
    email: string;
}
import {BaseModel} from "@/shared/model/BaseModel";

export interface UserProfilePrivate extends BaseModel{
    avatarFileId: string,
    avatarFileUrl: string,
    fullName: string,
    bio: string,
    timezone: string,
    language: string,
    birthday: string,
    gender: string,
    themePreference: string
}

export interface UserProfilePublic extends BaseModel{
    email: string,
    username: string,
    profileAvatar: string,
}
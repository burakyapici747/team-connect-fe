import {useQuery} from "@tanstack/react-query";
import {getCurrentUserDMChannels} from "@/features/channels/api";
import {DMChannel} from "@/core/types/channel";
import {ApiResponse} from "@/shared/api/response/response";

export const useDMChannel = () => {
    const userCurrentUserDMChannelsQuery = useQuery<ApiResponse<DMChannel[]>, Error, DMChannel[]>({
        queryKey: ['currentUserDMChannels'],
        queryFn: getCurrentUserDMChannels,
        retry: false,
        select: (response) => {
            if(response.isSuccess){
                return response.data;
            }else{
                throw new Error(response.message);
            }
        },
        staleTime: Infinity
    });

    return {
        currentUserDMChannels: userCurrentUserDMChannelsQuery.data,
        isLoading: userCurrentUserDMChannelsQuery.isLoading,
        error: userCurrentUserDMChannelsQuery.error
    }
};
import {getMessagesByChannelId} from "@/features/messages/api";
import {ApiResponse} from "@/shared/api/response/response";
import {MessageOutput} from "@/features/messages/api/output/MessageOutput";
import {useQuery} from "@tanstack/react-query";

export const useMessages = (channelId: string) => {
    const userMessagesQuery = useQuery<ApiResponse<MessageOutput[]>, Error, MessageOutput[]>({
        queryKey: ['messages', channelId],
        queryFn: () => getMessagesByChannelId(channelId),
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
        messages: userMessagesQuery.data,
        isLoading: userMessagesQuery.isLoading,
        error: userMessagesQuery.error
    }
};
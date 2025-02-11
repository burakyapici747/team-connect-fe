import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import { getMessagesByChannelId, sendMessage } from "@/features/messages/api";

export const useMessages = (channelId: string) => {
    const queryClient = useQueryClient();

    const messagesQuery = useQuery<ApiResponse<MessageOutput[]>, Error, MessageOutput[]>({
        queryKey: ['messages', channelId],
        queryFn: () => getMessagesByChannelId(channelId),
        retry: false,
        staleTime: Infinity,
        select: (response) => {
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        },
    });

    const sendMessageMutation = useMutation<ApiResponse<void>, Error, never>({
        mutationFn: (requestBody) => sendMessage(channelId, requestBody),
        onSuccess: () => {
            queryClient.invalidateQueries(['messages', channelId]);
        },
    });

    return {
        messages: messagesQuery.data,
        isLoading: messagesQuery.isLoading,
        error: messagesQuery.error,

        sendMessage: sendMessageMutation.mutate,
        isSending: sendMessageMutation.isLoading,
        sendError: sendMessageMutation.error,
    };
};

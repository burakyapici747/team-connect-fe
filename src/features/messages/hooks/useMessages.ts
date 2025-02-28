import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import { getMessagesByChannelId, getMessagesByChannelIdWithBefore, sendMessage } from "@/features/messages/api";

export const useMessages = (channelId: string) => {
  const queryClient = useQueryClient();

  const messageQuery = useInfiniteQuery<MessageOutput[], Error>({
    queryKey: ["messages", channelId],
    queryFn: async ({ pageParam }): Promise<MessageOutput[]> => {
      if(pageParam === undefined){
        const response = await getMessagesByChannelId(channelId);
        return response.data.data;
      }else{
        const response = await getMessagesByChannelIdWithBefore(channelId, pageParam as string);
        return response.data.data;
      }
    },
    getNextPageParam: (lastPage): string | undefined => {
      if(lastPage && lastPage.length > 0 && lastPage[lastPage.length - 1].id){
        return lastPage[lastPage.length - 1].id;
      }
      return undefined;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const sendMessageMutation = useMutation<ApiResponse<void>, Error, { content: string }>({
    mutationFn: (requestBody: { content: string }): Promise<ApiResponse<void>> => sendMessage(channelId, requestBody),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", channelId],
        refetchType: "none",
      })
    }
  });

  const allMessages = messageQuery.data?.pages.flat() ?? [];

  return {
    messages: allMessages,
    isLoading: messageQuery.isLoading,
    fetchError: messageQuery.error,
    fetchNextPage: messageQuery.fetchNextPage,
    hasNextPage: messageQuery.hasNextPage,
    sendMessage: sendMessageMutation.mutate,
  };
};


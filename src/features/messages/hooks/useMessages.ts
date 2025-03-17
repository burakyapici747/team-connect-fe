import {useInfiniteQuery, useMutation, useQueryClient,} from "@tanstack/react-query";
import {ApiResponse} from "@/shared/api/response/response";
import {MessageOutput} from "@/features/messages/api/output/MessageOutput";
import {getMessagesByChannelId, getMessagesByChannelIdWithBefore, sendMessage} from "@/features/messages/api";
import {useUser} from "@/features/users/hooks/useUser";

export const useMessages = (channelId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const messageQuery = useInfiniteQuery<MessageOutput[], Error>({
    queryKey: ["messages", channelId],
    queryFn: async ({ pageParam }): Promise<MessageOutput[]> => {
      if (pageParam === undefined) {
        const response = await getMessagesByChannelId(channelId, { limit: 50 });
        return response.data.data;
      } else {
        const response = await getMessagesByChannelIdWithBefore(
          channelId,
          pageParam as string
        );
        return response.data.data;
      }
    },
    getNextPageParam: (lastPage): string | undefined => {
      if (lastPage && lastPage.length > 0 && lastPage[lastPage.length - 1].id) {
        return lastPage[lastPage.length - 1].id;
      }
      return undefined;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const getMessagesWithBeforeId = async (beforeId: string) => {
    try {
      await messageQuery.fetchNextPage({ pageParam: beforeId });
    } catch (error) {
      console.error("Failed to fetch earlier messages:", error);
    }
  };

  const sendMessageMutation = useMutation<ApiResponse<MessageOutput>, Error, { content: string }>({
    mutationFn: async (requestBody) => {
      return await sendMessage(channelId, requestBody);
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries(["messages", channelId]);

      const previousMessages = queryClient.getQueryData(["messages", channelId]);

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const optimisticMessage: MessageOutput = {
        id: tempId,
        channelId,
        content: newMessage.content,
        timestamp: new Date().toISOString(),
        editedTimestamp: null,
        pinned: false,
        type: 0,
        attachments: [],
        mentions: [],
        reactions: [],
        author: {
          id: user?.id || "currentUserId",
          username: user?.username || "You",
        },
        isPending: true,
      };

      queryClient.setQueryData(["messages", channelId], (old: any) => {
        if (old === undefined) return { pages: [[optimisticMessage]], pageParams: [undefined] };

        old.pages[0].unshift(optimisticMessage);

        return JSON.parse(JSON.stringify(old));
      });

      return { previousMessages, tempId };
    },

    onSuccess: (response, variables, context) => {
      queryClient.setQueryData(["messages", channelId], (old: any) => {
        if (old === undefined) return { pages: [[response.data.data]], pageParams: [undefined] };

        const newData = JSON.parse(JSON.stringify(old));

        for(let i: number = 0; i < newData.pages[0].length; i++){
          if(newData.pages[0][i].id === context.tempId){
            newData.pages[0][i] = response.data.data;
            newData.pages[0][i].isPending = false;
            break;
          }
        }

        for(let i: number = 0; i < newData.pages.length; i++){
          if(newData.pages[i].length < 51){
            if(i > 0) newData.pageParams[i] = newData.pages[i - 1][newData.pages[i - 1].length -1].id;
            return JSON.parse(JSON.stringify(newData))
          }

          const currentPageLastMessage: MessageOutput = newData.pages[i].pop();

          if(newData.pages[i + 1] === undefined){
            newData.pages.push([]);
            newData.pageParams.push(undefined);
          }

          newData.pages[i + 1].unshift(currentPageLastMessage);

          if(newData.pages[i].length < 1) break;

          if(i > 0) newData.pageParams[i] = newData.pages[i - 1][newData.pages[i - 1].length -1].id;
        }

        return newData;
      });
    },

    onError: (error, variables, context) => {
    }
  });

  const allMessages = messageQuery.data?.pages.flat().reverse() || [];

  return {
    messages: allMessages,
    isLoading: messageQuery.isLoading,
    fetchError: messageQuery.error,
    isFetching: messageQuery.isFetching,
    fetchNextPage: messageQuery.fetchNextPage,
    hasNextPage: messageQuery.hasNextPage,
    sendMessage: sendMessageMutation.mutateAsync,
    getMessagesWithBeforeId,
  };
};
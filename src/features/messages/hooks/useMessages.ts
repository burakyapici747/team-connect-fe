import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import {
  getMessagesByChannelId,
  getMessagesByChannelIdWithBefore,
  sendMessage,
} from "@/features/messages/api";
import { useUser } from "@/features/users/hooks/useUser";

export const useMessages = (channelId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const messageQuery = useInfiniteQuery<MessageOutput[], Error>({
    queryKey: ["messages", channelId],
    queryFn: async ({ pageParam }): Promise<MessageOutput[]> => {
      if (pageParam === undefined) {
        const response = await getMessagesByChannelId(channelId);
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
      const response = await sendMessage(channelId, requestBody);
      return response;
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
        if (!old) return { pages: [[optimisticMessage]], pageParams: [undefined] };

        const newData = JSON.parse(JSON.stringify(old));

        const latestPageIndex = newData.pages.length - 1;

        newData.pages[latestPageIndex] = [optimisticMessage, ...newData.pages[latestPageIndex]];


        return newData;
      });

      return { previousMessages, tempId };
    },

    onSuccess: (response, variables, context) => {
      queryClient.setQueryData(["messages", channelId], (old: any) => {
        if (!old) return { pages: [[response.data.data]], pageParams: [undefined] };

        const newData = JSON.parse(JSON.stringify(old));
        const latestPageIndex = newData.pages.length - 1;

        newData.pages[latestPageIndex] = newData.pages[latestPageIndex].map(
            (msg: MessageOutput) => msg.id === context?.tempId ? response.data.data : msg
        );

        return newData;
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages", channelId], context.previousMessages);
      }
      console.error("Message sending failed:", error);
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
    sendMessage: sendMessageMutation.mutateAsync, // Using mutateAsync to allow await
    getMessagesWithBeforeId,
  };
};
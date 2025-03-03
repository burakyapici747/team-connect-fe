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

  // Function to fetch earlier messages
  const getMessagesWithBeforeId = async (beforeId: string) => {
    try {
      await messageQuery.fetchNextPage({ pageParam: beforeId });
    } catch (error) {
      console.error("Failed to fetch earlier messages:", error);
    }
  };

  // Mutation for sending messages
  const sendMessageMutation = useMutation<ApiResponse<MessageOutput>, Error, { content: string }>({
    mutationFn: async (requestBody) => {
      return await sendMessage(channelId, requestBody);
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["messages", channelId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(["messages", channelId]);

      // Create an optimistic message
      const optimisticMessage: MessageOutput = {
        id: `temp-${Date.now()}`,
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
          // Add other required author fields with fallbacks
        },
        isPending: true,
      };

      // Optimistically update the cache
      queryClient.setQueryData(["messages", channelId], (old: any) => {
        if (!old) return { pages: [[optimisticMessage]], pageParams: [undefined] };

        const newData = JSON.parse(JSON.stringify(old));
        // Add the optimistic message to the most recent page (last in the array)
        const latestPageIndex = newData.pages.length - 1;
        newData.pages[latestPageIndex] = [...newData.pages[latestPageIndex], optimisticMessage];

        return newData;
      });

      return { previousMessages };
    },
    onSuccess: (response) => {
      // Replace the optimistic message with the actual one
      queryClient.setQueryData(["messages", channelId], (old: any) => {
        if (!old) return { pages: [[response.data.data]], pageParams: [undefined] };

        const newData = JSON.parse(JSON.stringify(old));
        const latestPageIndex = newData.pages.length - 1;

        // Replace any temporary message with the actual one
        newData.pages[latestPageIndex] = newData.pages[latestPageIndex].map(
            (msg: MessageOutput) => msg.id.toString().startsWith('temp-') ? response.data.data : msg
        );

        return newData;
      });
    },
    onError: (error, variables, context) => {
      // Revert to the previous state if there's an error
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages", channelId], context.previousMessages);
      }
      console.error("Message sending failed:", error);
    }
  });

  // Get all messages by flattening the pages and ensuring correct order
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
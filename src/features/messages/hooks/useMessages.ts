import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import {
  getMessagesByChannelId,
  sendMessage as sendMessageApi,
  MessageQueryParams,
} from "@/features/messages/api";

export const useMessages = (channelId: string) => {
  const queryClient = useQueryClient();

  const messagesQuery = useInfiniteQuery<
    ApiResponse<MessageOutput[]>,
    Error,
    MessageOutput[]
  >({
    queryKey: ["messages", channelId],
    queryFn: ({ pageParam }) => {
      const params = (pageParam as MessageQueryParams) || {
        page: 0,
        size: 100,
      };
      return getMessagesByChannelId(channelId, params);
    },
    initialPageParam: { page: 0, size: 100 } as MessageQueryParams,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage.isSuccess) return undefined;

      const nextPage = (lastPageParam as MessageQueryParams).page || 0;
      return {
        page: nextPage + 1,
        size: 100,
      } as MessageQueryParams;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (!firstPage.isSuccess) return undefined;

      const prevPage = (firstPageParam as MessageQueryParams).page || 0;
      if (prevPage <= 0) {
        return undefined;
      }
      return {
        page: prevPage - 1,
        size: 100,
      } as MessageQueryParams;
    },
    select: (data) => {
      const allMessages = data.pages.flatMap((page) => {
        if (!page.isSuccess) return [];

        const responseData = page.data as any;

        if (Array.isArray(responseData)) {
          return responseData;
        } else if (
          responseData &&
          responseData.data &&
          Array.isArray(responseData.data)
        ) {
          return responseData.data;
        } else {
          console.warn("API yanıt yapısı beklenen formatta değil:", page);
          return [];
        }
      });

      const uniqueMessages = Array.from(
        new Map(allMessages.map((message) => [message.id, message])).values()
      );

      return uniqueMessages.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
      });
    },
    gcTime: Infinity,
    staleTime: Infinity,
    maxPages: Infinity,
  });

  const sendMessageMutation = useMutation<
    ApiResponse<void>,
    Error,
    { content: string }
  >({
    mutationFn: (requestBody) => sendMessageApi(channelId, requestBody),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", channelId],
        refetchType: "none",
      });
    },
  });

  const fetchPreviousMessages = async () => {
    if (messagesQuery.hasPreviousPage) {
      await messagesQuery.fetchPreviousPage();
      return true;
    }
    return false;
  };

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    isFetchingNextPage: messagesQuery.isFetchingNextPage,
    isFetchingPreviousPage: messagesQuery.isFetchingPreviousPage,
    fetchError: messagesQuery.error,
    sendMessage: sendMessageMutation.mutateAsync,
    sendMessageError: sendMessageMutation.error,
    fetchNextPage: messagesQuery.fetchNextPage,
    fetchPreviousMessages,
    hasNextPage: messagesQuery.hasNextPage,
    hasPreviousPage: messagesQuery.hasPreviousPage,
  };
};
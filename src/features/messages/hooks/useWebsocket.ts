import { useEffect, useState } from "react";
import webSocketService from "@/core/lib/websocketService";
import { IMessage, StompSubscription } from "@stomp/stompjs";
import { WebsocketMessageOutput } from "@/features/messages/api/output/WebsocketMessageOutput";
import { useQueryClient } from "@tanstack/react-query";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";

interface UseWebSocketOptions {
  channelId: string;
}

export const useWebSocket = ({ channelId }: UseWebSocketOptions) => {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  let reconnectAttempts = 0;

  useEffect(() => {
    let subscription: StompSubscription | null = null;

    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        console.log("WebSocket connected!");

        subscription = webSocketService.subscribe(
          channelId,
          (stompMessage: IMessage) => {
            try {
              const parsedMessage: WebsocketMessageOutput = JSON.parse(
                stompMessage.body
              );

              const formattedMessage: MessageOutput = {
                ...parsedMessage,
              };

              queryClient.setQueryData(
                ["messages", channelId],
                (oldData: any) => {
                  if (!oldData) {
                    return {
                      pages: [
                        {
                          isSuccess: true,
                          data: [formattedMessage],
                        },
                      ],
                      pageParams: [{ page: 0, size: 100 }],
                    };
                  }

                  const allMessages = oldData.pages.flatMap((page: any) => {
                    if (!page.isSuccess) return [];

                    const responseData = page.data;
                    if (Array.isArray(responseData)) {
                      return responseData;
                    } else if (
                      responseData &&
                      responseData.data &&
                      Array.isArray(responseData.data)
                    ) {
                      return responseData.data;
                    }
                    return [];
                  });

                  if (
                    allMessages.some(
                      (msg: MessageOutput) => msg.id === formattedMessage.id
                    )
                  ) {
                    return oldData;
                  }

                  const updatedPages = [...oldData.pages];
                  const lastPageIndex = updatedPages.length - 1;

                  if (
                    lastPageIndex >= 0 &&
                    updatedPages[lastPageIndex].isSuccess
                  ) {
                    const lastPage = updatedPages[lastPageIndex];

                    let lastPageData;
                    if (Array.isArray(lastPage.data)) {
                      lastPageData = [...lastPage.data, formattedMessage];
                    } else if (
                      lastPage.data &&
                      lastPage.data.data &&
                      Array.isArray(lastPage.data.data)
                    ) {
                      lastPageData = [...lastPage.data.data, formattedMessage];
                    } else {
                      lastPageData = [formattedMessage];
                    }

                    const sortedMessages = lastPageData.sort(
                      (a: MessageOutput, b: MessageOutput) => {
                        const timestampA = new Date(a.timestamp).getTime();
                        const timestampB = new Date(b.timestamp).getTime();
                        return timestampA - timestampB;
                      }
                    );

                    updatedPages[lastPageIndex] = {
                      ...lastPage,
                      data: sortedMessages,
                    };
                  } else {
                    updatedPages.push({
                      isSuccess: true,
                      data: [formattedMessage],
                    });
                  }

                  const allUpdatedMessages = updatedPages.flatMap(
                    (page: any) => {
                      if (!page.isSuccess) return [];
                      return Array.isArray(page.data) ? page.data : [];
                    }
                  );

                  const uniqueMessages = Array.from(
                    new Map(
                      allUpdatedMessages.map((msg: MessageOutput) => [
                        msg.id,
                        msg,
                      ])
                    ).values()
                  );

                  const sortedUniqueMessages = uniqueMessages.sort(
                    (a: MessageOutput, b: MessageOutput) => {
                      const timestampA = new Date(a.timestamp).getTime();
                      const timestampB = new Date(b.timestamp).getTime();
                      return timestampA - timestampB;
                    }
                  );

                  return {
                    pages: [
                      {
                        isSuccess: true,
                        data: sortedUniqueMessages,
                      },
                    ],
                    pageParams: [
                      { page: 0, size: sortedUniqueMessages.length },
                    ],
                  };
                }
              );

              // Sorguyu geçersiz kıl ve yeniden çekilmesini sağla
              queryClient.invalidateQueries({
                queryKey: ["messages", channelId],
                refetchType: "none",
              });
            } catch (err) {
              console.error("Error parsing message:", err);
              setError(err as Error);
            }
          }
        );
      } catch (err) {
        console.error("WebSocket connection failed:", err);
        setError(err as Error);

        if (reconnectAttempts < 5) {
          reconnectAttempts++;
          setTimeout(connectWebSocket, 3000);
        }
      }
    };

    connectWebSocket();

    return () => {
      subscription?.unsubscribe();
      webSocketService.disconnect();
      console.log("WebSocket disconnected!");
    };
  }, [channelId, queryClient]);

  return { error };
};

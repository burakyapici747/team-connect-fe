// features/messages/hooks/useWebSocket.ts
import { useEffect, useState } from "react";
import webSocketService from "@/core/lib/websocketService";
import { IMessage } from "@stomp/stompjs";
import { WebsocketMessageOutput } from "@/features/messages/api/output/WebsocketMessageOutput";
import { useQueryClient } from "@tanstack/react-query";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";

interface UseWebSocketOptions {
    channelId: string;
}

export const useWebSocket = ({ channelId }: UseWebSocketOptions) => {
    const [error, setError] = useState<Error | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        let subscription: any;

        const initializeWebSocket = async () => {
            try {
                await webSocketService.connect();

                subscription = webSocketService.subscribe(
                    channelId,
                    (stompMessage: IMessage) => {
                        try {
                            const parsedMessage: WebsocketMessageOutput = JSON.parse(stompMessage.body);

                            // Update cache safely: ensure oldData is treated as an array.
                            queryClient.setQueryData(
                                ["messages", channelId],
                                (oldData: unknown) => {
                                    const data = Array.isArray(oldData) ? (oldData as MessageOutput[]) : [];
                                    // Prevent duplicates by checking message id.
                                    const messageExists = data.some((msg) => msg.id === parsedMessage.id);
                                    if (messageExists) return data;
                                    return [...data, parsedMessage];
                                }
                            );
                        } catch (err) {
                            console.error("Error parsing message:", err);
                            setError(err as Error);
                        }
                    }
                );
            } catch (err) {
                console.error("WebSocket connection failed:", err);
                setError(err as Error);
            }
        };

        initializeWebSocket();

        return () => {
            if (subscription) {
                try {
                    subscription.unsubscribe();
                } catch (err) {
                    console.error("Error during subscription unsubscribe:", err);
                }
            }
            webSocketService.disconnect();
        };
    }, [channelId, queryClient]);

    return { error };
};

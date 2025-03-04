import { useEffect, useState } from "react";
import webSocketService from "@/core/lib/websocketService";
import { IMessage, StompSubscription } from "@stomp/stompjs";
import { WebsocketMessageOutput } from "@/features/messages/api/output/WebsocketMessageOutput";
import { useQueryClient } from "@tanstack/react-query";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import {useUser} from "@/features/users/hooks/useUser";

interface UseWebSocketOptions {
    channelId: string;
}

export const useWebSocket = ({ channelId }: UseWebSocketOptions) => {
    const { user } = useUser();
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
                            const parsedMessage: WebsocketMessageOutput = JSON.parse(stompMessage.body);
                            const formattedMessage: MessageOutput = { ...parsedMessage };

                            console.log("Received WebSocket message:", {
                                message: formattedMessage,
                                currentUserId: user?.id
                            });

                            // Kendi mesajınızı filtreleyin:
                            if (formattedMessage.author.id === user?.id) {
                                console.log("Kendi mesajınızı eklenmiyor.");
                                return;
                            }

                            queryClient.setQueryData(["messages", channelId], (oldData: any) => {
                                // Eğer cache boşsa, tek bir sayfa oluşturun.
                                if (!oldData) {
                                    return {
                                        pages: [[formattedMessage]],
                                        pageParams: [undefined],
                                    };
                                }

                                // Tüm mevcut mesajları içeren tek bir dizi elde edin.
                                const allMessages = oldData.pages.flat();

                                // Aynı mesaj daha önce eklenmişse, güncelleme yapmayın.
                                if (allMessages.some((msg: MessageOutput) => msg.id === formattedMessage.id)) {
                                    return oldData;
                                }

                                const updatedMessages = [...allMessages, formattedMessage].sort(
                                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                                );

                                return {
                                    pages: [updatedMessages],
                                    pageParams: [undefined],
                                };
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["messages", channelId],
                                refetchType: "none",
                            });
                        } catch (err) {
                            console.error("Mesaj işleme hatası:", err);
                            setError(err as Error);
                        }
                    }
                );
            } catch (err) {
                console.error("WebSocket bağlantısı başarısız:", err);
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
            console.log("WebSocket bağlantısı kesildi!");
        };
    }, [channelId, queryClient, user]);

    return { error };
};
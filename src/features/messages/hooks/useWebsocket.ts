import { useEffect, useState } from "react";
import webSocketService from "@/core/lib/websocketService";
import { IMessage, StompSubscription } from "@stomp/stompjs";
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
                            const websocketMessage: MessageOutput = JSON.parse(stompMessage.body);

                            if(websocketMessage.author.id === user?.id) return;

                            queryClient.setQueryData(["messages", channelId], (old: any) => {
                                if(old === undefined) return;

                                const newData = JSON.parse(JSON.stringify(old));

                                const allMessages = newData.pages.flat();

                                allMessages.push(websocketMessage);

                                allMessages.sort((a: MessageOutput, b: MessageOutput)=> {
                                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                                });

                                const pageSize: number = 50;
                                const chunked: MessageOutput[] = [];

                                for(let i = 0; i < allMessages.length; i += pageSize){
                                    chunked.push(allMessages.slice(i, i + pageSize));
                                }

                                newData.pages = chunked;

                                newData.pageParams = chunked.map((chunk, idx) => {
                                    if (idx === 0) return undefined;
                                    return chunked[idx - 1][chunked[idx - 1].length - 1].id;
                                });

                                return newData;
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
        };
    }, [channelId, queryClient, user]);

    return { error };
};
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
                            const websocketMessage: MessageOutput = JSON.parse(stompMessage.body);

                            queryClient.setQueryData(["messages", channelId], (old: any) => {
                                const newData = JSON.parse(JSON.stringify(old));

                                if(websocketMessage.author.id === user?.id) return;

                                newData.pages[0].unshift(websocketMessage);

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
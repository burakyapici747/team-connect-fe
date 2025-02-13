import { useEffect, useState } from "react";
import webSocketService from "@/core/lib/websocketService";
import { IMessage } from "@stomp/stompjs";
import { WebsocketMessageOutput } from "@/features/messages/api/output/WebsocketMessageOutput";

interface UseWebSocketOptions {
  channelId: string;
  onMessageReceived: (message: WebsocketMessageOutput) => void;
}

export const useWebSocket = ({
  channelId,
  onMessageReceived,
}: UseWebSocketOptions) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let subscription: any;

    const initializeWebSocket = async () => {
      try {
        await webSocketService.connect();
        setConnected(true);
        setError(null);

        subscription = webSocketService.subscribe(
          channelId,
          (stompMessage: IMessage) => {
            try {
              const parsedMessage: WebsocketMessageOutput = JSON.parse(
                stompMessage.body
              );
              onMessageReceived(parsedMessage);
            } catch (error) {
              console.error("Mesaj parse edilirken hata oluştu:", error);
              setError(error as Error);
            }
          }
        );
      } catch (error) {
        console.error("WebSocket bağlantısı kurulamadı:", error);
        setConnected(false);
        setError(error as Error);
      }
    };

    initializeWebSocket();

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Subscription unsubscribe error:", error);
        }
      }
      webSocketService.disconnect();
    };
  }, [channelId, onMessageReceived]);

  return { connected, error };
};

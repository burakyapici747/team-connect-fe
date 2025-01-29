import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

interface UseWebSocketProps {
  channelId: string;
  onMessageReceived: (message: any) => void;
}

export const useWebSocket = ({
  channelId,
  onMessageReceived,
}: UseWebSocketProps) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://192.168.3.50:8080/ws"),
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("WebSocket bağlantısı başarılı!");

      // Kanal mesajlarına abone ol
      client.subscribe(`/topic/dm.queue.${channelId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP hatası:", frame);
    };

    client.onWebSocketError = (event) => {
      console.error("WebSocket hatası:", event);
    };

    // Bağlantıyı başlat
    client.activate();
    clientRef.current = client;

    // Cleanup
    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [channelId]);

  return {
    connected: clientRef.current?.connected || false,
    client: clientRef.current,
  };
};

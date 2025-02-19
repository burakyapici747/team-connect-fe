import { Client, StompSubscription, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private baseUrl: string = "http://192.168.3.50:8080";
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        resolve();
        return;
      }
      const socket = new SockJS(`${this.baseUrl}/ws`);



      this.client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 1000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("WebSocket bağlantısı başarılı");
          this.reconnectAttempts = 0;
          resolve();
        },
        onStompError: (frame) => {
          console.error("STOMP Hatası:", frame);
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(
              `${this.maxReconnectAttempts} başarısız deneme sonrası bağlantı kesildi`
            );
            this.disconnect();
            reject(new Error("STOMP connection error after max retries"));
          }
        },
        onWebSocketError: (event) => {
          console.error("WebSocket Hatası:", event);
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(
              `${this.maxReconnectAttempts} başarısız deneme sonrası bağlantı kesildi`
            );
            this.disconnect();
            reject(new Error("WebSocket connection error after max retries"));
          }
        },
        onDisconnect: () => {
          console.log("WebSocket bağlantısı kesildi");
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.disconnect();
          }
        },
        debug: (str) => {
          if (str.includes("Incoming") || str.includes("Outgoing")) return; // Heartbeat mesajlarını gizle
          console.debug("[WebSocket Debug]:", str);
        },
      });

      try {
        this.client.activate();
      } catch (error) {
        console.error("WebSocket aktivasyon hatası:", error);
        reject(error);
      }
    });
  }

  subscribe(
    channelId: string,
    callback: (message: IMessage) => void
  ): StompSubscription {
    if (!this.client?.connected) {
      throw new Error("WebSocket client bağlı değil");
    }

    const destination = `/topic/dm.queue.${channelId}`;
    console.log(`WebSocket kanalına abone olunuyor: ${destination}`);

    const subscription = this.client.subscribe(destination, callback, {
      id: `sub-${channelId}`,
    });

    this.subscriptions.set(channelId, subscription);
    return subscription;
  }

  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Abonelik sonlandırma hatası:", error);
        }
      });
      this.subscriptions.clear();

      try {
        this.client.deactivate();
        this.client = null;
        this.reconnectAttempts = 0;
        console.log("WebSocket bağlantısı tamamen kapatıldı");
      } catch (error) {
        console.error("WebSocket kapatma hatası:", error);
      }
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;

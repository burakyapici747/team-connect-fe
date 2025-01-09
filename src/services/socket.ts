import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080"

class SocketClient {
  private static instance: SocketClient
  private socket: Socket | null = null

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  connect(token: string) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    })

    this.socket.connect()

    this.socket.on("connect", () => {
      console.log("Socket connected")
    })

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected")
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export const socketClient = SocketClient.getInstance()

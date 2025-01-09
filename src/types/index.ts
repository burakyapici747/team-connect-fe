export interface User {
  id: string
  username: string
  email: string
//   avatar?: string
//   status: "online" | "offline" | "idle" | "dnd"
//   createdAt: string
//   updatedAt: string
}

export interface Message {
  id: string
  content: string
  sender: User
  channelId: string
  createdAt: string
  updatedAt?: string
  attachments?: Attachment[]
}

export interface Channel {
  id: string
  name: string
  description?: string
  type: "text" | "voice"
  serverId: string
  createdAt: string
}

export interface Server {
  id: string
  name: string
  icon?: string
  ownerId: string
  members: User[]
  channels: Channel[]
  createdAt: string
}

export interface Attachment {
  id: string
  url: string
  type: "image" | "video" | "file"
  name: string
  size: number
}

export interface AuthResponse {
  user: User
  message?: string
}

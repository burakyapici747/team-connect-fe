import { User } from "../index"

export type FriendStatus = "FRIEND" | "FRIEND" | "BLOCKED"

export interface FriendRequest {
  id: string
  currentUser: User
  otherUser: User
  status: FriendStatus
  createdAt: string
  updatedAt: string
}

export interface DirectMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  sender: User
  receiver: User
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  participantOne: User
  participantTwo: User
  lastMessage?: DirectMessage
  unreadCount: number
  updatedAt: string
} 
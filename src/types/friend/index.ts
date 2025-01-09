import { User } from "../index"

export type FriendStatus = "PENDING" | "ACCEPTED" | "BLOCKED"
export type FriendRequestType = "INCOMING" | "OUTGOING"

export interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: FriendStatus
  type: FriendRequestType
  sender: User
  receiver: User
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
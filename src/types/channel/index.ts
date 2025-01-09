import { User } from "../index"

export type ChannelType = "TEXT" | "VOICE"

export interface Channel {
  id: string
  name: string
  description?: string
  type: ChannelType
  teamId: string
  createdAt: string
  updatedAt: string
}

export interface ChannelMember {
  id: string
  channelId: string
  userId: string
  joinedAt: string
  lastRead?: string
  user: User
}

export interface ChannelWithMembers extends Channel {
  members: ChannelMember[]
}

export interface ChannelCategory {
  id: string
  name: string
  teamId: string
  channels: Channel[]
  position: number
} 
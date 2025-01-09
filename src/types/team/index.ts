import { User } from "../index"

export type TeamType = "PUBLIC" | "PRIVATE"

export interface Team {
  id: string
  name: string
  description?: string
  image?: string
  type: TeamType
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: "OWNER" | "ADMIN" | "MEMBER"
  user: User
  joinedAt: string
}

export interface TeamWithMemberCount extends Team {
  _count: {
    members: number
  }
}

export interface TeamWithMembers extends Team {
  members: TeamMember[]
} 
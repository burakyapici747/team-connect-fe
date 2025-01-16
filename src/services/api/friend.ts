import { FriendRequest, DirectMessage, Conversation } from "@/types/friend"
import { fetchAPI } from "../api"

export const friendAPI = {
  getFriendRequests: async () => {
    return fetchAPI<FriendRequest[]>("/friends", {
      method: "GET",
    })
  },

  sendFriendRequest: async (userId: string) => {
    return fetchAPI<FriendRequest>("/friends/requests", {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  },

  acceptFriendRequest: async (requestId: string) => {
    return fetchAPI<FriendRequest>(`/friends/requests/${requestId}/accept`, {
      method: "POST",
    })
  },

  rejectFriendRequest: async (requestId: string) => {
    return fetchAPI<FriendRequest>(`/friends/requests/${requestId}/reject`, {
      method: "POST",
    })
  },

  cancelFriendRequest: async (requestId: string) => {
    return fetchAPI<FriendRequest>(`/friends/requests/${requestId}/cancel`, {
      method: "POST",
    })
  },

  getMeChannels: async (userId: string) => {
    return fetchAPI<DirectMessage[]>(`/channels/me${userId}`, {
      method: "GET",
    })
  },

  sendDirectMessage: async (userId: string, content: string) => {
    return fetchAPI<DirectMessage>(`/friends/messages/${userId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  },

  // Friends
  getFriends: async () => {
    return fetchAPI<Conversation[]>("/friends", {
      method: "GET",
    })
  },

  removeFriend: async (userId: string) => {
    return fetchAPI(`/friends/${userId}`, {
      method: "DELETE",
    })
  },

  blockUser: async (userId: string) => {
    return fetchAPI(`/friends/${userId}/block`, {
      method: "POST",
    })
  },

  unblockUser: async (userId: string) => {
    return fetchAPI(`/friends/${userId}/unblock`, {
      method: "POST",
    })
  },
} 
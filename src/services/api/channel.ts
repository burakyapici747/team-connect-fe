import { Channel, ChannelCategory, ChannelWithMembers } from "@/types/channel"
import { fetchAPI } from "../api"

export const channelAPI = {
  // Channel operations
  getChannels: async (teamId: string): Promise<Channel[]> => {
    return fetchAPI(`/teams/${teamId}/channels`)
  },

  getChannel: async (channelId: string): Promise<ChannelWithMembers> => {
    return fetchAPI(`/channels/${channelId}`)
  },

  createChannel: async (teamId: string, data: {
    name: string
    description?: string
    type: "TEXT" | "VOICE"
    categoryId?: string
  }): Promise<Channel> => {
    return fetchAPI(`/teams/${teamId}/channels`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateChannel: async (
    channelId: string,
    data: Partial<Channel>
  ): Promise<Channel> => {
    return fetchAPI(`/channels/${channelId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteChannel: async (channelId: string): Promise<void> => {
    return fetchAPI(`/channels/${channelId}`, {
      method: "DELETE",
    })
  },

  // Category operations
  getCategories: async (teamId: string): Promise<ChannelCategory[]> => {
    return fetchAPI(`/teams/${teamId}/categories`)
  },

  createCategory: async (teamId: string, data: {
    name: string
    position?: number
  }): Promise<ChannelCategory> => {
    return fetchAPI(`/teams/${teamId}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateCategory: async (
    categoryId: string,
    data: Partial<ChannelCategory>
  ): Promise<ChannelCategory> => {
    return fetchAPI(`/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    return fetchAPI(`/categories/${categoryId}`, {
      method: "DELETE",
    })
  },

  // Channel member operations
  joinChannel: async (channelId: string): Promise<void> => {
    return fetchAPI(`/channels/${channelId}/join`, {
      method: "POST",
    })
  },

  leaveChannel: async (channelId: string): Promise<void> => {
    return fetchAPI(`/channels/${channelId}/leave`, {
      method: "POST",
    })
  },

  // Reordering operations
  reorderChannels: async (categoryId: string, channelIds: string[]): Promise<void> => {
    return fetchAPI(`/categories/${categoryId}/reorder`, {
      method: "POST",
      body: JSON.stringify({ channelIds }),
    })
  },

  reorderCategories: async (teamId: string, categoryIds: string[]): Promise<void> => {
    return fetchAPI(`/teams/${teamId}/categories/reorder`, {
      method: "POST",
      body: JSON.stringify({ categoryIds }),
    })
  },
} 
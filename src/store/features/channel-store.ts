import { create } from "zustand"
import { Channel, ChannelCategory, ChannelWithMembers } from "@/types/channel"

interface ChannelStore {
  channels: Channel[]
  categories: ChannelCategory[]
  activeChannel: ChannelWithMembers | null
  setChannels: (channels: Channel[]) => void
  setCategories: (categories: ChannelCategory[]) => void
  setActiveChannel: (channel: ChannelWithMembers | null) => void
  addChannel: (channel: Channel) => void
  updateChannel: (channelId: string, updates: Partial<Channel>) => void
  removeChannel: (channelId: string) => void
  addCategory: (category: ChannelCategory) => void
  updateCategory: (categoryId: string, updates: Partial<ChannelCategory>) => void
  removeCategory: (categoryId: string) => void
  reorderChannels: (categoryId: string, channels: Channel[]) => void
  reorderCategories: (categories: ChannelCategory[]) => void
}

export const useChannelStore = create<ChannelStore>((set) => ({
  channels: [],
  categories: [],
  activeChannel: null,
  setChannels: (channels) => set({ channels }),
  setCategories: (categories) => set({ categories }),
  setActiveChannel: (channel) => set({ activeChannel: channel }),
  addChannel: (channel) =>
    set((state) => ({ channels: [...state.channels, channel] })),
  updateChannel: (channelId, updates) =>
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === channelId ? { ...channel, ...updates } : channel
      ),
    })),
  removeChannel: (channelId) =>
    set((state) => ({
      channels: state.channels.filter((channel) => channel.id !== channelId),
    })),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (categoryId, updates) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === categoryId ? { ...category, ...updates } : category
      ),
    })),
  removeCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter(
        (category) => category.id !== categoryId
      ),
    })),
  reorderChannels: (categoryId, channels) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === categoryId ? { ...category, channels } : category
      ),
    })),
  reorderCategories: (categories) => set({ categories }),
})) 
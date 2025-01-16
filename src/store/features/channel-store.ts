import { create } from "zustand";
import { DMChannel } from "@/types/channel";

interface DMChannelStore {
  channels: DMChannel[];
  activeChannel: DMChannel | null;
  setDMChannels: (channels: DMChannel[]) => void;
  addChannel: (channel: DMChannel) => void;
}

export const useDMChannelStore = create<DMChannelStore>((set) => ({
  channels: [],
  categories: [],
  activeChannel: null,
  setDMChannels: (channels) => set({ channels }),
  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, channel],
    })),
}));

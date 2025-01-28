import { create } from "zustand";
import { Message } from "@/types/message";

interface MessageStore {
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  appendMessages: (messages: Message[]) => void;
  prependMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setHasMore: (hasMore: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clear: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  hasMore: true,
  isLoading: false,
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  appendMessages: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, ...newMessages],
    })),
  prependMessages: (newMessages) =>
    set((state) => ({
      messages: [...newMessages, ...state.messages],
    })),
  addMessage: (message) =>
    set((state) => ({
      messages: state.messages.some((m) => m.id === message.id)
        ? state.messages
        : [...state.messages, message],
    })),
  setHasMore: (hasMore) => set({ hasMore }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ messages: [], hasMore: true, isLoading: false }),
}));

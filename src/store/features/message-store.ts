import { create } from "zustand";
import { Message } from "@/types/message";

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
}));

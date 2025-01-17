import {create} from "zustand";
import {Message} from "@/types/message";

interface MessageStore {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
    messages: [],
    setMessages: (messages: Message[]) => set({messages})
}));

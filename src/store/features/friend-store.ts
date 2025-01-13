import { create } from "zustand";
import { FriendRequest, DirectMessage, Conversation } from "@/types/friend";

interface FriendStore {
  friends: Conversation[];
  friendRequests: FriendRequest[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: DirectMessage[];

  setFriends: (friends: Conversation[]) => void;
  setFriendRequests: (requests: (prev) => any) => void;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: DirectMessage[]) => void;
  addMessage: (message: DirectMessage) => void;
  updateConversation: (conversation: Conversation) => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friends: [],
  friendRequests: [],
  conversations: [],
  activeConversation: null,
  messages: [],

  setFriends: (friends) => set({ friends }),
  setFriendRequests: (requests) => set({ friendRequests: requests }),
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateConversation: (updatedConversation) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === updatedConversation.id
          ? updatedConversation
          : conversation
      ),
    })),
}));

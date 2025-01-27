import { Message } from "@/types/message";
import { fetchAPI } from "../api";

interface MessageCreateInput {
  content: string;
}

export const messageAPI = {
  getMessagesByChannelId: async (channelId: string): Promise<Message[]> => {
    const response = await fetchAPI(`/channels/${channelId}/messages`);
    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format from /channels/me endpoint");
    }
    return response.data;
  },

  sendMessage: async (
    channelId: string,
    input: MessageCreateInput
  ): Promise<void> => {
    await fetchAPI(`/channels/${channelId}/messages`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};

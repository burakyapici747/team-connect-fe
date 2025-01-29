import { Message } from "@/core/types/message";
import { fetchAPI } from "../api";

interface MessageCreateInput {
  content: string;
}

interface GetMessagesParams {
  before?: string;
  limit?: number;
}

interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const messageAPI = {
  getMessagesByChannelId: async (
    channelId: string,
    params?: GetMessagesParams
  ): Promise<Message[]> => {
    const queryParams = new URLSearchParams();

    if (params?.before) {
      queryParams.append("before", params.before);
    }

    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = `/channels/${channelId}/messages${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetchAPI<APIResponse<Message[]>>(url);
    if (!Array.isArray(response.data)) {
      throw new Error(
        "Invalid response format from /channels/messages endpoint"
      );
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

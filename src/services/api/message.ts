import {Message} from "@/types/message";
import {fetchAPI} from "../api";

export const messageAPI = {
    getMessagesByChannelId: async (channelId: string): Promise<Message[]> => {
        const response = await fetchAPI(`/channels/${channelId}/messages`);
        if (!Array.isArray(response)) {
            throw new Error("Invalid response format from /channels/me endpoint");
        }
        return response;
    }
};

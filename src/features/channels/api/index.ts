import {DMChannel} from "@/core/types/channel";
import {fetchAPI} from "../../../shared/api";

export const channelAPI = {
    getDMChannels: async (): Promise<DMChannel[]> => {
        const response = await fetchAPI("/users/me/channels");
        if (!Array.isArray(response)) {
            throw new Error("Invalid response format from /channels/me endpoint");
        }
        return response;
    }
};

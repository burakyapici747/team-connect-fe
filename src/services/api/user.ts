import {DMChannel} from "@/types/channel";
import {fetchAPI} from "../api";

export const teamAPI = {
    getTeams: async (): Promise<DMChannel[]> => {
        const response = await fetchAPI("/users/me/channels");
        if (!Array.isArray(response.data)) {
            throw new Error("Invalid response format from /teams endpoint");
        }
        return response.data;
    },
};

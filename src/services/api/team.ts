import { Team } from "@/types/team";
import { fetchAPI } from "../api";

export const teamAPI = {
  getTeams: async (): Promise<Team[]> => {
    const response = await fetchAPI("/users/me/teams");
    if (!Array.isArray(response)) {
      throw new Error("Invalid response format from /teams endpoint");
    }
    return response;
  },
};

import {
  Team,
  TeamCreateInput,
  TeamCreateOutput,
  ResponseWrapper,
} from "@/types/team";
import { fetchAPI } from "../api";

export const teamAPI = {
  getTeams: async (): Promise<Team[]> => {
    const response = await fetchAPI("/users/me/teams");
    if (!Array.isArray(response)) {
      throw new Error("Invalid response format from /teams endpoint");
    }
    return response;
  },

  createTeam: async (
    input: TeamCreateInput,
    file: File
  ): Promise<ResponseWrapper<TeamCreateOutput>> => {
    const formData = new FormData();
    formData.append(
      "input",
      new Blob([JSON.stringify(input)], { type: "application/json" })
    );
    formData.append("file", file);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      }/v1/api/teams`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create team");
    }

    return response.json();
  },
};

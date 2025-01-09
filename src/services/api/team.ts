import { Team, TeamWithMembers } from "@/types/team"
import { fetchAPI } from "../api"

export const teamAPI = {
  getTeams: async (): Promise<Team[]> => {
    return fetchAPI("/teams")
  },

  getTeam: async (teamId: string): Promise<TeamWithMembers> => {
    return fetchAPI(`/teams/${teamId}`)
  },

  createTeam: async (data: {
    name: string
    description?: string
    type: "PUBLIC" | "PRIVATE"
  }): Promise<Team> => {
    return fetchAPI("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateTeam: async (
    teamId: string,
    data: Partial<Team>
  ): Promise<Team> => {
    return fetchAPI(`/teams/${teamId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    return fetchAPI(`/teams/${teamId}`, {
      method: "DELETE",
    })
  },

  joinTeam: async (teamId: string): Promise<void> => {
    return fetchAPI(`/teams/${teamId}/join`, {
      method: "POST",
    })
  },

  leaveTeam: async (teamId: string): Promise<void> => {
    return fetchAPI(`/teams/${teamId}/leave`, {
      method: "POST",
    })
  },
} 
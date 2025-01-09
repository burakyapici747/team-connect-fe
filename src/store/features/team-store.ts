import { create } from "zustand"
import { Team, TeamWithMembers } from "@/types/team"

interface TeamStore {
  teams: Team[]
  activeTeam: TeamWithMembers | null
  setTeams: (teams: Team[]) => void
  setActiveTeam: (team: TeamWithMembers | null) => void
  addTeam: (team: Team) => void
  updateTeam: (teamId: string, updates: Partial<Team>) => void
  removeTeam: (teamId: string) => void
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  activeTeam: null,
  setTeams: (teams) => set({ teams }),
  setActiveTeam: (team) => set({ activeTeam: team }),
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  updateTeam: (teamId, updates) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId ? { ...team, ...updates } : team
      ),
    })),
  removeTeam: (teamId) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== teamId),
    })),
})) 
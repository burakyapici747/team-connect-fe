"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Plus, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTeamStore } from "@/store/features/team-store"
import { teamAPI } from "@/services/api/team"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function TeamSidebar() {
  const router = useRouter()
  const params = useParams()
  const { teams, setTeams, activeTeam, setActiveTeam } = useTeamStore()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await teamAPI.getTeams()
        setTeams(teams)
      } catch (error) {
        console.error("Failed to fetch teams:", error)
      }
    }

    fetchTeams()
  }, [setTeams])

  useEffect(() => {
    if (params?.teamId && teams.length > 0) {
      const fetchTeamDetails = async () => {
        try {
          const team = await teamAPI.getTeam(params.teamId as string)
          setActiveTeam(team)
        } catch (error) {
          console.error("Failed to fetch team details:", error)
        }
      }

      fetchTeamDetails()
    }
  }, [params?.teamId, teams, setActiveTeam])

  const navigateToTeam = (teamId: string) => {
    router.push(`/teams/${teamId}`)
  }

  const navigateToDirectMessages = () => {
    router.push("/channels/@me")
  }

  return (
    <div className="flex flex-col items-center space-y-4 py-3 w-[72px] h-full bg-[#1E1F22]">
      {/* Direct Messages Button */}
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "group relative flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-indigo-500 hover:rounded-[16px] transition-all overflow-hidden",
              params?.teamId === undefined && "bg-indigo-500 rounded-[16px]"
            )}
            onClick={navigateToDirectMessages}
          >
            <Image
              src="/team-connect-logo.png"
              alt="Direct Messages"
              width={30}
              height={30}
              className="object-cover"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          Direct Messages
        </TooltipContent>
      </Tooltip>

      <Separator className="h-[2px] w-8 bg-[#2D2F32] rounded-full mx-auto" />

      {/* Team List */}
      <div className="flex-1 w-full overflow-y-auto space-y-2 px-2">
        {teams.map((team) => (
          <Tooltip key={team.id} delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "group relative flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-indigo-500 hover:rounded-[16px] transition-all overflow-hidden",
                  params?.teamId === team.id && "bg-indigo-500 rounded-[16px]"
                )}
                onClick={() => navigateToTeam(team.id)}
              >
                {team.image ? (
                  <Image
                    src={team.image}
                    alt={team.name}
                    width={30}
                    height={30}
                    className="object-cover"
                  />
                ) : (
                  <span className="font-semibold text-lg text-white">
                    {team.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              {team.name}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-2 w-full space-y-2">
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-emerald-500 hover:rounded-[16px] transition-all"
            >
              <Plus className="w-5 h-5 text-emerald-500 group-hover:text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            Create a team
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-indigo-500 hover:rounded-[16px] transition-all"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            User Settings
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
} 
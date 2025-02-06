"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Plus, Settings, Users } from "lucide-react";

import { cn } from "@/shared/utils/utils";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { CreateTeamModal } from "@/features/teams/modal/create-team-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export function TeamSidebar() {
  const router = useRouter();
  const params = useParams();
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  const navigateToDirectMessages = () => {
    router.push("/channels/me");
  };

  const getImageUrl = (icon: string) => {
    if (!icon) return "/placeholder-team.png";
    if (icon.startsWith("http")) return icon;
    return `${BASE_URL}/uploads/${icon}`;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center space-y-4 py-3 w-[72px] h-full bg-[#1E1F22]">
        {/* Direct Messages Button */}
        <div className="relative group w-[48px]">
          <div className="absolute left-0 w-1 h-[8px] bg-white rounded-r-full transition-all duration-200 -translate-y-1/2 top-1/2 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:h-[20px]" />
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "relative flex items-center justify-center w-[48px] h-[48px] rounded-[24px] bg-[#313338] hover:bg-indigo-500 transition-all duration-200 hover:rounded-[16px]",
                  params?.teamId === undefined && "bg-indigo-500 rounded-[16px]"
                )}
                onClick={navigateToDirectMessages}
              >
                <Users className="w-7 h-7 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Direct Messages
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="h-[2px] w-8 bg-[#2D2F32] rounded-full mx-auto" />

        {/* Team List */}
        <div className="flex-1 w-full overflow-y-auto space-y-3 px-3 scrollbar-hide">
          {Array.isArray(teams) &&
            teams.map((team) => (
              <div key={team.id} className="relative group w-[48px]">
                <div className="absolute left-0 w-1 h-[8px] bg-white rounded-r-full transition-all duration-200 -translate-y-1/2 top-1/2 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:h-[20px]" />
                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "relative flex items-center justify-center w-[48px] h-[48px] rounded-[24px] bg-[#313338] hover:bg-indigo-500 transition-all duration-200 hover:rounded-[16px] p-0",
                        params?.teamId === team.id &&
                          "bg-indigo-500 rounded-[16px]"
                      )}
                      onClick={() => console.log("Switch to team:", team.id)}
                    >
                      {team.icon ? (
                        <div className="w-[48px] h-[48px] overflow-hidden rounded-[inherit]">
                          <Image
                            src={getImageUrl(team.icon)}
                            alt={team.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xl">
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {team.name}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="px-3 w-full space-y-3">
          <div className="relative group w-[48px]">
            <div className="absolute left-0 w-1 h-[8px] bg-white rounded-r-full transition-all duration-200 -translate-y-1/2 top-1/2 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:h-[20px]" />
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative flex items-center justify-center w-[48px] h-[48px] rounded-[24px] bg-[#313338] hover:bg-emerald-500 transition-all duration-200 hover:rounded-[16px]"
                  onClick={() => setIsCreateTeamModalOpen(true)}
                >
                  <Plus className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                Create a team
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="relative group w-[48px]">
            <div className="absolute left-0 w-1 h-[8px] bg-white rounded-r-full transition-all duration-200 -translate-y-1/2 top-1/2 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:h-[20px]" />
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative flex items-center justify-center w-[48px] h-[48px] rounded-[24px] bg-[#313338] hover:bg-indigo-500 transition-all duration-200 hover:rounded-[16px]"
                >
                  <Settings className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                User Settings
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
      />
    </TooltipProvider>
  );
}

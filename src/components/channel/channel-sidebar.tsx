"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronDown, Hash, Plus, Settings, Volume2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTeamStore } from "@/store/features/team-store"
import { useChannelStore } from "@/store/features/channel-store"
import { channelAPI } from "@/services/api/channel"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function ChannelSidebar() {
  const router = useRouter()
  const params = useParams()
  const { activeTeam } = useTeamStore()
  const { categories, setCategories, activeChannel, setActiveChannel } = useChannelStore()

  useEffect(() => {
    if (activeTeam) {
      const fetchCategories = async () => {
        try {
          const categories = await channelAPI.getCategories(activeTeam.id)
          setCategories(categories)
        } catch (error) {
          console.error("Failed to fetch categories:", error)
        }
      }

      fetchCategories()
    }
  }, [activeTeam, setCategories])

  useEffect(() => {
    if (params?.channelId) {
      const fetchChannelDetails = async () => {
        try {
          const channel = await channelAPI.getChannel(params.channelId as string)
          setActiveChannel(channel)
        } catch (error) {
          console.error("Failed to fetch channel details:", error)
        }
      }

      fetchChannelDetails()
    }
  }, [params?.channelId, setActiveChannel])

  const navigateToChannel = (channelId: string) => {
    router.push(`/channels/${activeTeam?.id}/${channelId}`)
  }

  if (!activeTeam) return null

  return (
    <div className="flex flex-col w-60 bg-[#2B2D31]">
      {/* Team Header */}
      <Button
        variant="ghost"
        className="w-full h-12 px-4 rounded-none border-b border-[#1E1F22] hover:bg-[#35373C] flex items-center justify-between"
      >
        <span className="font-semibold text-white truncate">{activeTeam.name}</span>
        <ChevronDown className="w-4 h-4 text-[#B5BAC1]" />
      </Button>

      {/* Channels */}
      <ScrollArea className="flex-1 px-2">
        <div className="mt-4 space-y-4">
          {categories.map((category) => (
            <Collapsible key={category.id} defaultOpen>
              <CollapsibleTrigger className="flex items-center gap-1 px-1 w-full hover:text-white">
                <ChevronDown className="w-3 h-3 text-[#B5BAC1]" />
                <span className="text-xs font-semibold uppercase text-[#B5BAC1]">
                  {category.name}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-[2px]">
                {category.channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={cn(
                      "w-full h-8 px-2 rounded-md group relative flex items-center hover:bg-[#35373C]",
                      params?.channelId === channel.id && "bg-[#35373C] text-white"
                    )}
                    onClick={() => navigateToChannel(channel.id)}
                  >
                    {channel.type === "TEXT" ? (
                      <Hash className="w-4 h-4 text-[#949BA4] mr-2 flex-shrink-0" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#949BA4] mr-2 flex-shrink-0" />
                    )}
                    <span className="truncate text-sm text-[#949BA4] group-hover:text-white">
                      {channel.name}
                    </span>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      {/* User Area */}
      <div className="mt-auto p-2 bg-[#232428]">
        <Button
          variant="ghost"
          className="w-full h-[52px] px-2 rounded-md hover:bg-[#35373C] flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Username</p>
            <p className="text-xs text-[#B5BAC1] truncate">Online</p>
          </div>
          <Settings className="w-4 h-4 text-[#B5BAC1]" />
        </Button>
      </div>
    </div>
  )
} 
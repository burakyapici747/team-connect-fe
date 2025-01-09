"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useFriendStore } from "@/store/features/friend-store"
import { friendAPI } from "@/services/api/friend"

export function DirectMessagesSidebar() {
  const router = useRouter()
  const { conversations, setConversations, setActiveConversation } = useFriendStore()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await friendAPI.getConversations()
        setConversations(conversations)
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      }
    }

    fetchConversations()
  }, [setConversations])

  const handleConversationClick = (conversation: any) => {
    setActiveConversation(conversation)
    router.push(`/channels/@me/${conversation.id}`)
  }

  return (
    <div className="flex flex-col h-full bg-[#2B2D31] w-60">
      {/* Header */}
      <div className="flex items-center p-4 h-12 shadow-sm">
        <input
          type="text"
          placeholder="Find a conversation"
          className="w-full px-2 py-1 text-sm bg-[#1E1F22] text-white rounded focus:outline-none"
        />
      </div>

      {/* Friends Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 py-1 mx-2 mt-2 text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
        onClick={() => router.push("/channels/@me")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
            fill="currentColor"
          />
        </svg>
        <span>Friends</span>
      </Button>

      {/* Direct Messages */}
      <div className="flex items-center justify-between px-4 py-2 mt-4">
        <span className="text-xs font-semibold text-[#B5BAC1] uppercase">Direct Messages</span>
        <Button
          variant="ghost"
          size="icon"
          className="w-4 h-4 text-[#B5BAC1] hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
          </svg>
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        {conversations.map((conversation) => {
          const otherParticipant =
            conversation.participantOne.id === "currentUserId"
              ? conversation.participantTwo
              : conversation.participantOne

          return (
            <Button
              key={conversation.id}
              variant="ghost"
              className="flex items-center w-full gap-3 px-2 py-1 mb-1 text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#5865F2]">
                  {/* Avatar would go here */}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23A559] rounded-full border-2 border-[#2B2D31]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium truncate">{otherParticipant.username}</div>
                {conversation.lastMessage && (
                  <div className="text-xs text-[#B5BAC1] truncate">
                    {conversation.lastMessage.content}
                  </div>
                )}
              </div>
            </Button>
          )
        })}
      </ScrollArea>
    </div>
  )
} 
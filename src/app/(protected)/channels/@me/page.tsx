"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFriendStore } from "@/store/features/friend-store"
import { friendAPI } from "@/services/api/friend"
import { FriendRequest } from "@/types/friend"

export default function FriendsPage() {
  const { friends, friendRequests, setFriends, setFriendRequests } = useFriendStore()
  const [activeTab, setActiveTab] = useState("online")

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friends = await friendAPI.getFriends()
        setFriends(friends)
      } catch (error) {
        console.error("Failed to fetch friends:", error)
      }
    }

    const fetchFriendRequests = async () => {
      try {
        const requests = await friendAPI.getFriendRequests()
        setFriendRequests(requests)
      } catch (error) {
        console.error("Failed to fetch friend requests:", error)
      }
    }

    fetchFriends()
    fetchFriendRequests()
  }, [setFriends, setFriendRequests])

  const handleAcceptRequest = async (request: FriendRequest) => {
    try {
      await friendAPI.acceptFriendRequest(request.id)
      setFriendRequests(friendRequests.filter((r) => r.id !== request.id))
      // Refresh friends list
      const friends = await friendAPI.getFriends()
      setFriends(friends)
    } catch (error) {
      console.error("Failed to accept friend request:", error)
    }
  }

  const handleRejectRequest = async (request: FriendRequest) => {
    try {
      await friendAPI.rejectFriendRequest(request.id)
      setFriendRequests(friendRequests.filter((r) => r.id !== request.id))
    } catch (error) {
      console.error("Failed to reject friend request:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 h-12 border-b border-[#1E1F22]">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill="#B5BAC1"
            />
          </svg>
          <span className="text-white font-semibold">Friends</span>
        </div>
        <div className="h-6 w-[1px] bg-[#3F4147] mx-4" />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger
              value="online"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              Online
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              Pending ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="blocked"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              Blocked
            </TabsTrigger>
          </TabsList>
          <Button
            variant="default"
            className="ml-auto bg-[#248046] hover:bg-[#1A6334] text-white"
          >
            Add Friend
          </Button>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4">
        <TabsContent value="online" className="m-0">
          {friends
            .filter((friend) => friend.participantTwo.status === "online")
            .map((friend) => (
              <FriendItem
                key={friend.id}
                user={friend.participantTwo}
                type="friend"
              />
            ))}
        </TabsContent>

        <TabsContent value="all" className="m-0">
          {friends.map((friend) => (
            <FriendItem
              key={friend.id}
              user={friend.participantTwo}
              type="friend"
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          {friendRequests.map((request) => (
            <FriendItem
              key={request.id}
              user={request.type === "INCOMING" ? request.sender : request.receiver}
              type="request"
              request={request}
              onAccept={() => handleAcceptRequest(request)}
              onReject={() => handleRejectRequest(request)}
            />
          ))}
        </TabsContent>

        <TabsContent value="blocked" className="m-0">
          {/* Blocked users would go here */}
        </TabsContent>
      </ScrollArea>
    </div>
  )
}

function FriendItem({
  user,
  type,
  request,
  onAccept,
  onReject,
}: {
  user: any
  type: "friend" | "request"
  request?: FriendRequest
  onAccept?: () => void
  onReject?: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 mb-2 rounded hover:bg-[#35373C]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#5865F2]">
            {/* Avatar would go here */}
          </div>
          {type === "friend" && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23A559] rounded-full border-2 border-[#2B2D31]" />
          )}
        </div>
        <div>
          <div className="text-white font-medium">{user.username}</div>
          {type === "friend" && (
            <div className="text-sm text-[#B5BAC1]">
              {user.status === "online" ? "Online" : "Offline"}
            </div>
          )}
          {type === "request" && request && (
            <div className="text-sm text-[#B5BAC1]">
              {request.type === "INCOMING" ? "Incoming Friend Request" : "Outgoing Friend Request"}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {type === "friend" && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </>
        )}
        {type === "request" && request?.type === "INCOMING" && (
          <>
            <Button
              variant="default"
              className="bg-[#248046] hover:bg-[#1A6334] text-white"
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              className="bg-[#DA373C] hover:bg-[#A12828] text-white"
              onClick={onReject}
            >
              Decline
            </Button>
          </>
        )}
      </div>
    </div>
  )
} 
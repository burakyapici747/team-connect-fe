"use client";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { MessageSquare, MoreVertical, X, Search, Check } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useFriends } from "@/features/friends/hooks/useFriends";
import { FriendshipOutput } from "@/features/friends/api/output/FriendshipOutput";
import { UserPublicOutput } from "@/features/users/api/output/UserPublicOutput";

const blockedUsers = [
  {
    id: 1,
    name: "Blocked User 1",
    avatar: "https://github.com/shadcn.png",
  },
];

interface FriendItemProps {
  name: string;
  status: string;
  avatar: string;
  isPending?: boolean;
  isBlocked?: boolean;
}

interface PendingFriendItemProps {
  name: string;
  avatar: string;
  type: "incoming" | "outgoing";
}

function PendingFriendItem({ name, avatar, type }: PendingFriendItemProps) {
  return (
      <div className="flex items-center p-2.5 hover:bg-[#35373C] rounded-md cursor-pointer group">
        <div className="relative">
          <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-8 h-8 rounded-full"
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-[#F3F4F5] text-sm font-medium">{name}</div>
          <div className="text-[#B5BAC1] text-xs">
            {type === "incoming"
                ? "Incoming Friend Request"
                : "Outgoing Friend Request"}
          </div>
        </div>
        {type === "incoming" ? (
            <div className="flex items-center gap-2">
              <Button
                  variant="ghost"
                  size="icon"
                  className="h-[32px] w-[32px] text-[#B5BAC1] hover:text-white hover:bg-[#248046]"
              >
                <Check className="h-5 w-5" />
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  className="h-[32px] w-[32px] text-[#B5BAC1] hover:text-white hover:bg-[#DA373C]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
        ) : (
            <Button
                variant="ghost"
                size="icon"
                className="h-[32px] w-[32px] text-[#B5BAC1] hover:text-white hover:bg-[#DA373C]"
            >
              <X className="h-5 w-5" />
            </Button>
        )}
      </div>
  );
}

function FriendItem({
                      name,
                      status,
                      avatar,
                      isPending,
                      isBlocked,
                    }: FriendItemProps) {
  return (
      <div className="flex items-center p-2 hover:bg-[#35373C] rounded-md cursor-pointer group">
        <div className="relative">
          <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-8 h-8 rounded-full"
          />
          <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2B2D31] ${
                  status === "online" ? "bg-[#23A559]" : "bg-[#80848E]"
              }`}
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-[#F3F4F5] text-sm font-medium">{name}</div>
          <div className="text-[#B5BAC1] text-xs">
            {isPending
                ? status
                : isBlocked
                    ? "Blocked"
                    : status === "online"
                        ? "Online"
                        : "Offline"}
          </div>
        </div>
        {isPending ? (
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#B5BAC1] hover:text-white hover:bg-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
        ) : (
            !isBlocked && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#B5BAC1] hover:text-white"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#B5BAC1] hover:text-white"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
            )
        )}
      </div>
  );
}

function AddFriendSection() {
  const [username, setUsername] = useState("");

  return (
      <div className="p-4">
        <h2 className="text-white text-lg font-semibold mb-2">ADD FRIEND</h2>
        <p className="text-[#B5BAC1] text-sm mb-4">
          You can add friends with their Discord username.
        </p>
        <div className="flex gap-2">
          <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username"
              className="flex-1 bg-[#1E1F22] border-none text-white placeholder:text-[#B5BAC1]"
          />
          <Button
              variant="default"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
          >
            Send Friend Request
          </Button>
        </div>
        {!username && (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <img
                  src="/wumpus.png"
                  alt="Wumpus"
                  className="w-60 h-60 opacity-60"
              />
              <p className="text-[#B5BAC1] mt-4">
                Wumpus is waiting for friends. But not forced!
              </p>
            </div>
        )}
      </div>
  );
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const {
    currentUserFriends,
    isLoadingCurrentUserFriends,
    outgoingFriendRequests,
    isLoadingOutgoingRequests,
    incomingFriendRequests,
    isLoadingIncomingRequests,
  } = useFriends();

  return (
      <div className="flex flex-col h-full bg-[#313338]">
        <Tabs
            defaultValue="all"
            className="flex-1"
            value={activeTab}
            onValueChange={setActiveTab}
        >
          {/* Header */}
          <div className="flex items-center p-4 h-12 border-b border-[#1E1F22]">
            <div className="flex items-center gap-2">
              <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="#B5BAC1"
                />
              </svg>
              <span className="text-white font-semibold">Friends</span>
            </div>
            <div className="h-6 w-[1px] bg-[#3F4147] mx-4" />

            <div className="flex items-center flex-1">
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
                  Pending
                </TabsTrigger>
                <TabsTrigger
                    value="blocked"
                    className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
                >
                  Blocked
                </TabsTrigger>
                <TabsTrigger
                    value="add-friend"
                    className="text-[#00A8FC] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
                >
                  Add Friend
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Search Bar */}
          {activeTab !== "add-friend" && (
              <div className="px-4 pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B5BAC1]" />
                  <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="pl-10 bg-[#1E1F22] border-none text-white placeholder:text-[#B5BAC1]"
                  />
                </div>
              </div>
          )}

          {/* Content */}
          <ScrollArea className="flex-1">
            <TabsContent value="online" className="m-0 p-4">
              <div className="space-y-1">ONLINE FRIENDS</div>
            </TabsContent>

            <TabsContent value="all" className="m-0 p-4">
              <div className="space-y-1">
                {isLoadingCurrentUserFriends ? (
                    <div>Loading...</div>
                ) : Array.isArray(currentUserFriends) &&
                currentUserFriends.length > 0 ? (
                    currentUserFriends.map((friendship: FriendshipOutput) => {
                      const user: UserPublicOutput = friendship.otherUser;
                      return (
                          <FriendItem
                              key={user.id}
                              name={user.username}
                              status={"online"}
                              avatar={user.profilePicture}
                          />
                      );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center text-center pt-8">
                      <img
                          src="/wumpus.png"
                          alt="Wumpus"
                          className="w-60 h-60 opacity-60"
                      />
                      <p className="text-[#B5BAC1] mt-4">
                        No friends yet. Wumpus is waiting for friends!
                      </p>
                    </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="m-0 p-4">
              <div className="space-y-4">
                {Array.isArray(incomingFriendRequests) &&
                    incomingFriendRequests.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-[#B5BAC1] mb-2 px-2">
                            PENDING — {incomingFriendRequests.length}
                          </h3>
                          <div className="space-y-[2px]">
                            {isLoadingIncomingRequests ? (
                                <div>Loading...</div>
                            ) : (
                                incomingFriendRequests.map(
                                    (friendship: FriendshipOutput) => {
                                      const user: UserPublicOutput = friendship.otherUser;
                                      return (
                                          <PendingFriendItem
                                              key={user.id}
                                              name={user.username}
                                              avatar={user.profilePicture}
                                              type="incoming"
                                          />
                                      );
                                    }
                                )
                            )}
                          </div>
                        </div>
                    )}

                {Array.isArray(outgoingFriendRequests) &&
                    outgoingFriendRequests.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-[#B5BAC1] mb-2 px-2">
                            SENT REQUESTS — {outgoingFriendRequests.length}
                          </h3>
                          <div className="space-y-[2px]">
                            {isLoadingOutgoingRequests ? (
                                <div>Loading...</div>
                            ) : (
                                outgoingFriendRequests.map(
                                    (friendship: FriendshipOutput) => {
                                      const user: UserPublicOutput = friendship.otherUser;
                                      return (
                                          <PendingFriendItem
                                              key={user.id}
                                              name={user.username}
                                              avatar={user.profilePicture}
                                              type="outgoing"
                                          />
                                      );
                                    }
                                )
                            )}
                          </div>
                        </div>
                    )}

                {(!Array.isArray(incomingFriendRequests) ||
                        incomingFriendRequests.length === 0) &&
                    (!Array.isArray(outgoingFriendRequests) ||
                        outgoingFriendRequests.length === 0) && (
                        <div className="flex flex-col items-center justify-center text-center pt-8">
                          <img
                              src="/wumpus.png"
                              alt="Wumpus"
                              className="w-60 h-60 opacity-60"
                          />
                          <p className="text-[#B5BAC1] mt-4">
                            No pending friend requests. Wumpus is waiting on the
                            sidelines...
                          </p>
                        </div>
                    )}
              </div>
            </TabsContent>

            <TabsContent value="blocked" className="m-0 p-4">
              <div className="space-y-1">
                {blockedUsers
                    .filter((f) =>
                        f.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user) => (
                        <FriendItem
                            key={user.id}
                            name={user.name}
                            status="blocked"
                            avatar={user.avatar}
                            isBlocked
                        />
                    ))}
              </div>
            </TabsContent>

            <TabsContent value="add-friend" className="m-0">
              <AddFriendSection />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
  );
}

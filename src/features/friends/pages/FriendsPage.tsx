"use client";

import { useState } from "react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import { useFriends } from "@/features/friends/hooks/useFriends";

import { FriendsHeader } from "@/features/friends/components/FriendsHeader";
import { SearchBar } from "@/features/friends/components/SearchBar";
import { FriendsList } from "@/features/friends/components/FriendsList";
import { PendingRequests } from "@/features/friends/components/PendingRequests";
import { AddFriendSection } from "@/features/friends/components/AddFriendSection";

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
                {/* Header Component */}
                <FriendsHeader activeTab={activeTab} />

                {/* Search Bar Component */}
                {activeTab !== "add-friend" && (
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                )}

                {/* Content */}
                <ScrollArea className="flex-1">
                    <TabsContent value="online" className="m-0 p-4">
                        <div className="space-y-1">ONLINE FRIENDS</div>
                    </TabsContent>

                    <TabsContent value="all" className="m-0 p-4">
                        <FriendsList
                            friends={currentUserFriends}
                            isLoading={isLoadingCurrentUserFriends}
                        />
                    </TabsContent>

                    <TabsContent value="pending" className="m-0 p-4">
                        <PendingRequests
                            incomingRequests={incomingFriendRequests}
                            outgoingRequests={outgoingFriendRequests}
                            isLoadingIncoming={isLoadingIncomingRequests}
                            isLoadingOutgoing={isLoadingOutgoingRequests}
                        />
                    </TabsContent>

                    <TabsContent value="add-friend" className="m-0">
                        <AddFriendSection />
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    );
}
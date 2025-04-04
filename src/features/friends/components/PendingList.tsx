"use client";

import { FriendshipOutput } from "@/features/friends/api/output/FriendshipOutput";
import { UserPublicOutput } from "@/features/users/api/output/UserPublicOutput";
import { PendingFriendItem } from "./PendingFriendItem";

interface PendingListProps {
    title: string;
    requests: FriendshipOutput[] | undefined;
    isLoading: boolean;
    type: "incoming" | "outgoing";
}

export function PendingList({ title, requests, isLoading, type }: PendingListProps) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!Array.isArray(requests) || requests.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xs font-semibold text-[#B5BAC1] mb-2 px-2">
                {title} — {requests.length}
            </h3>
            <div className="space-y-[2px]">
                {requests.map((friendship: FriendshipOutput) => {
                    const user: UserPublicOutput = friendship.otherUser;
                    return (
                        <PendingFriendItem
                            key={user.id}
                            name={user.username}
                            avatar={user.profilePicture}
                            type={type}
                        />
                    );
                })}
            </div>
        </div>
    );
}
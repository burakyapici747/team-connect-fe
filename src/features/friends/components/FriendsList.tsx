"use client";

import { FriendshipOutput } from "@/features/friends/api/output/FriendshipOutput";
import { UserPublicOutput } from "@/features/users/api/output/UserPublicOutput";
import { FriendItem } from "./FriendItem";
import { EmptyState } from "./EmptyState";

interface FriendsListProps {
    friends: FriendshipOutput[] | undefined;
    isLoading: boolean;
}

export function FriendsList({ friends, isLoading }: FriendsListProps) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!Array.isArray(friends) || friends.length === 0) {
        return (
            <EmptyState message="No friends yet. Wumpus is waiting for friends!" />
        );
    }

    return (
        <div className="space-y-1">
            {friends.map((friendship: FriendshipOutput) => {
                const user: UserPublicOutput = friendship.otherUser;
                return (
                    <FriendItem
                        key={user.id}
                        name={user.username}
                        status={"online"}
                        avatar={user.profilePicture}
                    />
                );
            })}
        </div>
    );
}
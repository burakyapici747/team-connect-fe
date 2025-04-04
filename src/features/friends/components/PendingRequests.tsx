"use client";

import { FriendshipOutput } from "@/features/friends/api/output/FriendshipOutput";
import { PendingList } from "./PendingList";
import { EmptyState } from "./EmptyState";

interface PendingRequestsProps {
    incomingRequests: FriendshipOutput[] | undefined;
    outgoingRequests: FriendshipOutput[] | undefined;
    isLoadingIncoming: boolean;
    isLoadingOutgoing: boolean;
}

export function PendingRequests({ incomingRequests, outgoingRequests, isLoadingIncoming, isLoadingOutgoing }: PendingRequestsProps) {
    const hasIncoming = Array.isArray(incomingRequests) && incomingRequests.length > 0;
    const hasOutgoing = Array.isArray(outgoingRequests) && outgoingRequests.length > 0;

    if (!hasIncoming && !hasOutgoing) {
        return (
            <EmptyState message="No pending friend requests. Wumpus is waiting on the sidelines..." />
        );
    }

    return (
        <div className="space-y-4">
            {hasIncoming && (
                <PendingList
                    title="PENDING"
                    requests={incomingRequests}
                    isLoading={isLoadingIncoming}
                    type="incoming"
                />
            )}

            {hasOutgoing && (
                <PendingList
                    title="SENT REQUESTS"
                    requests={outgoingRequests}
                    isLoading={isLoadingOutgoing}
                    type="outgoing"
                />
            )}
        </div>
    );
}
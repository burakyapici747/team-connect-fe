import {UserPublicOutput} from "@/features/users/api/output/UserPublicOutput";

enum FriendshipStatus {
    REQ_UID1 = "REQ_UID1",
    REQ_UID2 = "REQ_UID2",
    FRIEND = "FRIEND"
}

export interface FriendshipOutput {
    currentUser: UserPublicOutput,
    otherUser: UserPublicOutput,
    status: FriendshipStatus,
    createdAt: string,
    updatedAt: string
}

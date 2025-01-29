import { User } from "../index";

export type FriendStatus = "FRIEND" | "FRIEND" | "BLOCKED";

export interface RelationshipsOutput {
  id: string;
  currentUser: User;
  otherUser: User;
  createdAt: string;
  updatedAt: string;
}

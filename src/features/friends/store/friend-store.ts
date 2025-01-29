import {create} from "zustand";
import {RelationshipsOutput} from "@/core/types/friend";

interface FriendStore {
    relationships: RelationshipsOutput[]
    incomingRelationships: RelationshipsOutput[]
    outgoingRelationships: RelationshipsOutput[]
    setRelationships: (relationships: RelationshipsOutput[]) => void
    setIncomingRelationships: (relationships: RelationshipsOutput[]) => void
    setOutgoingRelationships: (relationships: RelationshipsOutput[]) => void
}

export const useFriendStore = create<FriendStore>((set) => ({
    relationships: [],
    incomingRelationships: [],
    outgoingRelationships: [],
    setRelationships: (relationships) => set({relationships}),
    setIncomingRelationships: (relationships) => set({incomingRelationships: relationships}),
    setOutgoingRelationships: (relationships) => set({outgoingRelationships: relationships}),
}))
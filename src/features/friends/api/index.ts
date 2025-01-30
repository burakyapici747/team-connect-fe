import {RelationshipsOutput} from "@/core/types/friend";
import {fetchAPI} from "../../../shared/api/genericAPI";

export const friendAPI = {
    getRelationships: async () => {
        return fetchAPI<RelationshipsOutput[]>("/users/me/relationships", {
            method: "GET",
        });
    },
    getIncomingRelationships: async () => {
        return fetchAPI<RelationshipsOutput[]>("/users/me/relationships/incoming-requests", {
            method: "GET",
        });
    },
    getOutgoingRelationships: async () => {
        return fetchAPI<RelationshipsOutput[]>("/users/me/relationships/outgoing-requests", {
            method: "GET",
        });
    },
};

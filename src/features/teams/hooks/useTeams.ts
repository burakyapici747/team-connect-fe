import {useQuery} from "@tanstack/react-query";
import {getCurrentUserTeams} from "@/features/teams/api";
import {TeamPublicOutput} from "@/features/teams/api/output/TeamPublicOutput";
import {ApiResponse} from "@/shared/api/response/response";

export const useTeams = () => {
    const currentUserTeamsQuery = useQuery<ApiResponse<TeamPublicOutput[]>, Error, TeamPublicOutput[]>({
        queryKey: ['currentUserTeams'],
        queryFn: getCurrentUserTeams,
        select: (response) => {
            if (response.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        },
        retry: false,
        staleTime: Infinity
    });

    return {
        currentUserTeams: currentUserTeamsQuery.data,
        isLoading: currentUserTeamsQuery.isLoading,
        error: currentUserTeamsQuery.error
    };
};

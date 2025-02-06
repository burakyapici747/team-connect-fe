import {useQuery} from "@tanstack/react-query";
import {getCurrentUserTeams} from "@/features/teams/api";

export const useTeams = () => {
    const currentUserTeamsQuery = useQuery({
        queryKey: ['currentUserTeams'],
        queryFn: getCurrentUserTeams,
        retry: false,
        staleTime: Infinity
    });

    return {
        currentUserTeams: currentUserTeamsQuery.data,
        isLoading: currentUserTeamsQuery.isLoading,
        error: currentUserTeamsQuery.error
    }
};
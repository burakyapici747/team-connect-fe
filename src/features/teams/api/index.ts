import {ApiResponse} from "@/shared/api/response/response";
import {TeamPublicOutput} from "@/features/teams/api/output/TeamPublicOutput";
import {getSingleWithRequestParameter, postSingleRequestParameter} from "@/shared/api/genericAPI";
import {API_ENDPOINTS} from "@/core/config/axios/api-endpoints";
import {TeamCreateInput} from "@/features/teams/api/input/TeamCreateInput";
import {TeamCreateOutput} from "@/features/teams/api/output/TeamCreateOutput";

export const getCurrentUserTeams: () => Promise<ApiResponse<TeamPublicOutput>> = async (): Promise<ApiResponse<TeamPublicOutput>> => {
  return await getSingleWithRequestParameter(API_ENDPOINTS.TEAMS.CURRENT_USER_TEAMS, {});
};

export const createTeam : (
    teamCreateInput: TeamCreateInput,
    file: File
) => Promise<ApiResponse<TeamCreateOutput>> = async (teamCreateInput: TeamCreateInput, file: File): Promise<ApiResponse<TeamCreateOutput>> => {
  const formData = new FormData();
  formData.append("input", JSON.stringify(teamCreateInput));
  formData.append("file", file);

  return await postSingleRequestParameter(
      API_ENDPOINTS.TEAMS.CREATE_TEAM,
      formData,
      {},
      {
        headers:{
          "Content-Type": "multipart/form-data"
        },
      }
  );
};
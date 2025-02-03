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

// export const teamAPI = {
//   getTeams: async (): Promise<Team[]> => {
//     const response = await fetchAPI("/users/me/teams");
//     if (!Array.isArray(response)) {
//       throw new Error("Invalid response format from /teams endpoint");
//     }
//     return response
//   },
//
//   createTeam: async (
//     input: TeamCreateInput,
//     file: File
//   ): Promise<ResponseWrapper<TeamCreateOutput>> => {
//     const formData = new FormData();
//     formData.append(
//       "input",
//       new Blob([JSON.stringify(input)], { type: "application/json" })
//     );
//     formData.append("file", file);
//
//     const response = await fetch(
//       `${
//         process.env.NEXT_PUBLIC_API_URL || "http://192.168.3.50:8080"
//       }/v1/api/teams`,
//       {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       }
//     );
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(errorText || "Failed to create team");
//     }
//
//     return response.json();
//   },
// };

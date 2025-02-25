import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import {
  getAllWithPathVariable,
  postSingleWithPathVariable,
} from "@/shared/api/genericAPI";
import { API_ENDPOINTS } from "@/core/config/axios/api-endpoints";

export interface MessageQueryParams {
  page?: number;
  size?: number;
  before?: string;
  after?: string;
}

export const getMessagesByChannelId = async (
  channelId: string,
  params: MessageQueryParams = { page: 0, size: 100 }
): Promise<ApiResponse<MessageOutput[]>> => {
  return getAllWithPathVariable<MessageOutput>(
    "",
    API_ENDPOINTS.MESSAGES.DM_CHANNEL_MESSAGES,
    { channelId },
    { params }
  );
};

export const sendMessage: <T extends object>(
  channelId: string,
  requestBody: T
) => Promise<ApiResponse<void>> = async <T extends object>(
  channelId: string,
  requestBody: T
): Promise<ApiResponse<void>> => {
  return postSingleWithPathVariable<T, void>(
    "",
    requestBody,
    API_ENDPOINTS.MESSAGES.SEND_MESSAGE,
    { channelId }
  );
};

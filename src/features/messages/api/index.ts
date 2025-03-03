import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import {
  getAllWithPathVariable,
  postSingleWithPathVariable,
} from "@/shared/api/genericAPI";
import { API_ENDPOINTS } from "@/core/config/axios/api-endpoints";

export const getMessagesByChannelId = async (
  channelId: string,
): Promise<ApiResponse<MessageOutput[]>> => {
  return getAllWithPathVariable<MessageOutput>(
    "",
    API_ENDPOINTS.MESSAGES.DM_CHANNEL_MESSAGES,
    { channelId }
  );
};

export const getMessagesByChannelIdWithBefore = async (
    channelId: string,
    beforeMessageId: string,
): Promise<ApiResponse<MessageOutput[]>> => {
  return getAllWithPathVariable<MessageOutput>(
    "",
    API_ENDPOINTS.MESSAGES.DM_CHANNEL_MESSAGES,
    { channelId },
    { params: { before: beforeMessageId } }
  );
};

export const sendMessage: <T extends object>(
  channelId: string,
  requestBody: T
) => Promise<ApiResponse<MessageOutput>> = async <T extends object>(
  channelId: string,
  requestBody: T
): Promise<ApiResponse<MessageOutput>> => {
  return postSingleWithPathVariable<T, MessageOutput>(
    "",
    requestBody,
    API_ENDPOINTS.MESSAGES.SEND_MESSAGE,
    { channelId }
  );
};

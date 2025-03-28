import { ApiResponse } from "@/shared/api/response/response";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import { getAllWithPathVariable, postSingleWithPathVariable } from "@/shared/api/genericAPI";
import { API_ENDPOINTS } from "@/core/config/axios/api-endpoints";
import {MessageSendInput} from "@/features/messages/api/input/MessageSendInput";

export const getMessagesByChannelId = async (
  channelId: string,
  params: { before?: string, after?: string, limit?: number }
): Promise<ApiResponse<MessageOutput[]>> => {
  return getAllWithPathVariable<MessageOutput>(
      "",
      API_ENDPOINTS.MESSAGES.DM_CHANNEL_MESSAGES,
      { channelId },
      { params: { before: params.before, after: params.after, limit: params.limit } }
  );
};

export const getMessagesByChannelIdWithBefore = async (
    channelId: string,
    params: { before?: string, after?: string, limit?: number }
): Promise<ApiResponse<MessageOutput[]>> => {
  return getAllWithPathVariable<MessageOutput>(
      "",
      API_ENDPOINTS.MESSAGES.DM_CHANNEL_MESSAGES,
      { channelId },
      { params: { before: params.before, after: params.after, limit: params.limit } }
  );
};

export const sendMessage: (
  channelId: string,
  requestBody: MessageSendInput
) => Promise<ApiResponse<MessageOutput>> = async (
  channelId: string,
  requestBody: MessageSendInput
): Promise<ApiResponse<MessageOutput>> => {
  debugger;
  return postSingleWithPathVariable<MessageSendInput, MessageOutput>(
    "",
    requestBody,
    API_ENDPOINTS.MESSAGES.SEND_MESSAGE,
    { channelId }
  );
};

import {ApiResponse} from "@/shared/api/response/response";
import {MessageOutput} from "@/features/messages/api/output/MessageOutput";
import {getAllWithPathVariable} from "@/shared/api/genericAPI";
import {API_ENDPOINTS} from "@/core/config/axios/api-endpoints";

export const getMessagesByChannelId: (channelId: string) => Promise<ApiResponse<MessageOutput[]>> = async (
    channelId: string
): Promise<ApiResponse<MessageOutput[]>> => {
    return getAllWithPathVariable<MessageOutput>(
        API_ENDPOINTS.MESSAGES.DM_CHANNEL_MESSAGES,
        "/{channelId}",
        { channelId }
    );
};


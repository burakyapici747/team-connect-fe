"use client";

import React, { useEffect } from "react";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useWebSocket } from "@/features/messages/hooks/useWebsocket";
import MessageHeader from "@/features/messages/components/MessageHeader";
import MessageList from "@/features/messages/components/MessageList";
import MessageInput from "@/features/messages/components/MessageInput";
import MessageTestControls from "@/features/messages/components/MessageTestControls";
import EmptyState from "@/shared/components/layout/EmptyState";
import { useRouter } from "next/navigation";

export default function DirectMessagePage({ params }: { params: { channelId: string } }) {
  const router = useRouter();
  const {
    messages,
    hasNextPage,
    isFetching,
    isLoading,
    fetchError,
    isLoadingOlderMessages,
    loadOlderMessages,
    loadOlderMessagesError,
    addTestMessages,
  } = useMessages(params.channelId);

  const { error: wsError } = useWebSocket({ channelId: params.channelId });

  useEffect(() => {
    if (wsError) {
      console.error("WebSocket connection error:", wsError);
    }
  }, [wsError]);

  useEffect(() => {
    if (fetchError && fetchError.status === 404) {
      router.push("/channels/me");
    }
  }, [fetchError, router]);

  return (
      <div className="flex h-full w-full">
        {/* Main chat area */}
        <div className="flex flex-col h-full bg-[#313338] flex-1">
          {/* Header */}
          <MessageHeader />

          {/* Message List */}
          <div className="flex-1 overflow-hidden">
            <MessageList
                messages={messages}
                hasNextPage={hasNextPage}
                isLoading={isLoading}
                fetchError={fetchError}
                isLoadingOlderMessages={isLoadingOlderMessages}
                loadOlderMessages={loadOlderMessages}
                loadOlderMessagesError={loadOlderMessagesError}
            />
          </div>

          {/* Test Controls - Sadece geliştirme ortamında göster */}
          {process.env.NODE_ENV === "development" && (
              <MessageTestControls addTestMessages={addTestMessages} />
          )}

          {/* Message Input */}
          <MessageInput channelId={params.channelId} />
        </div>
      </div>
  );
}
"use client";

import React from "react";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useWebSocket } from "@/features/messages/hooks/useWebsocket";
import MessageHeader from "@/features/messages/components/MessageHeader";
import MessageList from "@/features/messages/components/MessageList";
import MessageInput from "@/features/messages/components/MessageInput";
import MessageTestControls from "@/features/messages/components/MessageTestControls";

export default function DirectMessagePage({ params }: { params: { channelId: string } }) {
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

  return (
      <div className="flex h-full" style={{ background: "var(--discord-bg)" }}>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <MessageHeader />

          {/* Message List */}
          <MessageList
              messages={messages}
              hasNextPage={hasNextPage}
              isLoading={isLoading}
              fetchError={fetchError}
              isLoadingOlderMessages={isLoadingOlderMessages}
              loadOlderMessages={loadOlderMessages}
              loadOlderMessagesError={loadOlderMessagesError}
          />

          {/* Test Controls */}
          <MessageTestControls addTestMessages={addTestMessages} />

          {/* Message Input */}
          <MessageInput channelId={params.channelId} />
        </div>
      </div>
  );
}
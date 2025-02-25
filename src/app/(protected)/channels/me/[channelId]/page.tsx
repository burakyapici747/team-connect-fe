"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { UserSidebar } from "@/features/channels/components/user-sidebar";
import { GroupSidebar } from "@/features/channels/components/group-sidebar";
import {
  PlusCircle,
  Smile,
  GiftIcon,
  Paperclip,
  MoreHorizontal,
  Laugh,
  Edit2,
} from "lucide-react";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useWebSocket } from "@/features/messages/hooks/useWebsocket";

export default function DirectMessagePage({
  params,
}: {
  params: { channelId: string };
}) {
  const [messageInput, setMessageInput] = useState("");
  const {
    messages,
    isLoading,
    fetchError,
    sendMessage,
    sendMessageError,
    fetchPreviousMessages,
    isFetchingPreviousPage,
    hasPreviousPage,
  } = useMessages(params.channelId);

  const { error: wsError } = useWebSocket({ channelId: params.channelId });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isNearTop, setIsNearTop] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessage({ content: messageInput });
      setMessageInput("");
      setShouldScrollToBottom(true);
    } catch (error) {
      console.error("Mesaj gönderme işlemi başarısız:", error);
    }
  };

  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    if (messagesEndRef.current && !isLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [isLoading]);

  const handleScroll = useCallback(() => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldScrollToBottom(isAtBottom);

      const isAtTop = scrollTop < 100;
      setIsNearTop(isAtTop);

      setScrollPosition(scrollTop);
    }
  }, []);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener("scroll", handleScroll);
      return () => messageList.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    const loadPreviousMessages = async () => {
      if (isNearTop && hasPreviousPage && !isFetchingPreviousPage) {
        const currentScrollHeight = messageListRef.current?.scrollHeight || 0;

        await fetchPreviousMessages();

        if (messageListRef.current) {
          const newScrollHeight = messageListRef.current.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeight;
          messageListRef.current.scrollTop = heightDifference + 10; // Biraz boşluk bırak
        }
      }
    };

    loadPreviousMessages();
  }, [
    isNearTop,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousMessages,
  ]);

  const isFirstMessageInGroup = (index: number) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    return currentMessage.author.id !== previousMessage.author.id;
  };

  const sortedMessages = Array.isArray(messages)
    ? [...messages].sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
      })
    : [];

  return (
    <div className="flex h-full" style={{ background: "var(--discord-bg)" }}>
      {/* Sol Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 h-12 border-b"
          style={{ borderColor: "var(--discord-tertiary-bg)" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ background: "var(--discord-primary)" }}
              >
                U
              </div>
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{
                  background: "var(--discord-online)",
                  borderColor: "var(--discord-bg)",
                }}
              />
            </div>
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--discord-text)" }}
            >
              {"Uçan Kuş"}
            </span>
          </div>
        </div>

        {/* Mesaj Listesi */}
        <div
          ref={messageListRef}
          className="flex-1 px-4 overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="py-4">
            {/* Önceki mesajları yükleme göstergesi */}
            {isFetchingPreviousPage && (
              <div className="flex justify-center py-4">
                <span className="text-sm text-gray-400">
                  Önceki mesajlar yükleniyor...
                </span>
              </div>
            )}

            {/* Daha fazla mesaj yükleme butonu */}
            {hasPreviousPage && !isFetchingPreviousPage && (
              <div className="flex justify-center py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchPreviousMessages()}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Daha fazla mesaj yükle
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center py-4">
                <span className="text-sm text-gray-400">
                  Mesajlar yükleniyor...
                </span>
              </div>
            )}
            {fetchError && (
              <div className="flex justify-center py-4">
                <span className="text-sm text-red-400">
                  Mesajlar yüklenirken hata oluştu.
                </span>
              </div>
            )}
            {sortedMessages.length > 0
              ? sortedMessages.map((message, index) => {
                  const showFullHeader = isFirstMessageInGroup(index);

                  return (
                    <div
                      key={message.id}
                      className={`group relative flex items-start gap-4 px-2 ${
                        !showFullHeader ? "mt-0.5" : "mt-[17px]"
                      }`}
                    >
                      {showFullHeader ? (
                        <div
                          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                          style={{ background: "var(--discord-primary)" }}
                        >
                          {message.author.username.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-10 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0 py-0.5 relative">
                        {showFullHeader && (
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[0.8125rem] font-medium hover:underline cursor-pointer"
                              style={{ color: "var(--discord-text)" }}
                            >
                              {message.author.id === "currentUserId"
                                ? "You"
                                : message.author.username}
                            </span>
                            <span
                              className="text-[0.6875rem]"
                              style={{ color: "var(--discord-text-muted)" }}
                            >
                              {new Date(message.timestamp).toLocaleDateString(
                                "tr-TR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        )}
                        <div className="relative">
                          <p
                            className={`break-words text-[0.8125rem] leading-[1.1875rem] text-[var(--discord-text)]`}
                          >
                            {message.content}
                          </p>
                          {!showFullHeader && (
                            <span className="absolute top-1 -left-12 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                              {new Date(message.timestamp).toLocaleTimeString(
                                "tr-TR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover ile gösterilen aksiyon butonları */}
                      <div className="absolute right-2 top-0 hidden group-hover:flex items-center gap-0.5 py-1 px-0.5 rounded bg-[#313338] shadow-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-8 hover:bg-[#2E3035]"
                          style={{ color: "var(--discord-text-muted)" }}
                        >
                          <Laugh className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-8 hover:bg-[#2E3035]"
                          style={{ color: "var(--discord-text-muted)" }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-8 hover:bg-[#2E3035]"
                          style={{ color: "var(--discord-text-muted)" }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              : !isLoading && (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-gray-400">
                      Henüz mesaj bulunmamaktadır.
                    </span>
                  </div>
                )}
            {/* Mesajların sonuna kaydırmak için görünmez bir element */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Mesaj Gönderme Alanı */}
        <div className="px-4 pb-6">
          <form onSubmit={handleSendMessage}>
            <div
              className="flex items-center gap-2 p-2 rounded-lg relative"
              style={{ background: "var(--discord-input-bg)" }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:text-white transition-colors duration-200"
                style={{ color: "var(--discord-text-muted)" }}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Bir mesaj yazın"
                className="flex-1 bg-transparent focus:outline-none text-[0.875rem] leading-[1.25rem] placeholder:text-[--discord-text-muted]"
                style={{ color: "var(--discord-text)" }}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:text-white transition-colors duration-200"
                  style={{ color: "var(--discord-text-muted)" }}
                >
                  <GiftIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:text-white transition-colors duration-200"
                  style={{ color: "var(--discord-text-muted)" }}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:text-white transition-colors duration-200"
                  style={{ color: "var(--discord-text-muted)" }}
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

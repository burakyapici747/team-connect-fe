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

export default function DirectMessagePage({ params }: { params: { channelId: string }; }) {
  const [messageInput, setMessageInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadingObserverRef = useRef<IntersectionObserver | null>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef<number>(0);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [messageStart, setMessageStart] = useState(1);
  const [messageEnd, setMessageEnd] = useState(50);

  const {
    messages,
    hasNextPage,
    isFetching,
    isLoading,
    fetchError,
    sendMessage,
    fetchNextPage,
    isLoadingOlderMessages,
    loadOlderMessages,
    loadOlderMessagesError,
    addTestMessages
  } = useMessages(params.channelId);

  const { error: wsError } = useWebSocket({ channelId: params.channelId });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      setMessageInput("");
      await sendMessage({ content: messageInput });
    } catch (error) {
      console.error("Mesaj gönderme işlemi başarısız:", error);
    }
  };

  const isFirstMessageInGroup = (index: number) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    return currentMessage.author.id !== previousMessage.author.id;
  };

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0 && !isLoading) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [isLoading, messages]);

  useEffect(() => {
    if (messagesContainerRef.current && latestMessageRef.current && isLoadingOlderMessages === false) {
      const scrollPosition = latestMessageRef.current.offsetTop;

      messagesContainerRef.current.scrollTop = scrollPosition;
    }
  }, [isLoadingOlderMessages]);

  // Setup intersection observer for loading older messages
  useEffect(() => {
    // Create the intersection observer to detect when user scrolls up
    const setupObserver = () => {
      if (loadingObserverRef.current) {
        loadingObserverRef.current.disconnect();
      }

      loadingObserverRef.current = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;

            if (entry.isIntersecting && hasNextPage && !isLoadingOlderMessages) {
              console.log("Eski mesajlar yükleniyor...");

              if (messages.length > 0 && messagesContainerRef.current) {
                latestMessageRef.current = document.getElementById(`message-${messages[0].id}`) as HTMLDivElement;
              }

              loadOlderMessages();
            }
          },
          {
            root: messagesContainerRef.current,
            threshold: 0.4,
          }
      );

      // Start observing the trigger element
      if (loadTriggerRef.current && loadingObserverRef.current) {
        loadingObserverRef.current.observe(loadTriggerRef.current);
      }
    };

    setupObserver();

    // Cleanup the observer when component unmounts
    return () => {
      if (loadingObserverRef.current) {
        loadingObserverRef.current.disconnect();
      }
    };
  }, [hasNextPage, isLoadingOlderMessages, loadOlderMessages, messages]);

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
              ref={messagesContainerRef}
              className="flex-1 px-4 overflow-y-auto"
              style={{ scrollBehavior: "smooth" }}
          >
            <div className="py-4">
              {/* Load older messages trigger element */}
              <div
                  ref={loadTriggerRef}
                  className="h-1 w-full"
              />

              {/* Loading indicator for older messages */}
              {isLoadingOlderMessages && (
                  <div className="flex justify-center py-4">
                <span className="text-sm text-gray-400">
                  Daha eski mesajlar yükleniyor...
                </span>
                  </div>
              )}

              {loadOlderMessagesError && (
                  <div className="flex justify-center py-4">
                <span className="text-sm text-red-400">
                  Eski mesajlar yüklenirken hata oluştu.
                </span>
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

              {messages.length > 0
                  ? messages.map((message, index) => {
                    const showFullHeader = isFirstMessageInGroup(index);

                    return (
                        <div
                            key={message.id}
                            id={`message-${message.id}`}
                            className={`group relative flex items-start gap-4 px-2 ${
                                !showFullHeader ? "mt-0.5" : "mt-[17px]"
                            }`}
                        >
                          {showFullHeader ? (
                              <div
                                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                                  style={{ background: "var(--discord-primary)" }}
                              >
                                {message?.author?.username?.charAt(0).toUpperCase()}
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
                              {message.author?.id === "currentUserId"
                                  ? "You"
                                  : message.author?.username}
                            </span>
                                  <span
                                      className="text-[0.6875rem]"
                                      style={{ color: "var(--discord-text-muted)" }}
                                  >
                              {new Date(message?.timestamp * 1000).toLocaleDateString(
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
                                  className={`break-words text-[0.8125rem] leading-[1.1875rem] ${
                                      message.isPending ? "text-gray-400" : "text-[var(--discord-text)]"
                                  }`}
                              >
                                {message.content}
                              </p>
                              {!showFullHeader && (
                                  <span className="absolute top-1 -left-12 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                              {new Date(message.timestamp * 1000).toLocaleTimeString("tr-TR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                              )}
                            </div>
                          </div>

                          {/* Hover ile gösterilen aksiyon butonları */}
                          <div className="absolute right-2 top-0 hidden group-hover:flex items-center gap-0.5 py-1 px-0.5 rounded bg-[#313338] shadow-md">
                            {['laugh', 'edit', 'more'].map((buttonType) => (
                                <Button
                                    key={`${message.id}-${buttonType}`}
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-8 hover:bg-[#2E3035]"
                                    style={{ color: "var(--discord-text-muted)" }}
                                >
                                  {buttonType === 'laugh' && <Laugh className="h-4 w-4" />}
                                  {buttonType === 'edit' && <Edit2 className="h-4 w-4" />}
                                  {buttonType === 'more' && <MoreHorizontal className="h-4 w-4" />}
                                </Button>
                            ))}
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
            </div>
          </div>
          {/* Test Mesajları için kontrol paneli */}
          <div className="flex items-center gap-2 px-4 py-2" style={{ borderTop: "1px solid var(--discord-tertiary-bg)" }}>
            <div className="flex items-center gap-2">
              <input
                  type="number"
                  value={messageStart}
                  onChange={(e) => setMessageStart(parseInt(e.target.value) || 1)}
                  className="w-16 p-1 rounded bg-[var(--discord-input-bg)] text-[var(--discord-text)] border border-[var(--discord-tertiary-bg)]"
                  placeholder="Start"
                  min="1"
              />
              <span className="text-[var(--discord-text-muted)]">-</span>
              <input
                  type="number"
                  value={messageEnd}
                  onChange={(e) => setMessageEnd(parseInt(e.target.value) || 50)}
                  className="w-16 p-1 rounded bg-[var(--discord-input-bg)] text-[var(--discord-text)] border border-[var(--discord-tertiary-bg)]"
                  placeholder="End"
                  min="1"
              />
            </div>
            <button
                onClick={() => addTestMessages(messageStart, messageEnd)}
                className="px-3 py-1 rounded bg-[var(--discord-primary)] text-white text-sm hover:bg-opacity-80"
            >
              Test Mesajları Ekle
            </button>
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

"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import { WebsocketMessageOutput } from "@/features/messages/api/output/WebsocketMessageOutput";

// Extended tip: pending flag eklenmiş
export interface ExtendedMessageOutput extends MessageOutput {
  pending?: boolean;
}

export default function DirectMessagePage({ params }: { params: { channelId: string } }) {
  const { messages, isLoading, fetchError, sendMessage } = useMessages(params.channelId);
  const queryClient = useQueryClient();

  const [isGroupChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Gelen mesaj listesini alıyoruz (optimistik mesajlar da olabilir)
  const messageList: ExtendedMessageOutput[] = messages ?? [];

  // Backend en yeni mesajları ilk sırada döndürüyorsa; listeyi ters çeviriyoruz
  const sortedMessageList = useMemo(() => {
    return messageList.length > 0 ? [...messageList].reverse() : [];
  }, [messageList]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  // Mesaj gruplaması için: Eğer önceki mesaj farklı kullanıcıya aitse ya da arada 5 dakikadan fazla fark varsa,
  // bu mesaj grubun ilk mesajı olarak kabul edilir.
  const isFirstMessageInGroup = (index: number) => {
    if (index === 0) return true;
    const currentMessage = sortedMessageList[index];
    const previousMessage = sortedMessageList[index - 1];
    return (
        currentMessage.author.id !== previousMessage.author.id ||
        new Date(currentMessage.timestamp).getTime() -
        new Date(previousMessage.timestamp).getTime() >
        5 * 60 * 1000
    );
  };

  // WebSocket'ten gelen mesajı cache'deki optimistik mesajla eşleştirip güncelliyoruz.
  const handleMessageReceived = useCallback(
      (message: WebsocketMessageOutput) => {
        console.log("Received message =", message);
        queryClient.setQueryData<ExtendedMessageOutput[]>(
            ["messages", params.channelId],
            (old: ExtendedMessageOutput[] | undefined) => {
              const messages = Array.isArray(old) ? old : [];
              let found = false;
              const updatedMessages = messages.map((m) => {
                if (m.pending && m.content === message.content && m.author.id === message.author.id) {
                  found = true;
                  return { ...message, pending: false }; // Onaylandı, pending kaldırıldı.
                }
                return m;
              });
              // Eğer optimistik mesaj bulunamadıysa, ek olarak mesajı ekleyelim.
              if (!found) {
                return [...updatedMessages, message];
              }
              return updatedMessages;
            }
        );
        // Cache güncellemesinin ardından UI'nın yeniden render olduğundan emin olmak için invalidate de eklenebilir.
        queryClient.invalidateQueries({
          queryKey: ["messages", params.channelId],
          exact: true,
          refetchType: "none",
        });
        scrollToBottom();
      },
      [queryClient, params.channelId]
  );

  useWebSocket({
    channelId: params.channelId,
    onMessageReceived: handleMessageReceived,
  });

  useEffect(() => {
    if (sortedMessageList.length > 0) {
      scrollToBottom();
    }
  }, [sortedMessageList]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Optimistik mesaj oluşturuluyor.
    const optimisticMessage: ExtendedMessageOutput = {
      id: "temp-" + Date.now(),
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
      author: {
        id: "currentUserId",
        username: "You",
        avatarFileId: "",
        avatarFileUrl: "",
      },
      pending: true,
    };

    // Optimistik mesajı cache'e ekliyoruz.
    queryClient.setQueryData<ExtendedMessageOutput[]>(
        ["messages", params.channelId],
        (old: ExtendedMessageOutput[] | undefined) => {
          const messages = Array.isArray(old) ? old : [];
          return [...messages, optimisticMessage];
        }
    );

    try {
      await sendMessage({ content: messageInput.trim() });
      setMessageInput("");
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
      // Hata durumunda, isteğe bağlı olarak optimistik mesajı kaldırabilirsiniz.
    }
  };

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
              <span className="font-semibold text-sm" style={{ color: "var(--discord-text)" }}>
              {isGroupChat ? "Uçan Kuş" : "Kullanıcı Adı"}
            </span>
            </div>
          </div>

          {/* Mesaj Listesi */}
          <div
              ref={scrollAreaRef}
              className="flex-1 px-4 overflow-y-auto"
              style={{ scrollBehavior: "smooth" }}
          >
            <div className="py-4">
              {isLoading && (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-gray-400">Mesajlar yükleniyor...</span>
                  </div>
              )}
              {fetchError && (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-red-400">Mesajlar yüklenirken hata oluştu.</span>
                  </div>
              )}
              {sortedMessageList.length > 0 ? (
                  sortedMessageList.map((message, index) => {
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
                            {message.author.id === "currentUserId" ? "You" : message.author.username}
                          </span>
                                  <span className="text-[0.6875rem]" style={{ color: "var(--discord-text-muted)" }}>
                            {new Date(message.timestamp).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                                </div>
                            )}
                            <div className="relative">
                              <p
                                  className={`break-words text-[0.8125rem] leading-[1.1875rem] ${
                                      message.pending
                                          ? "text-[var(--discord-text-muted)]"
                                          : "text-[var(--discord-text)]"
                                  }`}
                              >
                                {message.content}
                              </p>
                              {!showFullHeader && (
                                  <span className="absolute top-1 -left-12 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                            {new Date(message.timestamp).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
              ) : (
                  !isLoading && (
                      <div className="flex justify-center py-4">
                        <span className="text-sm text-gray-400">Henüz mesaj bulunmamaktadır.</span>
                      </div>
                  )
              )}
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

        {/* Sağ Sidebar */}
        {isGroupChat ? <GroupSidebar /> : <UserSidebar />}
      </div>
  );
}

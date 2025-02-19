"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { useWebSocket } from "@/features/messages/hooks/useWebsocket";
import { useQueryClient } from "@tanstack/react-query";
import { WebsocketMessageOutput } from "@/features/messages/api/output/WebsocketMessageOutput";
import { MessageOutput } from "@/features/messages/api/output/MessageOutput";
import { useMessages } from "@/features/messages/hooks/useMessages";
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

export default function DirectMessagePage({params,}: { params: { channelId: string }; }) {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    isSending,
  } = useMessages(params.channelId);

  const [isGroupChat, setIsGroupChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const shouldScrollToBottom = useRef(true);
  const queryClient = useQueryClient();

  // Mesaj listesi boş veya null olduğunda default olarak boş array kullanıyoruz
  const messageList: MessageOutput[] = messages ?? [];

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollAreaRef.current;
      const isCloseToBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (shouldScrollToBottom.current || isCloseToBottom) {
        scrollAreaRef.current.scrollTop = scrollHeight;
      }
    }
  };

  const { connected } = useWebSocket({
    channelId: params.channelId,
    onMessageReceived: (stompMessage) => {
      try {
        const parsedMessage: WebsocketMessageOutput = JSON.parse(
            stompMessage.body
        );
        queryClient.setQueryData<MessageOutput[]>(
            ["messages", params.channelId],
            (oldMessages = []) => [...oldMessages, parsedMessage]
        );
        requestAnimationFrame(scrollToBottom);
      } catch (err) {
        console.error("Mesaj parse edilirken hata oluştu:", err);
      }
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current && messageList.length > 0) {
      if (isInitialLoad.current) {
        scrollToBottom();
        isInitialLoad.current = false;
      } else {
        const { scrollHeight, clientHeight, scrollTop } =
            scrollAreaRef.current;
        const isCloseToBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (isCloseToBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messageList]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } =
        event.target as HTMLDivElement;
    shouldScrollToBottom.current =
        scrollHeight - scrollTop - clientHeight < 100;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isSending) return;

    try {
      await sendMessage(
          { content: messageInput.trim() },
          {
            onSuccess: () => {
              setMessageInput("");
              setTimeout(scrollToBottom, 100);
            },
            onError: (err) => {
              console.error("Mesaj gönderilirken hata oluştu:", err);
            },
          }
      );
    } catch (err) {
      console.error("Mesaj gönderme işlemi başarısız:", err);
    }
  };

  const isFirstMessageInGroup = (index: number) => {
    if (index === 0 || !messageList[index - 1]) return true;
    const currentMessage = messageList[index];
    const previousMessage = messageList[index - 1];
    return (
        currentMessage.author.id !== previousMessage.author.id ||
        new Date(currentMessage.timestamp).getTime() -
        new Date(previousMessage.timestamp).getTime() >
        5 * 60 * 1000
    );
  };

  return (
      <div className="flex h-full">
        <div
            className="flex-1 flex flex-col"
            style={{ background: "var(--discord-bg)" }}
        >
          {/* Header */}
          <div
              className="flex items-center justify-between p-3 h-12 border-b"
              style={{
                borderColor: "var(--discord-tertiary-bg)",
                background: "var(--discord-bg)",
              }}
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
              {isGroupChat ? "Uçan Kuş" : "Kullanıcı Adı"}
            </span>
            </div>
          </div>

          {/* Mesaj Listesi */}
          <div
              ref={scrollAreaRef}
              onScroll={handleScroll}
              className="flex-1 px-4 overflow-y-auto"
              style={{ scrollBehavior: "smooth" }}
          >
            <div className="py-4">
              {isLoading && (
                  <div className="flex justify-center py-4">
                <span className="text-sm text-gray-400">
                  Mesajlar yükleniyor...
                </span>
                  </div>
              )}
              {error && (
                  <div className="flex justify-center py-4">
                <span className="text-sm text-red-400">
                  Mesajlar yüklenirken hata oluştu.
                </span>
                  </div>
              )}
              {messageList.length > 0 ? (
                  messageList.map((message, index) => {
                    const isFirst = isFirstMessageInGroup(index);
                    const showFullHeader = isFirst;
                    const isPartOfGroup =
                        index > 0 &&
                        messageList[index - 1].author.id === message.author.id;
                    return (
                        <div
                            key={message.id}
                            className={`group relative flex items-start gap-4 px-2 ${
                                !showFullHeader ? "mt-0.5" : "mt-[17px]"
                            }`}
                        >
                          {/* Grup içindeki mesajlarda hover ile zaman gösterimi */}
                          {isPartOfGroup && (
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                        <span
                            className="text-xs"
                            style={{ color: "var(--discord-text-muted)" }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                              </div>
                          )}

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
                          <div className="flex-1 min-w-0 py-0.5">
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
                            <p
                                className="break-words text-[0.8125rem] leading-[1.1875rem]"
                                style={{ color: "rgba(255, 255, 255, 0.85)" }}
                            >
                              {message.content}
                            </p>
                          </div>

                          {/* Hover ile gösterilen aksiyonlar */}
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
                  <span className="text-sm text-gray-400">
                    Henüz mesaj bulunmamaktadır.
                  </span>
                      </div>
                  )
              )}
            </div>
          </div>

          {/* Mesaj Gönderim Alanı */}
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
                    className="flex-1 bg-transparent focus:outline-none text-[0.875rem] leading-[1.25rem] placeholder-shown:text-ellipsis placeholder:text-[--discord-text-muted]"
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

        {/* Sidebar */}
        {isGroupChat ? <GroupSidebar /> : <UserSidebar />}
      </div>
  );
}

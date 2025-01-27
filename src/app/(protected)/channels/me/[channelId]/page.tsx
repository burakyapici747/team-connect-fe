"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { messageAPI } from "@/services/api/message";
import { useMessageStore } from "@/store/features/message-store";
import {
  PlusCircle,
  Smile,
  GiftIcon,
  Paperclip,
  MoreHorizontal,
  Laugh,
  Edit2,
  Trash2,
  Users,
} from "lucide-react";
import { UserSidebar } from "@/components/channel/user-sidebar";
import { GroupSidebar } from "@/components/channel/group-sidebar";

export default function DirectMessagePage({
  params,
}: {
  params: { channelId: string };
}) {
  const { messages = [], setMessages } = useMessageStore();
  // TODO: Bu değeri API'den alınacak kanal bilgisine göre belirle
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await messageAPI.getMessagesByChannelId(
          params.channelId
        );
        if (Array.isArray(response)) {
          setMessages(response);
        } else {
          console.log("API response is not an array:", response);
          setMessages([]);
        }
      } catch (error) {
        console.log(error);
        setMessages([]);
      }
    })();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || isSending) return;

    try {
      setIsSending(true);
      await messageAPI.sendMessage(params.channelId, {
        content: messageInput.trim(),
      });

      // Mesaj başarıyla gönderildikten sonra input'u temizle
      setMessageInput("");

      // Mesajları yeniden yükle
      const response = await messageAPI.getMessagesByChannelId(
        params.channelId
      );
      if (Array.isArray(response)) {
        setMessages(response);
      }
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
    } finally {
      setIsSending(false);
    }
  };

  const isFirstMessageInGroup = (index: number) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];

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

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4">
            {messages.map((message, index) => {
              const isFirst = isFirstMessageInGroup(index);
              const showFullHeader = isFirst;
              const isPartOfGroup =
                index > 0 &&
                messages[index - 1].author.id === message.author.id;
              const nextMessageIsFromSameAuthor =
                index < messages.length - 1 &&
                messages[index + 1].author.id === message.author.id;

              return (
                <div
                  key={message.id}
                  className={`group relative flex items-start gap-4 px-2 ${
                    !showFullHeader ? "mt-0.5" : "mt-[17px]"
                  }`}
                >
                  {/* Hover Timestamp - Only show for grouped messages that are not the first in group */}
                  {isPartOfGroup && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                      <span
                        className="text-xs"
                        style={{ color: "var(--discord-text-muted)" }}
                      >
                        {"14:30"}
                      </span>
                    </div>
                  )}

                  {showFullHeader ? (
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                      style={{ background: "var(--discord-primary)" }}
                    >
                      U
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
                    <p
                      className="break-words text-[0.8125rem] leading-[1.1875rem]"
                      style={{ color: "rgba(255, 255, 255, 0.85)" }}
                    >
                      {message.content}
                    </p>
                  </div>

                  {/* Hover Actions */}
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
            })}
          </div>
        </ScrollArea>

        {/* Message Input */}
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

"use client";

import React, { useRef, useEffect } from "react";
import SkeletonMessages from "@/features/messages/components/SkeletonMessage";
import MessageItem from "@/features/messages/components/MessageItem";
import { Message } from "@/core/types/message";

interface MessageListProps {
    messages: Message[];
    hasNextPage: boolean;
    isLoading: boolean;
    fetchError: Error | null;
    isLoadingOlderMessages: boolean;
    loadOlderMessages: () => void;
    loadOlderMessagesError: Error | null;
}

const MessageList: React.FC<MessageListProps> = ({
     messages,
     hasNextPage,
     isLoading,
     fetchError,
     isLoadingOlderMessages,
     loadOlderMessages,
     loadOlderMessagesError
}) => {
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const loadingObserverRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);
    const latestMessageRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
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

            if (loadTriggerRef.current && loadingObserverRef.current) {
                loadingObserverRef.current.observe(loadTriggerRef.current);
            }
        };

        setupObserver();

        return () => {
            if (loadingObserverRef.current) {
                loadingObserverRef.current.disconnect();
            }
        };
    }, [hasNextPage, isLoadingOlderMessages, loadOlderMessages, messages]);

    return (
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

                {/* Skeleton loading for older messages */}
                {isLoadingOlderMessages && <SkeletonMessages count={8} />}

                {/* Error state for older messages */}
                {loadOlderMessagesError && (
                    <div className="flex justify-center py-4">
            <span className="text-sm text-red-400">
              Eski mesajlar yüklenirken hata oluştu.
            </span>
                    </div>
                )}

                {/* Initial loading state */}
                {isLoading ? (
                    <SkeletonMessages count={10} />
                ) : fetchError && (
                    <div className="flex justify-center py-4">
            <span className="text-sm text-red-400">
              Mesajlar yüklenirken hata oluştu.
            </span>
                    </div>
                )}

                {/* Message list */}
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            isFirstInGroup={isFirstMessageInGroup(index)}
                        />
                    ))
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
    );
};

export default MessageList;
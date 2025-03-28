"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Laugh, Edit2, MoreHorizontal } from "lucide-react";
import { Message } from "@/core/types/message";

interface MessageItemProps {
    message: Message;
    isFirstInGroup: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isFirstInGroup }) => {
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("tr-TR", {
            day: undefined,
            month: undefined,
            year: undefined,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            id={`message-${message.id}`}
            className={`group relative flex items-start gap-4 px-2 ${
                !isFirstInGroup ? "mt-0.5" : "mt-[17px]"
            }`}
        >
            {isFirstInGroup ? (
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
                {isFirstInGroup && (
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
              {formatTime(message.timestamp)}
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

                    {!isFirstInGroup && (
                        <span className="absolute top-1 -left-12 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
              {formatTime(message.timestamp)}
            </span>
                    )}
                </div>
            </div>

            {/* Hover action buttons */}
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
};

export default MessageItem;
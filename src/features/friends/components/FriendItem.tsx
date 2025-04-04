"use client";

import { Button } from "@/shared/components/ui/button";
import { MessageSquare, MoreVertical, X } from "lucide-react";

interface FriendItemProps {
    name: string;
    status: string;
    avatar: string;
    isPending?: boolean;
    isBlocked?: boolean;
}

export function FriendItem({name, status, avatar, isPending, isBlocked}: FriendItemProps) {
    return (
        <div className="flex items-center p-2 hover:bg-[#35373C] rounded-md cursor-pointer group">
            <div className="relative">
                <img
                    src={avatar}
                    alt={`${name}'s avatar`}
                    className="w-8 h-8 rounded-full"
                />
                <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2B2D31] ${
                        status === "online" ? "bg-[#23A559]" : "bg-[#80848E]"
                    }`}
                />
            </div>
            <div className="ml-3 flex-1">
                <div className="text-[#F3F4F5] text-sm font-medium">{name}</div>
                <div className="text-[#B5BAC1] text-xs">
                    {isPending
                        ? status
                        : isBlocked
                            ? "Blocked"
                            : status === "online"
                                ? "Online"
                                : "Offline"}
                </div>
            </div>
            {isPending ? (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#B5BAC1] hover:text-white hover:bg-red-500"
                >
                    <X className="h-5 w-5" />
                </Button>
            ) : (
                !isBlocked && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#B5BAC1] hover:text-white"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#B5BAC1] hover:text-white"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                )
            )}
        </div>
    );
}
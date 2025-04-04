"use client";

import { Button } from "@/shared/components/ui/button";
import { Check, X } from "lucide-react";

interface PendingFriendItemProps {
    name: string;
    avatar: string;
    type: "incoming" | "outgoing";
}

export function PendingFriendItem({ name, avatar, type }: PendingFriendItemProps) {
    return (
        <div className="flex items-center p-2.5 hover:bg-[#35373C] rounded-md cursor-pointer group">
            <div className="relative">
                <img
                    src={avatar}
                    alt={`${name}'s avatar`}
                    className="w-8 h-8 rounded-full"
                />
            </div>
            <div className="ml-3 flex-1">
                <div className="text-[#F3F4F5] text-sm font-medium">{name}</div>
                <div className="text-[#B5BAC1] text-xs">
                    {type === "incoming"
                        ? "Incoming Friend Request"
                        : "Outgoing Friend Request"}
                </div>
            </div>
            {type === "incoming" ? (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-[32px] w-[32px] text-[#B5BAC1] hover:text-white hover:bg-[#248046]"
                    >
                        <Check className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-[32px] w-[32px] text-[#B5BAC1] hover:text-white hover:bg-[#DA373C]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-[32px] w-[32px] text-[#B5BAC1] hover:text-white hover:bg-[#DA373C]"
                >
                    <X className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
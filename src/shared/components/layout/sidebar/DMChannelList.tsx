"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { DMChannel } from "@/core/types/channel";

interface DMChannelListProps {
    channels: DMChannel[];
}

export function DMChannelList({ channels }: DMChannelListProps) {
    const router = useRouter();

    return (
        <ScrollArea className="flex-1 mt-2">
            {channels?.map((channel) => (
                <DMChannelItem
                    key={channel.id}
                    channel={channel}
                    onClick={() => router.push(`/channels/me/${channel.id}`)}
                />
            ))}
        </ScrollArea>
    );
}

// Individual DM channel item
function DMChannelItem({ channel, onClick }: {
    channel: DMChannel;
    onClick: () => void
}) {
    return (
        <Button
            variant="ghost"
            className="flex items-center w-full gap-3 px-2 py-[6px] mb-[2px] min-h-[42px] text-[#949BA4] hover:text-[#DBDEE1] hover:bg-[#35373C] rounded-[4px] group"
            onClick={onClick}
        >
            <ChannelAvatar channel={channel} />
            <div className="flex-1 min-w-0 text-left">
                <div className="text-[14px] font-medium truncate leading-5">
                    {channel.name}
                </div>
                {channel.lastMessageId && (
                    <div className="text-xs text-[#949BA4] truncate leading-4">
                        Last message
                    </div>
                )}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-[#B5BAC1] opacity-0 group-hover:opacity-100 hover:text-white hover:bg-transparent"
            >
                <MoreVertical className="w-4 h-4" />
            </Button>
        </Button>
    );
}

// Avatar component for DM channels
function ChannelAvatar({ channel }: { channel: DMChannel }) {
    return (
        <div className="relative flex-shrink-0">
            {channel.icon ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                        src={channel.icon}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : channel.recipients.length > 2 ? (
                <div className="relative w-8 h-8">
                    <div className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center">
            <span className="text-white text-[11px] font-medium">
              {channel.recipients.length}
            </span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#313338] flex items-center justify-center border-[2px] border-[#2B2D31]">
                        <span className="text-white text-xs font-medium">G</span>
                    </div>
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-[#313338] flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {channel.name.charAt(0).toUpperCase()}
          </span>
                </div>
            )}
            {channel.recipients.length <= 2 && (
                <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-[#23A559] rounded-full border-[2px] border-[#2B2D31]" />
            )}
        </div>
    );
}
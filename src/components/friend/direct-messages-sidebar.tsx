"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useDMChannelStore } from "@/store/features/channel-store";
import { channelAPI } from "@/services/api/channel";
import { DMChannel } from "@/types/channel";

export function DMChannelSidebar() {
  const router = useRouter();
  const { channels = [], setDMChannels } = useDMChannelStore();

  useEffect(() => {
    (async () => {
      try {
        const response = await channelAPI.getDMChannels();
        if (Array.isArray(response)) {
          setDMChannels(response);
        } else {
          console.error("API response is not an array:", response);
          setDMChannels([]);
        }
      } catch (error) {
        console.log(error);
        setDMChannels([]);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#2B2D31] w-60">
      {/* Header */}
      <div className="flex items-center p-4 h-12 shadow-sm">
        <input
          type="text"
          placeholder="Find a conversation"
          className="w-full px-2 py-1 text-sm bg-[#1E1F22] text-white rounded focus:outline-none"
        />
      </div>

      {/* Friends Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 py-1 mx-2 mt-2 text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
        onClick={() => router.push("/channels/me")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
            fill="currentColor"
          />
        </svg>
        <span>Friends</span>
      </Button>

      {/* Direct Messages */}
      <div className="flex items-center justify-between px-4 py-2 mt-4">
        <span className="text-xs font-semibold text-[#B5BAC1] uppercase">
          Direct Messages
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-4 h-4 text-[#B5BAC1] hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        {channels.map((channel: DMChannel) => (
          <Button
            key={channel.id}
            variant="ghost"
            className="flex items-center w-full gap-2 px-2 py-1 mb-1 min-h-[44px] text-[#B5BAC1] hover:text-white hover:bg-[#35373C] rounded-[4px]"
            onClick={() => router.push(`/channels/me/${channel.id}`)}
          >
            <div className="relative flex-shrink-0">
              {channel.icon ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={channel.icon}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : channel.recipients.length > 2 ? (
                <div className="relative w-10 h-10">
                  <div className="absolute top-[3px] -left-[2px] w-6 h-6 rounded-full bg-[#5865F2] flex items-center justify-center opacity-95">
                    <span className="text-white text-[11px] font-medium">
                      {channel.recipients.length}
                    </span>
                  </div>
                  <div className="absolute bottom-0 -right-[0px] w-[30px] h-[30px] rounded-full bg-[#313338] flex items-center justify-center border-[3px] border-[#2B2D31] z-10">
                    <span className="text-white text-[14px] font-medium">
                      G
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#313338] flex items-center justify-center">
                  <span className="text-white text-[16px] font-medium">
                    {channel.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {channel.recipients.length <= 2 && (
                <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#23A559] rounded-full border-[2.5px] border-[#2B2D31]" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[15px] font-medium truncate leading-5">
                {channel.name}
              </div>
              {channel.lastMessageId && (
                <div className="text-xs text-[#949BA4] truncate leading-4">
                  Son mesaj
                </div>
              )}
            </div>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}

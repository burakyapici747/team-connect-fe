"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useDMChannelStore } from "@/store/features/channel-store";
import { channelAPI } from "@/services/api/channel";
import { DMChannel } from "@/types/channel";
import { UserPlus, MoreVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/features/user-store";

const ProfileSection = () => {
  const [status, setStatus] = useState("online");
  const { user, userProfile } = useUserStore();

  return (
    <div className="mt-auto p-2 bg-[#232428] flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-[48px] flex items-center justify-start gap-2 px-2 hover:bg-[#35373C]"
          >
            <div className="relative">
              <img
                src={userProfile?.avatarFileUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#232428] ${status === "online"
                  ? "bg-[#23A559]"
                  : status === "idle"
                    ? "bg-[#F0B232]"
                    : status === "dnd"
                      ? "bg-[#F23F43]"
                      : status === "invisible"
                        ? "bg-[#80848E]"
                        : "bg-[#80848E]"
                  }`}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-white">
                {user?.username}
              </span>
              <span className="text-xs text-[#B5BAC1]">
                {userProfile?.fullName}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[340px] bg-[#1E1F22] border-none text-[#E9EAEB] p-0 overflow-hidden rounded-lg"
          align="start"
          alignOffset={0}
          sideOffset={5}
        >
          {/* Profil Kartı */}
          <div className="relative">
            {/* Banner */}
            <div className="h-[60px] bg-[#5865F2]" />

            {/* Profil Bilgileri */}
            <div className="px-4 pb-4">
              <div className="relative">
                {/* Avatar */}
                <div className="absolute -top-[52px]">
                  <div className="w-[84px] h-[84px] rounded-full border-[6px] border-[#1E1F22] bg-[#1E1F22]">
                    <img
                      src={userProfile?.avatarFileUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div
                    className={`absolute bottom-1 right-1 w-[18px] h-[18px] rounded-full border-[3px] border-[#1E1F22] ${status === "online"
                      ? "bg-[#23A559]"
                      : status === "idle"
                        ? "bg-[#F0B232]"
                        : status === "dnd"
                          ? "bg-[#F23F43]"
                          : "bg-[#80848E]"
                      }`}
                  />
                </div>

                {/* Kullanıcı Bilgileri */}
                <div className="pt-[40px]">
                  <div className="rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-0.5">
                      Secere
                    </h2>
                    <p className="text-sm text-[#B5BAC1]">
                      {userProfile?.fullName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Container */}
          <div className="p-4 space-y-2">
            {/* Profili Düzenle */}
            <div className="bg-[#2B2D31] rounded-[4px] border border-[#1F2023]">
              <DropdownMenuItem className="px-2 py-2.5 hover:bg-[#5865F2] hover:text-white rounded-[3px] cursor-pointer focus:bg-[#5865F2] focus:text-white">
                <div className="flex items-center gap-2 text-[#B5BAC1] hover:text-white">
                  <User className="w-4 h-4" />
                  <span>Profili Düzenle</span>
                </div>
              </DropdownMenuItem>
            </div>

            {/* Çevrimiçi Durumu */}
            <div className="bg-[#2B2D31] rounded-[4px] border border-[#1F2023]">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full px-2 py-2.5 hover:bg-[#5865F2] hover:text-white rounded-[3px] cursor-pointer focus:bg-[#5865F2] focus:text-white">
                  <div className="flex items-center gap-2 text-[#B5BAC1] hover:text-white">
                    <div
                      className={`w-3 h-3 rounded-full ${status === "online"
                        ? "bg-[#23A559]"
                        : status === "idle"
                          ? "bg-[#F0B232]"
                          : status === "dnd"
                            ? "bg-[#F23F43]"
                            : "bg-[#80848E]"
                        }`}
                    />
                    <span>
                      {status === "online"
                        ? "Çevrimiçi"
                        : status === "idle"
                          ? "Boşta"
                          : status === "dnd"
                            ? "Rahatsız Etmeyin"
                            : status === "invisible"
                              ? "Görünmez"
                              : "Çevrimiçi"}
                    </span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-[300px] bg-[#2B2D31] border-none text-[#E9EAEB] rounded-lg">
                    <DropdownMenuItem
                      className="px-2 py-2.5 m-1 hover:bg-[#5865F2] hover:text-white rounded-[3px] cursor-pointer focus:bg-[#5865F2] focus:text-white"
                      onClick={() => setStatus("online")}
                    >
                      <div className="flex items-center gap-2 text-[#B5BAC1] hover:text-white">
                        <div className="w-3 h-3 rounded-full bg-[#23A559]" />
                        <div className="flex flex-col">
                          <span>Çevrimiçi</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-2 py-2.5 m-1 hover:bg-[#5865F2] hover:text-white rounded-[3px] cursor-pointer focus:bg-[#5865F2] focus:text-white"
                      onClick={() => setStatus("idle")}
                    >
                      <div className="flex items-center gap-2 text-[#B5BAC1] hover:text-white">
                        <div className="w-3 h-3 rounded-full bg-[#F0B232]" />
                        <div className="flex flex-col">
                          <span>Boşta</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-2 py-2.5 m-1 hover:bg-[#5865F2] hover:text-white rounded-[3px] cursor-pointer focus:bg-[#5865F2] focus:text-white"
                      onClick={() => setStatus("dnd")}
                    >
                      <div className="flex items-center gap-2 text-[#B5BAC1] hover:text-white">
                        <div className="w-3 h-3 rounded-full bg-[#F23F43]" />
                        <div className="flex flex-col">
                          <span>Rahatsız Etmeyin</span>
                          <span className="text-xs text-[#B5BAC1]">
                            Herhangi bir masaüstü bildirimi almayacaksın.
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-2 py-2.5 m-1 hover:bg-[#5865F2] hover:text-white rounded-[3px] cursor-pointer focus:bg-[#5865F2] focus:text-white"
                      onClick={() => setStatus("invisible")}
                    >
                      <div className="flex items-center gap-2 text-[#B5BAC1] hover:text-white">
                        <div className="w-3 h-3 rounded-full bg-[#80848E]" />
                        <div className="flex flex-col">
                          <span>Görünmez</span>
                          <span className="text-xs text-[#B5BAC1]">
                            Çevrimiçi görünmezsin ama Discord'un tüm
                            özelliklerine erişebilirsin.
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export function DMChannelSidebar() {
  const router = useRouter();
  const { channels = [], setDMChannels } = useDMChannelStore();
  const { user, userProfile } = useUserStore();

  useEffect(() => {
    // UserStore verilerini kontrol et
    console.log("UserStore - User:", user);
    console.log("UserStore - UserProfile:", userProfile);
  }, [user, userProfile]);

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
    <div className="flex flex-col h-full bg-[#2B2D31]">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">Direkt Mesajlar</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#B5BAC1] hover:text-white"
          >
            <UserPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {channels.map((channel: DMChannel) => (
          <Button
            key={channel.id}
            variant="ghost"
            className="flex items-center w-full gap-2 px-2 py-1 mb-1 min-h-[44px] text-[#B5BAC1] hover:text-white hover:bg-[#35373C] rounded-[4px] group"
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
        ))}
      </ScrollArea>

      <ProfileSection />
    </div>
  );
}

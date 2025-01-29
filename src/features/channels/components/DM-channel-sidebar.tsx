"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { useDMChannelStore } from "@/features/channels/store/channel-store";
import { channelAPI } from "@/features/channels/api";
import { DMChannel } from "@/core/types/channel";
import { UserPlus, MoreVertical, User, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/shared/components/ui/dropdown-menu";
import { useUserStore } from "@/features/users/store/user-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";

const ProfileSection = () => {
  const [status, setStatus] = useState("online");
  const { user, userProfile } = useUserStore();

  return (
    <div className="mt-auto p-2 bg-[#232428] flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-[42px] flex items-center justify-start gap-2 px-2 hover:bg-[#35373C] rounded-[3px]"
          >
            <div className="relative">
              <img
                src={userProfile?.avatarFileUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full border-[2px] border-[#232428] ${
                  status === "online"
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
              <span className="text-[12px] font-medium text-[#DBDEE1]">
                {user?.username}
              </span>
              <span className="text-[12px] text-[#949BA4]">
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
                    className={`absolute bottom-1 right-1 w-[18px] h-[18px] rounded-full border-[3px] border-[#1E1F22] ${
                      status === "online"
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
                      className={`w-3 h-3 rounded-full ${
                        status === "online"
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
  const [isCreateDMOpen, setIsCreateDMOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Dummy users data - Bu kısmı API'den alacak şekilde güncellenecek
  const users = [
    { id: "1", username: "sethpark", displayName: "sethpark" },
    { id: "2", username: "kzt_3", displayName: "kzt_3" },
    { id: "3", username: "Bobzero", displayName: "bobzero23" },
    { id: "4", username: "bilaldurgunlu", displayName: "bilaldurgunlu" },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDM = async () => {
    // TODO: API call to create DM
    setIsCreateDMOpen(false);
    setSelectedUsers([]);
    setSearchQuery("");
  };

  useEffect(() => {
    // UserStore verilerini kontrol et
  }, [user, userProfile]);

  useEffect(() => {
    (async () => {
      try {
        const response = await channelAPI.getDMChannels();
        if (Array.isArray(response)) {
          setDMChannels(response);
        } else {
          setDMChannels([]);
        }
      } catch (error) {
        setDMChannels([]);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#2B2D31] w-[240px]">
      {/* Search Input */}
      <div
        className="px-2 py-2"
        style={{
          borderBottom: "1px solid var(--discord-tertiary-bg)",
        }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Bir sohbet bul veya başlat"
            className="w-full h-[28px] px-2 bg-[#1E1F22] text-[#DBDEE1] text-[13px] rounded-[4px] placeholder:text-[#949BA4] focus:outline-none"
          />
        </div>
      </div>

      {/* Friends Button */}
      <Button
        variant="ghost"
        className="flex items-center w-full gap-3 px-[6px] py-[6px] mb-[2px] min-h-[42px] text-[#949BA4] hover:text-[#DBDEE1] hover:bg-[#35373C] rounded-[4px]"
      >
        <div className="w-8 h-8 rounded-[16px] bg-[#1E1F22] flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <span className="text-[14px] font-medium">Friends</span>
      </Button>

      {/* Direct Messages Header */}
      <div className="px-[10px] mt-3">
        <div className="flex items-center justify-between group">
          <span className="text-[11px] font-medium text-[#949BA4] uppercase px-[2px]">
            Direkt Mesajlar
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4 text-[#949BA4] hover:text-[#DBDEE1] p-0"
            onClick={() => setIsCreateDMOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Create DM Dialog */}
      <Dialog open={isCreateDMOpen} onOpenChange={setIsCreateDMOpen}>
        <DialogContent className="bg-[#313338] border-none text-[#F2F3F5] p-0 max-w-[440px]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-[20px] font-semibold">
              Arkadaşlarını Seç
            </DialogTitle>
            <p className="text-[12px] text-[#949BA4] mt-1">
              9 arkadaş daha ekleyebilirsin.
            </p>
          </DialogHeader>

          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bir arkadaşının kullanıcı adını yaz"
                className="w-full h-[32px] px-2 bg-[#1E1F22] text-[#DBDEE1] text-[14px] rounded-[4px] placeholder:text-[#949BA4] focus:outline-none"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949BA4]" />
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-[#35373C] rounded-[4px] cursor-pointer"
                  onClick={() => {
                    if (selectedUsers.includes(user.id)) {
                      setSelectedUsers(
                        selectedUsers.filter((id) => id !== user.id)
                      );
                    } else {
                      setSelectedUsers([...selectedUsers, user.id]);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E1F22] flex items-center justify-center">
                      <span className="text-white text-[15px] font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium">
                        {user.username}
                      </span>
                      <span className="text-[12px] text-[#949BA4]">
                        {user.displayName}
                      </span>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    className="border-[#949BA4] data-[state=checked]:bg-[#5865F2] data-[state=checked]:border-[#5865F2]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#2B2D31] p-4 mt-2">
            <Button
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              disabled={selectedUsers.length === 0}
              onClick={handleCreateDM}
            >
              {selectedUsers.length > 1 ? "Grup DM'si Oluştur" : "DM Oluştur"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ScrollArea className="flex-1 mt-2">
        {channels.map((channel: DMChannel) => (
          <Button
            key={channel.id}
            variant="ghost"
            className="flex items-center w-full gap-3 px-2 py-[6px] mb-[2px] min-h-[42px] text-[#949BA4] hover:text-[#DBDEE1] hover:bg-[#35373C] rounded-[4px] group"
            onClick={() => router.push(`/channels/me/${channel.id}`)}
          >
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
        ))}
      </ScrollArea>

      <ProfileSection />
    </div>
  );
}

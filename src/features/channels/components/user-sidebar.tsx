import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Info, MoreHorizontal } from "lucide-react";

export function UserSidebar() {
  return (
    <div
      className="w-[340px] border-l flex flex-col bg-[#2B2D31]"
      style={{ borderColor: "var(--discord-tertiary-bg)" }}
    >
      <ScrollArea className="flex-1">
        {/* User Profile Section */}
        <div className="relative">
          {/* Profile Banner */}
          <div className="h-[60px] bg-[#313338]" />

          {/* Profile Actions */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-black/20"
            >
              <MoreHorizontal className="h-5 w-5 text-white" />
            </Button>
          </div>

          {/* Avatar */}
          <div className="absolute left-4 top-4">
            <div className="w-[80px] h-[80px] rounded-full bg-[#1E1F22] p-1">
              <div className="w-full h-full rounded-full bg-[#25A55F] flex items-center justify-center text-white text-2xl font-medium">
                k
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-16 pb-3 px-4 bg-[#2B2D31]">
            <div className="mt-8">
              <div className="flex items-center gap-1">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--discord-text)" }}
                >
                  kzt_3
                </h2>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-[#5865F2] rounded-sm" />
                  <div className="w-4 h-4 bg-[#25A55F] rounded-sm" />
                </div>
              </div>
              <p className="text-sm" style={{ color: "var(--discord-text)" }}>
                kzt_3
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4">
          {/* About Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-xs font-semibold uppercase"
                style={{ color: "var(--discord-text-muted)" }}
              >
                Hakkında
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-[#2E3035]"
              >
                <Info
                  className="h-4 w-4"
                  style={{ color: "var(--discord-text-muted)" }}
                />
              </Button>
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--discord-text-muted)" }}
              >
                Şu Tarihten Beri Üye:
              </h3>
              <p className="text-sm" style={{ color: "var(--discord-text)" }}>
                27 Şub 2022
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* View Full Profile Button */}
      <div
        className="p-4 mt-auto border-t"
        style={{ borderColor: "var(--discord-tertiary-bg)" }}
      >
        <Button
          variant="ghost"
          className="w-full justify-center text-sm hover:underline"
          style={{ color: "var(--discord-text)" }}
        >
          Profilin Tamamını Görüntüle
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Users } from "lucide-react";

export function GroupSidebar() {
  const members = [
    { id: 1, name: "Secere", online: true },
    { id: 2, name: "kzt_3", online: true },
    { id: 3, name: "muratyapici", online: false },
    { id: 4, name: "Mart", online: true },
  ];

  // Üyeleri çevrimiçi durumuna göre sırala
  const sortedMembers = [...members].sort((a, b) => {
    if (a.online === b.online) {
      // Aynı durumdaki üyeleri alfabetik sırala
      return a.name.localeCompare(b.name);
    }
    // Çevrimiçi olanlar önce
    return a.online ? -1 : 1;
  });

  return (
    <div
      className="w-[240px] border-l flex flex-col bg-[#2B2D31]"
      style={{ borderColor: "var(--discord-tertiary-bg)" }}
    >
      {/* Header */}
      <div
        className="p-3 flex items-center justify-between border-b"
        style={{ borderColor: "var(--discord-tertiary-bg)" }}
      >
        <div className="flex items-center gap-2">
          <Users
            className="h-4 w-4"
            style={{ color: "var(--discord-text-muted)" }}
          />
          <h2
            className="text-xs font-semibold uppercase"
            style={{ color: "var(--discord-text-muted)" }}
          >
            ÜYELER—{members.length}
          </h2>
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {sortedMembers.map((member) => (
            <Button
              key={member.id}
              variant="ghost"
              className="w-full justify-start px-2 py-1 h-auto hover:bg-[#2E3035] group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-medium ${
                      !member.online && "opacity-50"
                    }`}
                  >
                    {member.name[0].toUpperCase()}
                  </div>
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                    style={{
                      background: member.online
                        ? "var(--discord-online)"
                        : "#80848E",
                      borderColor: "#2B2D31",
                    }}
                  />
                </div>
                <span
                  className={`text-sm group-hover:text-white transition-colors ${
                    !member.online && "opacity-50"
                  }`}
                  style={{ color: "var(--discord-text)" }}
                >
                  {member.name}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

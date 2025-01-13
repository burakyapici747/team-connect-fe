"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FriendsPage() {

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 h-12 border-b border-[#1E1F22]">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill="#B5BAC1"
            />
          </svg>
          <span className="text-white font-semibold">Friends</span>
        </div>
        <div className="h-6 w-[1px] bg-[#3F4147] mx-4" />
        <Tabs className="flex-1">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger
              value="online"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              Online
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
            </TabsTrigger>
            <TabsTrigger
              value="blocked"
              className="text-[#B5BAC1] data-[state=active]:text-white data-[state=active]:bg-[#35373C]"
            >
              Blocked
            </TabsTrigger>
          </TabsList>
          <Button
            variant="default"
            className="ml-auto bg-[#248046] hover:bg-[#1A6334] text-white"
          >
            Add Friend
          </Button>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4">
        <TabsContent value="online" className="m-0"></TabsContent>

        <TabsContent value="all" className="m-0">
          ))
        </TabsContent>

        <TabsContent value="pending" className="m-0"></TabsContent>

        <TabsContent value="blocked" className="m-0"></TabsContent>
      </ScrollArea>
    </div>
  );
}
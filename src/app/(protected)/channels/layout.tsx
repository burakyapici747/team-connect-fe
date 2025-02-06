"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DMChannelSidebar } from "@/features/channels/components/DM-channel-sidebar";
import { TeamSidebar } from "@/features/teams/components/team-sidebar";
import { useUser } from "@/features/users/hooks/useUser";

export default function ChannelsLayout({children,}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, error } = useUser();

  if (error) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-[#313338]">
          <div className="text-white">Yükleniyor...</div>
        </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
      <div className="flex h-screen">
        <TeamSidebar />
        <DMChannelSidebar />
        <main className="flex-1 bg-[#313338]">{children}</main>
      </div>
  );
}
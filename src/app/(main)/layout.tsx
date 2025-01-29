"use client";

import React from "react";
import { TeamSidebar } from "@/features/teams/components/team-sidebar";
import { ChannelSidebar } from "@/features/channels/components/channel-sidebar";

export default function MainLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen">
            <TeamSidebar />
            <ChannelSidebar />
            <main className="flex-1 bg-[#313338]">{children}</main>
        </div>
    );
}

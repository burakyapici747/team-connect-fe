"use client";

import React from "react";
import { TeamSelectorSidebar } from "@/features/teams/components/TeamSelectorSidebar";

export default function MainLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen">
            <TeamSelectorSidebar />
            <main className="flex-1 bg-[#313338]">{children}</main>
        </div>
    );
}

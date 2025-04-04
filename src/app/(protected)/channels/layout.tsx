"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideBarList } from "@/shared/components/layout/SideBarList";
import { TeamSelectorSidebar } from "@/features/teams/components/TeamSelectorSidebar";
import { useUser } from "@/features/users/hooks/useUser";

export default function ChannelsLayout({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading, error } = useUser();

    useEffect(() => {
        if (error || (!isLoading && !user)) {
            router.push("/login");
        }
    }, [user, isLoading, error, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#313338]">
                <div className="text-white">Yükleniyor...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#313338]">
                <div className="text-white">Oturum bilgileriniz kontrol ediliyor...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <TeamSelectorSidebar />
            <SideBarList />
            <main className="flex-1 bg-[#313338] overflow-auto">{children}</main>
        </div>
    );
}
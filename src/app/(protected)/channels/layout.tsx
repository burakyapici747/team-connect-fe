"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/features/auth-store";
import {authAPI} from "@/services/api";
import {DMChannelSidebar} from "@/components/friend/direct-messages-sidebar";
import {TeamSidebar} from "@/components/team/team-sidebar";
import {ChannelSidebar} from "@/components/channel/channel-sidebar";

export default function ChannelsLayout({children}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const {user, setUser} = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        const checkAuth = async () => {
            if (!isActive) return;

            try {
                const response = await authAPI.me();
                if (!isActive) return;

                if (response?.data) {
                    setUser(response.data);
                } else {
                    router.push("/login");
                }
            } catch (error) {
                if (!isActive) return;
                console.error("Auth hatası:", error);
                router.push("/login");
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        if (!user) {
            checkAuth();
        } else {
            setIsLoading(false);
        }

        return () => {
            isActive = false;
        };
    }, [router, setUser, user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#313338]">
                <div className="text-white">Yükleniyor...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }


    return (
        <>
            <div className="flex h-screen">
                <TeamSidebar/>
                <DMChannelSidebar/>
                <main className="flex-1 bg-[#313338]">{children}</main>
            </div>
        </>
    )
}

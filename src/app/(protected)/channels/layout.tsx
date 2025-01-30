"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { authAPI } from "@/shared/api/genericAPI";
import { DMChannelSidebar } from "@/features/channels/components/DM-channel-sidebar";
import { TeamSidebar } from "@/features/teams/components/team-sidebar";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUserData } = useCurrentUser();

  useEffect(() => {
    let isActive = true;

    const checkAuth = async () => {
      if (!isActive) return;

      try {
        const { data } = await authAPI.me();
        if (!isActive) return;

        if (data) {
          setUser(data);
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

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchUserData();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push("/login");
      }
    };

    initializeUser();
  }, []);

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
        <TeamSidebar />
        <DMChannelSidebar />
        <main className="flex-1 bg-[#313338]">{children}</main>
      </div>
    </>
  );
}

"use client"

import { TeamSidebar } from "@/components/team/team-sidebar"
import { ChannelSidebar } from "@/components/channel/channel-sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex">
      <TeamSidebar />
      <ChannelSidebar />
      <main className="flex-1 bg-[#313338]">{children}</main>
    </div>
  )
} 
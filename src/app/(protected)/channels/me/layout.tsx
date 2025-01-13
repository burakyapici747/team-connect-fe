"use client";

import React from "react";
import { DirectMessagesSidebar } from "@/components/friend/direct-messages-sidebar";

export default function DirectMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DirectMessagesSidebar />
      <main className="flex-1 bg-[#313338]">{children}</main>
    </div>
  );
}

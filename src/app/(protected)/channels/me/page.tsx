"use client";

import FriendsPage from "@/features/friends/pages/FriendsPage";
import { Suspense } from "react";

export default function DirectMessagesAndFriendsPage() {
  return (
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white">Arkadaşlar yükleniyor...</div>}>
        <FriendsPage />
      </Suspense>
  );
}
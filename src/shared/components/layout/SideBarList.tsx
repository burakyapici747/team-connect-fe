"use client";

import { useState } from "react";
import { useDMChannel } from "@/features/channels/hooks/UseDMChannel";
import { DirectMessageHeader } from "./sidebar/DirectMessageHeader";
import { CreateDMDialog } from "@/shared/components/layout/sidebar/CreateDMDialog.tsx";
import { DMChannelList } from "@/shared/components/layout/sidebar/DMChannelList"

export function SideBarList() {
    const [isCreateDMOpen, setIsCreateDMOpen] = useState(false);
    const { currentUserDMChannels, isLoading, error } = useDMChannel();

    // TODO: Gerçek API'den kullanıcı listesini çekin.
    const users: Array<{ id: string; username: string; displayName: string }> = [];

    const handleCreateDM = async () => {
        // TODO: DM oluşturma API çağrısını entegre et.
        setIsCreateDMOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#2B2D31] w-[240px]">
            <DirectMessageHeader onCreateDM={() => setIsCreateDMOpen(true)} />

            <CreateDMDialog
                isOpen={isCreateDMOpen}
                onOpenChange={setIsCreateDMOpen}
                onCreateDM={handleCreateDM}
                users={users}
            />

            <DMChannelList channels={currentUserDMChannels || []} />
        </div>
    );
}
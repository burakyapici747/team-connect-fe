"use client";

import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

interface DirectMessageHeaderProps {
    onCreateDM: () => void;
}

export function DirectMessageHeader({ onCreateDM }: DirectMessageHeaderProps) {
    return (
        <div className="px-[10px] mt-3">
            <div className="flex items-center justify-between group">
        <span className="text-sm font-medium text-[#949BA4] px-[2px]">
          Direkt Mesajlar
        </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 text-[#949BA4] hover:text-[#DBDEE1] p-0"
                    onClick={onCreateDM}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
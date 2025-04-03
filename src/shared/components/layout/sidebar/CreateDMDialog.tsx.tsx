"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface User {
    id: string;
    username: string;
    displayName: string;
}

interface CreateDMDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateDM: () => void;
    users: User[];
}

export function CreateDMDialog({ isOpen, onOpenChange, onCreateDM, users }: CreateDMDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateDM = () => {
        onCreateDM();
        setSelectedUsers([]);
        setSearchQuery("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#313338] border-none text-[#F2F3F5] p-0 max-w-[440px]">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="text-[20px] font-semibold">
                        Arkadaşlarını Seç
                    </DialogTitle>
                    <p className="text-[12px] text-[#949BA4] mt-1">
                        Eklemek için arkadaş listesi API entegrasyonu gereklidir.
                    </p>
                </DialogHeader>
                <div className="p-4">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Bir arkadaşının kullanıcı adını yaz"
                            className="w-full h-[32px] px-2 bg-[#1E1F22] text-[#DBDEE1] text-[14px] rounded-[4px] placeholder:text-[#949BA4] focus:outline-none"
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949BA4]" />
                    </div>
                    {filteredUsers.length > 0 ? (
                        <div className="max-h-[320px] overflow-y-auto">
                            {filteredUsers.map((u) => (
                                <UserItem
                                    key={u.id}
                                    user={u}
                                    isSelected={selectedUsers.includes(u.id)}
                                    onToggleSelect={() =>
                                        setSelectedUsers((prev) =>
                                            prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                                        )
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#949BA4] text-sm">Kullanıcı bulunamadı.</p>
                    )}
                </div>
                <div className="bg-[#2B2D31] p-4 mt-2">
                    <Button
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                        disabled={selectedUsers.length === 0}
                        onClick={handleCreateDM}
                    >
                        {selectedUsers.length > 1 ? "Grup DM'si Oluştur" : "DM Oluştur"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// User item in the dialog
function UserItem({ user, isSelected, onToggleSelect }: {
    user: User;
    isSelected: boolean;
    onToggleSelect: () => void
}) {
    return (
        <div
            className="flex items-center justify-between p-2 hover:bg-[#35373C] rounded-[4px] cursor-pointer"
            onClick={onToggleSelect}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E1F22] flex items-center justify-center">
          <span className="text-white text-[15px] font-medium">
            {user.username.charAt(0).toUpperCase()}
          </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[14px] font-medium">{user.username}</span>
                    <span className="text-[12px] text-[#949BA4]">{user.displayName}</span>
                </div>
            </div>
            <Checkbox
                checked={isSelected}
                className="border-[#949BA4] data-[state=checked]:bg-[#5865F2] data-[state=checked]:border-[#5865F2]"
            />
        </div>
    );
}
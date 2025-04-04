"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";

export function AddFriendSection() {
    const [username, setUsername] = useState("");

    return (
        <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-2">ADD FRIEND</h2>
            <p className="text-[#B5BAC1] text-sm mb-4">
                You can add friends with their Discord username.
            </p>
            <div className="flex gap-2">
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                    className="flex-1 bg-[#1E1F22] border-none text-white placeholder:text-[#B5BAC1]"
                />
                <Button
                    variant="default"
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                    Send Friend Request
                </Button>
            </div>
            {!username && (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                    <img
                        src="/wumpus.png"
                        alt="Wumpus"
                        className="w-60 h-60 opacity-60"
                    />
                    <p className="text-[#B5BAC1] mt-4">
                        Wumpus is waiting for friends. But not forced!
                    </p>
                </div>
            )}
        </div>
    );
}
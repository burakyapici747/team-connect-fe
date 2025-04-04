"use client";

import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
    return (
        <div className="px-4 pt-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B5BAC1]" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="pl-10 bg-[#1E1F22] border-none text-white placeholder:text-[#B5BAC1]"
                />
            </div>
        </div>
    );
}
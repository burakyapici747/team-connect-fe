"use client";

interface EmptyStateProps {
    message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center pt-8">
            <img
                src="/wumpus.png"
                alt="Wumpus"
                className="w-60 h-60 opacity-60"
            />
            <p className="text-[#B5BAC1] mt-4">{message}</p>
        </div>
    );
}
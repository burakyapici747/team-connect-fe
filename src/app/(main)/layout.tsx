"use client";

import React from "react";

export default function MainLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen">
            <main className="flex-1 bg-[#313338]">{children}</main>
        </div>
    );
}

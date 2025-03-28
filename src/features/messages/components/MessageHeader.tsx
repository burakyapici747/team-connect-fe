'use client'

import React from "react"

interface MessageHeaderProps {
    username?: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({username = "Uçan Kuş"}) => {
    return (
        <div
            className="flex items-center justify-between p-3 h-12 border-b"
            style={{ borderColor: "var(--discord-tertiary-bg)" }}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ background: "var(--discord-primary)" }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                        style={{
                            background: "var(--discord-online)",
                            borderColor: "var(--discord-bg)",
                        }}
                    />
                </div>
                <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--discord-text)" }}
                >
          {username}
        </span>
            </div>
        </div>
    );
};

export default MessageHeader;
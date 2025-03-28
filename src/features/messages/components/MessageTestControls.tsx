"use client";

import React, { useState } from "react";

interface TestControlsProps {
    addTestMessages: (start: number, end: number) => void;
}

const TestControls: React.FC<TestControlsProps> = ({ addTestMessages }) => {
    const [messageStart, setMessageStart] = useState(1);
    const [messageEnd, setMessageEnd] = useState(50);

    return (
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderTop: "1px solid var(--discord-tertiary-bg)" }}>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={messageStart}
                    onChange={(e) => setMessageStart(parseInt(e.target.value) || 1)}
                    className="w-16 p-1 rounded bg-[var(--discord-input-bg)] text-[var(--discord-text)] border border-[var(--discord-tertiary-bg)]"
                    placeholder="Start"
                    min="1"
                />
                <span className="text-[var(--discord-text-muted)]">-</span>
                <input
                    type="number"
                    value={messageEnd}
                    onChange={(e) => setMessageEnd(parseInt(e.target.value) || 50)}
                    className="w-16 p-1 rounded bg-[var(--discord-input-bg)] text-[var(--discord-text)] border border-[var(--discord-tertiary-bg)]"
                    placeholder="End"
                    min="1"
                />
            </div>
            <button
                onClick={() => addTestMessages(messageStart, messageEnd)}
                className="px-3 py-1 rounded bg-[var(--discord-primary)] text-white text-sm hover:bg-opacity-80"
            >
                Test Mesajları Ekle
            </button>
        </div>
    );
};

export default TestControls;
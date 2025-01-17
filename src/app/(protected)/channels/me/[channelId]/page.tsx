"use client";

import {useEffect} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import {messageAPI} from "@/services/api/message";
import {useMessageStore} from "@/store/features/message-store";

export default function DirectMessagePage({params}: { params: { channelId: string }; }) {
    const {messages = [], setMessages} = useMessageStore();

    useEffect(() => {
        (async () => {
            try {
                debugger;
                const response = await messageAPI.getMessagesByChannelId(params.channelId);
                if (Array.isArray(response)) {
                    setMessages(response);
                } else {
                    console.log("API response is not an array:", response);
                    setMessages([]);
                }
            } catch (error) {
                console.log(error)
                setMessages([]);
            }
        })();
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-4 h-12 border-b border-[#1E1F22]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-[#5865F2]">
                            {/* Avatar would go here */}
                        </div>
                        <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-[#23A559] rounded-full border-2 border-[#313338]"/>
                    </div>
                    <span className="text-white font-semibold">
          </span>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#5865F2]">
                            {/* Avatar would go here */}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {message.sender.id === "currentUserId"
                      ? "You"
                      : message.sender.username}
                </span>
                                <span className="text-xs text-[#B5BAC1]">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
                            </div>
                            <p className="text-[#DBDEE1]">{message.content}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#383A40]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#B5BAC1] hover:text-white"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
                                fill="currentColor"
                            />
                        </svg>
                    </Button>
                    <input
                        type="text"
                        placeholder={`Message`}
                        className="flex-1 bg-transparent text-white placeholder-[#B5BAC1] focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

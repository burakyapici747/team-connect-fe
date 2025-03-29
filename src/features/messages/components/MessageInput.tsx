"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle, Smile, GiftIcon, Paperclip, Eye, Pencil, Trash, File } from "lucide-react";
import { MessageSendInput } from "@/features/messages/api/input/MessageSendInput";
import { useMessages } from "@/features/messages/hooks/useMessages";

interface MessageInputProps {
    channelId: string
}

const MessageInput: React.FC<MessageInputProps> = ({ channelId}) => {
    const [messageInput, setMessageInput] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const { sendMessage } = useMessages(channelId);

    useEffect(() => {
        const newPreviewUrls: string[] = [];

        selectedFiles.forEach(file => {
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                newPreviewUrls.push(url);
            } else {
                newPreviewUrls.push("");
            }
        });

        setFilePreviewUrls(newPreviewUrls);

        return () => {
            newPreviewUrls.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [selectedFiles]);

    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("drag-over");
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("drag-over");
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("drag-over");

            if (e.dataTransfer?.files) {
                const droppedFiles = Array.from(e.dataTransfer.files);
                setSelectedFiles(prev => [...prev, ...droppedFiles]);
            }
        };

        dropZone.addEventListener("dragover", handleDragOver);
        dropZone.addEventListener("dragleave", handleDragLeave);
        dropZone.addEventListener("drop", handleDrop);

        return () => {
            dropZone.removeEventListener("dragover", handleDragOver);
            dropZone.removeEventListener("dragleave", handleDragLeave);
            dropZone.removeEventListener("drop", handleDrop);
        };
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() && selectedFiles.length === 0) return;

        try {
            const messageData: MessageSendInput = {
                content: messageInput,
                multipartFileList: selectedFiles.length > 0 ? selectedFiles : undefined
            };

            await sendMessage(channelId, messageData);

            setMessageInput("");
            setSelectedFiles([]);
            setFilePreviewUrls([]);
        } catch (error) {
            console.error("Mesaj gönderme işlemi başarısız:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });

        if (filePreviewUrls[index]) {
            URL.revokeObjectURL(filePreviewUrls[index]);
        }

        setFilePreviewUrls(prev => {
            const newUrls = [...prev];
            newUrls.splice(index, 1);
            return newUrls;
        });
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("application/pdf")) {
            return (
                <div className="h-20 w-20 bg-blue-100 rounded flex items-center justify-center">
                    <div className="text-blue-600">
                        <File className="h-10 w-10" />
                    </div>
                </div>
            );
        }

        return (
            <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center">
                <File className="h-10 w-10" />
            </div>
        );
    };

    const getFileExtension = (fileName: string) => {
        return fileName.split('.').pop()?.toUpperCase() || "";
    };

    const truncateFileName = (fileName: string, maxLength: number = 20) => {
        if (fileName.length <= maxLength) return fileName;

        const extension = fileName.split('.').pop() || "";
        const nameWithoutExt = fileName.substring(0, fileName.length - extension.length - 1);

        if (nameWithoutExt.length <= maxLength - 3 - extension.length) {
            return fileName;
        }

        return `${nameWithoutExt.substring(0, maxLength - 3 - extension.length)}...${extension ? `.${extension}` : ''}`;
    };

    return (
        <div className="px-4 pb-6">
            <form onSubmit={handleSendMessage}>
                {selectedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="bg-[#2f3136] rounded-md overflow-hidden relative"
                                style={{ width: "200px", height: "200px" }}
                            >
                                <div className="absolute top-0 right-0 z-10 flex rounded bg-[#2a2c30] bg-opacity-90 p-1">
                                    <button
                                        type="button"
                                        className="text-gray-300 hover:text-white p-1"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="text-gray-300 hover:text-white p-1"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-400 hover:text-red-500 p-1"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="relative">
                                    {filePreviewUrls[index] ? (
                                        <div className="relative w-full h-[160px]">
                                            <img
                                                src={filePreviewUrls[index]}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-[160px] flex items-center justify-center p-2">
                                            <div className="flex flex-col items-center">
                                                {getFileIcon(file)}
                                                <div className="mt-2 text-gray-200 font-medium text-sm">
                                                    {getFileExtension(file.name)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap text-xs h-[40px] flex items-center">
                                    {truncateFileName(file.name, 15)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div
                    ref={dropZoneRef}
                    className="flex items-center gap-2 p-2 rounded-lg relative transition-colors duration-200"
                    style={{ background: "var(--discord-input-bg)" }}
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hover:text-white transition-colors duration-200"
                        style={{ color: "var(--discord-text-muted)" }}
                    >
                        <PlusCircle className="h-5 w-5" />
                    </Button>

                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Bir mesaj yazın"
                        className="flex-1 bg-transparent focus:outline-none text-[0.875rem] leading-[1.25rem] placeholder:text-[--discord-text-muted]"
                        style={{ color: "var(--discord-text)" }}
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="hover:text-white transition-colors duration-200"
                            style={{ color: "var(--discord-text-muted)" }}
                        >
                            <GiftIcon className="h-5 w-5" />
                        </Button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            className="hidden"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handlePaperclipClick}
                            className="hover:text-white transition-colors duration-200"
                            style={{ color: "var(--discord-text-muted)" }}
                        >
                            <Paperclip className="h-5 w-5" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="hover:text-white transition-colors duration-200"
                            style={{ color: "var(--discord-text-muted)" }}
                        >
                            <Smile className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </form>

            <style jsx>{`
                .drag-over {
                    background-color: rgba(114, 137, 218, 0.2) !important;
                    border: 2px dashed #7289da;
                }
            `}</style>
        </div>
    );
}

export default MessageInput;
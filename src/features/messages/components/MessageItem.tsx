"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Laugh,
  Edit2,
  MoreHorizontal,
  Download,
  Eye,
  File,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Message } from "@/core/types/message";

interface FileAttachment {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size?: number;
}

interface EnhancedMessage extends Message {
  attachments?: FileAttachment[];
}

interface MessageItemProps {
  message: EnhancedMessage;
  isFirstInGroup: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({message, isFirstInGroup}) => {
  const [showFullImage, setShowFullImage] = useState<string | null>(null);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("tr-TR", {
      day: undefined,
      month: undefined,
      year: undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Bilinmeyen boyut";
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("application/pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (contentType.startsWith("application/json")) {
      return <FileText className="h-6 w-6 text-yellow-500" />;
    } else if (contentType.startsWith("text/")) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else if (contentType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-green-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toUpperCase() || "";
  };

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
        })
        .catch((error) => {
          console.error("Dosya indirme hatası:", error);
          alert("Dosya indirme sırasında bir hata oluştu.");
        });
  };

  return (
      <div
          id={`message-${message.id}`}
          className="group relative flex items-start gap-4 px-2 py-0.5 hover:bg-[#404249] transition-colors duration-100 rounded-md"
      >
        {isFirstInGroup ? (
            <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                style={{ background: "var(--discord-primary)" }}
            >
              {message?.author?.username?.charAt(0).toUpperCase()}
            </div>
        ) : (
            <div className="w-10 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0 py-0.5 relative">
          {isFirstInGroup && (
              <div className="flex items-center gap-2 mb-1">
            <span
                className="text-[0.8125rem] font-medium hover:underline cursor-pointer"
                style={{ color: "var(--discord-text)" }}
            >
              {message.author?.id === "currentUserId"
                  ? "You"
                  : message.author?.username}
            </span>
                <span
                    className="text-[0.6875rem]"
                    style={{ color: "var(--discord-text-muted)" }}
                >
              {formatTime(message.timestamp)}
            </span>
              </div>
          )}

          <div className="relative">
            {/* Message content */}
            {message.content && (
                <p
                    className={`break-words text-[0.8125rem] leading-[1.1875rem] ${
                        message.isPending
                            ? "text-gray-400"
                            : "text-[var(--discord-text)]"
                    }`}
                >
                  {message.content}
                </p>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment) => (
                      <div key={attachment.id} className="relative">
                        {/* Image attachments */}
                        {attachment.contentType.startsWith("image/") && (
                            <div className="relative group/image">
                              <div
                                  className="relative rounded-lg overflow-hidden cursor-pointer border border-[#4f545c] shadow-sm"
                                  onClick={() => setShowFullImage(attachment.url)}
                              >
                                <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="max-h-[300px] w-auto rounded-lg"
                                    style={{ maxWidth: "400px" }}
                                />

                                {/* Hover toolbar */}
                                <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full bg-[#000000] bg-opacity-60 hover:bg-opacity-80 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFullImage(attachment.url);
                                      }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full bg-[#000000] bg-opacity-60 hover:bg-opacity-80 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(attachment.url, attachment.name);
                                      }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* File info */}
                              <div className="mt-1 flex items-center justify-between">
                        <span className="text-[#b9bbbe] text-xs flex items-center">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {attachment.name.length > 30
                              ? attachment.name.substring(0, 27) + "..."
                              : attachment.name}
                        </span>
                                <span className="text-[#b9bbbe] text-xs">
                          {formatFileSize(attachment.size)}
                        </span>
                              </div>
                            </div>
                        )}

                        {/* Other file types */}
                        {!attachment.contentType.startsWith("image/") && (
                            <div className="bg-[#2f3136] rounded-md overflow-hidden relative border border-[#4f545c] shadow-sm">
                              <div className="p-3 flex items-center">
                                <div className="mr-3 h-10 w-10 flex-shrink-0 bg-[#202225] flex items-center justify-center rounded">
                                  {getFileIcon(attachment.contentType)}
                                </div>
                                <div className="flex-1 min-w-0 max-w-[240px]">
                                  <div className="flex flex-col">
                            <span className="text-[#dcddde] font-medium text-sm truncate">
                              {attachment.name}
                            </span>
                                    <span className="text-[#b9bbbe] text-xs">
                              {formatFileSize(attachment.size)}
                            </span>
                                  </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-[#4e5058] text-[#b9bbbe] hover:text-white ml-2"
                                    onClick={() =>
                                        handleDownload(attachment.url, attachment.name)
                                    }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
            )}

            {!isFirstInGroup && (
                <span className="absolute top-1 -left-12 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
              {formatTime(message.timestamp)}
            </span>
            )}
          </div>
        </div>

        {/* Hover action buttons */}
        <div className="absolute right-2 top-0 hidden group-hover:flex items-center gap-0.5 py-1 px-0.5 rounded bg-[#313338] shadow-md">
          {["laugh", "edit", "more"].map((buttonType) => (
              <Button
                  key={`${message.id}-${buttonType}`}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-8 hover:bg-[#2E3035]"
                  style={{ color: "var(--discord-text-muted)" }}
              >
                {buttonType === "laugh" && <Laugh className="h-4 w-4" />}
                {buttonType === "edit" && <Edit2 className="h-4 w-4" />}
                {buttonType === "more" && <MoreHorizontal className="h-4 w-4" />}
              </Button>
          ))}
        </div>

        {/* Full-screen image modal */}
        {showFullImage && (
            <div
                className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
                onClick={() => setShowFullImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh] rounded overflow-hidden">
                <img
                    src={showFullImage}
                    alt="Full size image"
                    className="max-w-full max-h-[90vh] object-contain"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullImage(null);
                    }}
                >
                  &times;
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      const attachment = message.attachments?.find(
                          (a) => a.url === showFullImage
                      );
                      if (attachment) {
                        handleDownload(attachment.url, attachment.name);
                      }
                    }}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>
        )}
      </div>
  );
};

export default MessageItem;
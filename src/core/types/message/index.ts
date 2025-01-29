import { Author } from "@/core/types/user";

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  author: {
    id: string;
    username: string;
  };
  channelId: string;
}

export interface WebSocketMessage {
  type: "MESSAGE" | "TYPING" | "READ";
  payload: Message;
  channelId: string;
  timestamp: string;
}

interface Attachment {
  id: string;
  name: string;
  sizeInKb: number;
  type: FileType;
  url: string;
}

interface Mention {
  id: string;
  userId: string;
}

enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file",
}

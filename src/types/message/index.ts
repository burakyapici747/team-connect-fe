export interface Message {
    id: string;
    channelId: string;
    authorId: string;
    content: string;
    timestamp: string;
    editedTimestamp?: string;
    pinned: boolean;
    type?: number;
    attachments?: Attachment[];
    mentions?: Mention[];
    reactions?: Map<string, number>[];
}


interface Attachment {
    id: string;
    name: string;
    sizeInKb: number;
    type: FileType;
    url: string;
}

interface Mention{
    id: string;
    userId: string;
}

enum FileType {
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    FILE = "file",
}
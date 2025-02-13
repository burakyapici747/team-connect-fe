interface Attachment {
    id: string;
    name: string;
    sizeInKb: number;
    type: string;
    url: string;
}

interface Mention {
    id: string;
    userId: string;
}

interface AuthorOutput {
    id: string;
    username: string;
    avatarFileId: string;
    avatarFileUrl: string;
}

export interface WebsocketMessageOutput {
    id: string;
    channelId: string;
    content: string;
    timestamp: string;
    editedTimestamp: string;
    pinned: boolean;
    type: number;
    attachments: Attachment[];
    mentions: Mention[];
    reactions: Record<string, number>[];
    author: AuthorOutput;
}

export interface DMChannel {
  id: string;
  name: string;
  topic?: string;
  lastMessageId: string;
  userLimit?: number;
  rateLimitPerUser?: number;
  recipients: string[];
  icon?: string;
  ownerId: string;
}

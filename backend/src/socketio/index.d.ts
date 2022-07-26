import { Message } from '@prisma/client';

interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

export interface ChannelMetadata {
  unreadMessageCount: number;
}

interface SocketMessageCreate {
  data: Message;
  metadata: ChannelMetadata;
}

interface SocketMessageUpdate {
  data: Message;
}

interface SocketMessageDelete {
  messageId: string;
}

type SocketMessageResponse =
  | SocketMessageCreate
  | SocketMessageUpdate
  | SocketMessageDelete;

type SocketResponse = SocketMessageResponse;

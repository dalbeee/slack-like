import { Message } from '@prisma/client';

interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

type SocketReactionType = 'reaction';
type SocketMessageType = 'message.create' | 'message.update' | 'message.delete';

export interface ChannelMetadata {
  latestMessageId: string;
  lastCheckMessageId: string;
}

type SocketReactionData = {
  type: SocketReactionType;
  channelId: string;
  data: ChannelMetadata;
};

interface SocketMessageCreate {
  type: 'message.create';
  data: Message;
}

interface SocketMessageUpdate {
  type: 'message.update';
  data: Message;
}

interface SocketMessageDelete {
  type: 'message.delete';
  data: { messageId: string };
}

type SocketMessageData =
  | SocketMessageCreate
  | SocketMessageUpdate
  | SocketMessageDelete;

type SocketResponse = (SocketReactionData | SocketMessageData) & {
  socketInfo: SocketInfo;
};

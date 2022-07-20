import { Message } from '@prisma/client';

interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

type SocketChannelType = 'channel';
type SocketMessageType = 'message.create' | 'message.update' | 'message.delete';

export interface ChannelMetadata {
  unreadMessageCount: number;
}

type SocketChannelData = {
  type: SocketChannelType;
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

type SocketResponse = (SocketChannelData | SocketMessageData) & {
  socketInfo: SocketInfo;
};

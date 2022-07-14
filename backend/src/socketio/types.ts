import { Message } from '@prisma/client';

export interface SocketIOInfo {
  workspaceId: string;
  channelId: string;
}

export interface SocketIOMessage {
  socketInfo: SocketIOInfo;
  type: 'message' | 'reaction';
  channelTo?: string;
  message: Message | string;
}

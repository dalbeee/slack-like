import { Message } from '@prisma/client';

interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

type SocketReactionTarget = 'mention' | 'channel' | 'bookmark';

type Reaction = {
  target: SocketReactionTarget;
  channelId?: string;
};

interface SocketMessage {
  socketInfo: SocketInfo;
  type: 'message';
  data: Message;
  channelTo: string;
}

interface SocketReaction {
  socketInfo: SocketInfo;
  type: 'reaction';
  data: Reaction;
}

export type SocketResponse = SocketMessage | SocketReaction;

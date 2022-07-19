interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

type SocketReactionType = "reaction";
type SocketMessageType = "message.create" | "message.update" | "message.delete";

type SocketReactionData = {
  type: SocketReactionType;
  channelId: string;
  data: {
    latestMessageId: string;
    lastCheckMessageId: string;
  };
};

interface SocketMessageCreate {
  type: "message.create";
  data: Message;
}

interface SocketMessageUpdate {
  type: "message.update";
  data: Message;
}

interface SocketMessageDelete {
  type: "message.delete";
  data: { messageId: string };
}

type SocketMessageData =
  | SocketMessageCreate
  | SocketMessageUpdate
  | SocketMessageDelete;

type SocketResponse = (SocketReactionData | SocketMessageData) & {
  socketInfo: SocketInfo;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
};

export interface ChannelData {
  Messages: Message[];
  Users: [];
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  id: string;
  name: string;
  workspaceId: string;
}

export type ChannelWithState = Channel & {
  latestMessageId?: string;
  lastCheckMessageId?: string;
};

export interface ChannelsHashMap {
  byId: string[];
  byHash: { [key: string]: ChannelWithState };
}

////
export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserJwtToken = {
  access_token?: string;
  refresh_token?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  timezone: string | null;
  status: string | null;
  pictureSrc: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserLoginDto = {
  email: string;
  password: string;
};

export type Workspace = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

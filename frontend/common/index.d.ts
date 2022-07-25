interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

type SocketChannelType = "channel.setZeroUnreadMessageCount";
type SocketMessageType = "message.create" | "message.update" | "message.delete";

export interface ChannelMetadata {
  unreadMessageCount: number;
}

type SocketChannelData = {
  type: SocketChannelType;
  channelId: string;
  data: ChannelMetadata;
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

type SocketResponse = (SocketChannelData | SocketMessageData) & {
  socketInfo: SocketInfo;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ancestorId: string;
  userId: string;
  workspaceId: string;
  channelId: string;
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

export interface ChannelsHashMap {
  byId: string[];
  byHash: { [key: string]: Channel };
}

export type HttpChannelMetadataResponse = {
  [channelId: string]: ChannelMetadata;
};

export type ChannelMetadata = {
  latestMessageId?: string;
  lastCheckMessageId?: string;
};
////
export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
} & ChannelMetadata;

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

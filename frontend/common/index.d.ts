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

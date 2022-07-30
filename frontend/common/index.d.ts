// http

export type ChannelDataResponse = {
  workspaceId: string;
  channels: ChannelData[];
};

// socket
interface SocketInfo {
  workspaceId: string;
  channelId: string;
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

// AppSlice
export interface AppState {
  initialize: boolean;
  currentWorkspaceId?: string;
  currentChannelId?: string;
  currentChannelData: ChannelData;
  workspaces: WorkspacesHashMap;
}

export interface UpdateChannelMetadata {
  socketInfo: SocketInfo;
  metadata: ChannelMetadata;
}

export interface ChannelMetadata {
  unreadMessageCount?: number;
}

export type WorkspaceData = Workspace & {
  hasNewMessage: boolean;
  channels: ChannelsHashMap;
};

export type ChannelData = Channel & ChannelMetadata;

export interface WorkspacesHashMap {
  byId: string[];
  byHash: { [workspaceId: string]: WorkspaceData };
}

export interface ChannelsHashMap {
  byId: string[];
  byHash: { [channelId: string]: ChannelData };
}

//

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

export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  Users: User[];
  Messages: Message[];
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
  avatar?: string;
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

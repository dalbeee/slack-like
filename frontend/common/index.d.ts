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

// AppSlice
export interface AppState {
  initialize: boolean;
  currentWorkspaceId?: string;
  currentChannelId?: string;
  currentChannelData: ChannelData;
  workspaces: WorkspacesHashMap;
}

/*
 * this type used only frontend, not communicate to backend
 */
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

// User
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

// Workspace
export type Workspace = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Channel
export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  users: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  type: "PUBLIC" | "PRIVATE" | "DIRECT_MESSAGE";
};

// Message
export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ancestorId: string;
  reactions: MessageReaction[];
  userId: string;
  channelId: string;
  workspaceId: string;
};

// MessageReaction
export type MessageReaction = {
  id: string;
  userId: string;
  messageId: string;
  content: string;
  createdAt: Date;
  users: User[];
  messages: Message[];
};

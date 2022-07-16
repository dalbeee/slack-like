export interface SocketInfo {
  workspaceId: string;
  channelId: string;
}

type SocketReactionTarget = "mention" | "channel" | "bookmark";

type Reaction = {
  target: SocketReactionTarget;
  channelId?: string;
};

export interface SocketMessage {
  socketInfo: SocketInfo;
  type: "message";
  data: Message;
  channelTo: string;
}

export interface SocketReaction {
  socketInfo: SocketInfo;
  type: "reaction";
  data: Reaction;
}

export type SocketResponse = SocketMessage | SocketReaction;

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

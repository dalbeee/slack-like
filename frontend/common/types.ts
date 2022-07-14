export interface SocketIOInfo {
  workspaceId: string;
  channelId: string;
}

export interface SocketIOMessage {
  socketInfo: SocketIOInfo;
  type: "message" | "reaction";
  channelTo?: string;
  message: string;
}

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
};

export interface FetchData {
  Messages: Message[];
  Users: [];
  createdAt: Date;
  updatedAt: Date;
  description: null;
  id: string;
  name: string;
  workspaceId: string;
}

export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
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

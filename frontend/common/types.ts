export interface SocketIOInfo {
  workspaceId: string;
  channelId: string;
  userId?: string;
}

export interface SocketIOMessage {
  socketInfo: SocketIOInfo;
  type: "message" | "reaction";
  channelTo?: string;
  message: string;
}
